export default function MovieCard({ item }) {
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
    : "/placeholder-poster.jpg";

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <a
        href={item.partnerLink || "https://e4sy.shop/3/rd.php?url=/p/HyZHfHe0HSr"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={poster}
          alt={item.title}
          className="w-full h-56 object-cover rounded"
        />
      </a>
      <h3 className="mt-2 text-sm text-center text-blue-600">
        <a
          href={item.partnerLink || "https://e4sy.shop/3/rd.php?url=/p/HyZHfHe0HSr"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.title}
        </a>
      </h3>
    </div>
  );
}