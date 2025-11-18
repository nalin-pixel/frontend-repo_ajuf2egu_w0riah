import { Calendar } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-white font-semibold leading-5">Trip Hub</h1>
          <p className="text-xs text-slate-400 -mt-0.5">All your reservations in one place</p>
        </div>
      </div>
    </header>
  )
}
