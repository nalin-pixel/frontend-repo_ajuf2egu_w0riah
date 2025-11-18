import { useEffect, useState } from 'react'

export default function ProviderImport({ itineraryId, onImported }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [providers, setProviders] = useState([])
  const [provider, setProvider] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/providers`)
        const data = await res.json()
        setProviders(data.providers || [])
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${baseUrl}/api/import/provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary_id: itineraryId, provider, access_token: token })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(`Imported ${data.created} item(s) from ${provider}.`)
        onImported?.()
      } else {
        setMessage(data.detail || 'Import failed')
      }
    } catch (e) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select value={provider} onChange={e=>setProvider(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white" required>
          <option value="">Select provider</option>
          {providers.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Access token / API key" className="sm:col-span-2 bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" required />
        <button disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded">{loading ? 'Importing...' : 'Import'}</button>
      </form>
      {message && <p className="text-xs text-slate-400 mt-2">{message}</p>}
    </div>
  )
}
