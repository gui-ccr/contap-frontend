export function Header() {
  return (
    <header className="h-16 bg-[#131313]/80 border-b border-white/10 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="text-gray-400 text-sm">
        Bem-vindo de volta!
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs">
          US
        </div>
      </div>
    </header>
  );
}