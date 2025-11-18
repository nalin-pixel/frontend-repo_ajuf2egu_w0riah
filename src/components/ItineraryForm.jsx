import { useState } from 'react'

export default function ItineraryForm({ onCreated }) {
  const [name, setName] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [locations, setLocations] = useState('')
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const body = {
        name,
        start_date: new Date(start).toISOString(),
        end_date: new Date(end).toISOString(),
        locations: locations ? locations.split(',').map(s => s.trim()).filter(Boolean) : [],
        notes: ''
      }
      const res = await fetch(`${baseUrl}/api/itineraries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        onCreated?.(data)
        setName(''); setStart(''); setEnd(''); setLocations('')
      } else {
        alert(data.detail || 'Failed to create itinerary')
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Trip name" className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" required />
        <input type="text" value={locations} onChange={e=>setLocations(e.target.value)} placeholder="Locations (comma-separated)" className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" />
        <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" required />
        <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" required />
      </div>
      <button disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded">
        {loading ? 'Creating...' : 'Create Itinerary'}
      </button>
    </form>
  )
}
