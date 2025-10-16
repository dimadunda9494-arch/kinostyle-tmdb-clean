import fs from "fs";
import path from "path";
import JSON5 from "json5";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

const API_KEY = process.env.TMDB_API_KEY;
const proxies = [
  "http://gO4X2pYXuO:hS17ers9lj@45.132.252.51:31332",
  "http://LNmsxHNu3N:RYL4s6s6rZNE@103.82.103.177:58114",
  "http://qfW1PBtHcK:wxlEFnybhf@193.168.224.95:50706",
];

const partnerLinksPath = path.join(process.cwd(), "partner_links.json5");

const MAX_RETRIES = 3;

const fetchWithProxy = async (url) => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    const agent = new HttpsProxyAgent(proxy);
    try {
      const resp = await fetch(url, { agent });

      if (!resp.ok) {
        console.warn(`Прокси ${proxy} вернул статус ${resp.status}. Попытка ${i + 1}`);
        continue; // попробовать другой прокси
      }

      const text = await resp.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn(`Прокси ${proxy} вернул некорректный JSON. Попытка ${i + 1}`);
        console.warn("Ответ (первые 200 символов):", text.slice(0, 200));
        continue;
      }
    } catch (err) {
      console.warn(`Ошибка запроса через прокси ${proxy}: ${err.message}. Попытка ${i + 1}`);
      continue;
    }
  }
  throw new Error("Все прокси не сработали или API TMDB недоступен");
};

export default async function handler(req, res) {
  const { category } = req.query;

  try {
    const cachePath = path.join(process.cwd(), "cache_movies.json");
    const now = Date.now();

    let cache = fs.existsSync(cachePath)
      ? JSON.parse(fs.readFileSync(cachePath, "utf8"))
      : { updated: 0, movies: [] };

    if (now - cache.updated < 24 * 60 * 60 * 1000 && cache.movies.length > 0) {
      return res.status(200).json(cache.movies);
    }

    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ru-RU&page=1`;
    if (category && category !== "all") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ru-RU&page=1&with_genres=${category}`;
    }

    const movies = await fetchWithProxy(url);
    const tv = await fetchWithProxy(
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=ru-RU&page=1`
    );

    let partnerLinks = fs.existsSync(partnerLinksPath)
      ? JSON5.parse(fs.readFileSync(partnerLinksPath, "utf8"))
      : { default: "https://e4sy.shop/3/rd.php?url=/p/HyZHfHe0HSr" };

    const normalize = (it, type) => ({
      id: `${type}_${it.id}`,
      tmdb_id: it.id,
      type,
      title: it.title || it.name,
      poster_path: it.poster_path,
      overview: it.overview,
      partnerLink: partnerLinks[`${type}_${it.id}`] || partnerLinks.default,
    });

    const all = [
      ...movies.results.map((m) => normalize(m, "movie")),
      ...tv.results.map((t) => normalize(t, "tv")),
    ];

    let added = 0;
    all.forEach((item) => {
      if (!partnerLinks[item.id]) {
        partnerLinks[item.id] = partnerLinks.default;
        added++;
      }
    });

    if (added > 0) {
      fs.writeFileSync(partnerLinksPath, JSON5.stringify(partnerLinks, null, 2));
    }

    const newCache = { updated: now, movies: all };
    fs.writeFileSync(cachePath, JSON.stringify(newCache, null, 2));

    res.status(200).json(all);
  } catch (err) {
    console.error("Ошибка при получении фильмов:", err);
    res.status(500).json({ error: "Ошибка обновления фильмов" });
  }
}
