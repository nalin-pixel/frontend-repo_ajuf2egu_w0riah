import { useState } from 'react'
import Header from './components/Header'
import ItineraryList from './components/ItineraryList'
import ReservationPanel from './components/ReservationPanel'

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        <section className="md:col-span-1">
          <ItineraryList onSelect={setSelected} />
        </section>
        <section className="md:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="p-4 rounded border border-slate-800 bg-slate-900/60">
                <h2 className="text-white font-semibold text-lg">{selected.name}</h2>
                <p className="text-xs text-slate-400">{new Date(selected.start_date).toLocaleDateString()} – {new Date(selected.end_date).toLocaleDateString()}</p>
              </div>
              <ReservationPanel itinerary={selected} />
            </div>
          ) : (
            <div className="h-full min-h-[300px] grid place-items-center p-8 rounded border border-dashed border-slate-800 bg-slate-900/40 text-slate-400">
              Select an itinerary or create a new one to see reservations.
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
