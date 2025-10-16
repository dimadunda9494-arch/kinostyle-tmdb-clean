import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const url = category === "all"
        ? "/api/movies"
        : `/api/movies?category=${category}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setItems(data.results || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  return (
    <Layout>
      <h1 className="text-2xl mb-6">Фильмы и Сериалы</h1>
      
      {/* Выпадающий список категорий */}
      <select
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        className="mb-6 p-2 border border-gray-300 rounded"
      >
        <option value="all">Все категории</option>
        <option value="35">Комедия</option>
        <option value="28">Боевик</option>
        <option value="12">Приключения</option>
        <option value="18">Драма</option>
        <option value="27">Ужасы</option>
        <option value="10751">Семейный</option>
        <option value="10752">Военный</option>
        <option value="99">Документальный</option>
        <option value="10759">Сериалы</option>
        <option value="36">Исторический</option>
        <option value="80">Криминал</option>
        <option value="10764">Мультфильм</option>
        <option value="10770">ТВ-шоу</option>
        <option value="10402">Музыка</option>
        <option value="9648">Детектив</option>
      </select>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {items.map((it) => (
            <MovieCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </Layout>
  );
}
