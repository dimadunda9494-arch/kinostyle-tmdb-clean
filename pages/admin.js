"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/partnerLinks")
      .then((r) => r.json())
      .then((d) => setContent(d.content));
  }, []);

  const save = async () => {
    const res = await fetch("/api/partnerLinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, content }),
    });
    const data = await res.json();
    if (data.ok) setMessage("✅ Сохранено успешно!");
    else setMessage("❌ Ошибка: " + (data.error || "неизвестная"));
  };

  const updateMovies = async () => {
    setLoading(true);
    setMessage("⏳ Обновление фильмов...");
    const res = await fetch("/api/movies");
    if (res.ok) {
      setMessage("✅ Фильмы и сериалы обновлены!");
    } else {
      setMessage("❌ Ошибка обновления фильмов");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Редактор partner_links.json5</h1>
      <input
        type="password"
        placeholder="Пароль"
        className="border p-2 mb-3 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <textarea
        rows={20}
        className="w-full border p-2 font-mono text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-3 mt-3">
        <button
          onClick={save}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          💾 Сохранить
        </button>
        <button
          onClick={updateMovies}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🔄 Обновить фильмы
        </button>
      </div>
      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}
