import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-cyan-400">
            KINOHOOT
          </Link>
          <nav>
            <ul className="flex gap-4 text-sm">
              <li className="group relative">
                <span className="cursor-pointer">Категории</span>
                <div className="absolute hidden group-hover:block mt-2 bg-white text-gray-800 shadow rounded">
                  <a className="block px-4 py-2 hover:bg-gray-100" href="/?genre=35">Комедия</a>
                  <a className="block px-4 py-2 hover:bg-gray-100" href="/?genre=878">Фантастика</a>
                  <a className="block px-4 py-2 hover:bg-gray-100" href="/?type=tv">Сериалы</a>
                </div>
              </li>
              <li><a href="#" className="text-sm">Регистрация</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-sm text-gray-600">
          © {new Date().getFullYear()} KINOHOOT — демо
        </div>
      </footer>
    </div>
  );
}