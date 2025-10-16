import Layout from "../components/Layout";
import MovieCard from "../components/MovieCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/movies")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.results || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl mb-6">Фильмы и сериалы</h1>
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