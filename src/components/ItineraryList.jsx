import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import ItineraryForm from './ItineraryForm'

export default function ItineraryList({ onSelect }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/itineraries`)
    const data = await res.json()
    setItems(data)
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">Your Itineraries</h2>
        <button onClick={() => setOpen(v=>!v)} className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1">
          <PlusCircle className="w-4 h-4" /> New
        </button>
      </div>

      {open && (
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <ItineraryForm onCreated={(it)=>{ setOpen(false); load(); onSelect?.(it) }} />
        </div>
      )}

      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id}>
            <button onClick={()=>onSelect?.(it)} className="w-full text-left p-3 rounded border border-slate-800 hover:border-blue-700 bg-slate-900/60 hover:bg-slate-900 transition text-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{it.name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(it.start_date).toLocaleDateString()} – {new Date(it.end_date).toLocaleDateString()}
                  </p>
                </div>
                {it.locations?.length > 0 && (
                  <p className="text-xs text-slate-400">{it.locations.join(', ')}</p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
