import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import ProviderImport from './ProviderImport'
import EmailImport from './EmailImport'

export default function ReservationPanel({ itinerary }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [provider, setProvider] = useState('')
  const [location, setLocation] = useState('')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')

  const load = async () => {
    if (!itinerary) return
    const params = new URLSearchParams()
    if (q) params.append('q', q)
    if (category) params.append('category', category)
    if (provider) params.append('provider', provider)
    if (location) params.append('location', location)
    if (rangeStart) params.append('start', new Date(rangeStart).toISOString())
    if (rangeEnd) params.append('end', new Date(rangeEnd).toISOString())

    const url = `${baseUrl}/api/itineraries/${itinerary.id}/reservations?${params.toString()}`
    const res = await fetch(url)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [itinerary?.id])

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white">
            <option value="">All types</option>
            <option value="lodging">Lodging</option>
            <option value="flight">Flight</option>
            <option value="activity">Activity</option>
            <option value="transport">Transport</option>
            <option value="dining">Dining</option>
            <option value="other">Other</option>
          </select>
          <input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="Provider" className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" />
          <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" />
          <input type="date" value={rangeStart} onChange={e=>setRangeStart(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white" />
          <input type="date" value={rangeEnd} onChange={e=>setRangeEnd(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white" />
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          <button onClick={load} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center gap-2">
            <Filter className="w-4 h-4" /> Apply Filters
          </button>
          <button onClick={()=>{setQ('');setCategory('');setProvider('');setLocation('');setRangeStart('');setRangeEnd(''); load();}} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded">
            Reset
          </button>
        </div>

        <div className="border-t border-slate-800 pt-3 grid gap-3">
          <div>
            <p className="text-sm text-slate-300 mb-2">Import from providers</p>
            <ProviderImport itineraryId={itinerary.id} onImported={load} />
          </div>
          <div>
            <p className="text-sm text-slate-300 mb-2">Import from email</p>
            <EmailImport itineraryId={itinerary.id} onImported={load} />
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((r)=> (
          <li key={r.id} className="p-4 rounded border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{r.title}</p>
                <p className="text-xs text-slate-400">{r.provider} • {r.category}{r.location ? ` • ${r.location}` : ''}</p>
                {(r.start_time || r.end_time) && (
                  <p className="text-xs text-slate-400">{r.start_time ? new Date(r.start_time).toLocaleString() : ''} {r.end_time ? ' → ' + new Date(r.end_time).toLocaleString() : ''}</p>
                )}
                {r.confirmation_number && (
                  <p className="text-xs text-slate-500">Ref: {r.confirmation_number}</p>
                )}
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-slate-400 text-sm p-6 text-center border border-dashed border-slate-700 rounded">No reservations yet. Import from email or providers, or add via API.</li>
        )}
      </ul>
    </div>
  )
}
