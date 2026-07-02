export default function UniqueSpinner() {
  return (
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 border-4 border-transparent border-t-yellow-400 border-r-red-500 rounded-full animate-spin" style={{animationDuration: '0.6s'}}></div>
      <div className="absolute inset-0 flex items-center justify-center text-2xl animate-spin" style={{animationDuration: '1.4s'}}>🌮</div>
    </div>
  );
}
