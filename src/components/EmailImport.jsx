import { useState } from 'react'

export default function EmailImport({ itineraryId, onImported }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [providerHint, setProviderHint] = useState('')
  const [messagesJson, setMessagesJson] = useState('[\n  {"subject": "Your booking is confirmed", "sender": "noreply@booking.com", "body_text": "Hotel ABC in Paris. Confirmation # ABC123. Check-in 2025-04-10 15:00, Check-out 2025-04-12 11:00"}\n]')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      let msgs = []
      try {
        msgs = JSON.parse(messagesJson)
      } catch (err) {
        setMessage('Invalid JSON')
        setLoading(false)
        return
      }

      const res = await fetch(`${baseUrl}/api/import/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary_id: itineraryId,
          provider_hint: providerHint || null,
          messages: msgs,
        })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(`Imported ${data.created} item(s) from email.`)
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
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={providerHint} onChange={e=>setProviderHint(e.target.value)} placeholder="Provider hint (optional) e.g., booking.com" className="bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" />
          <div className="sm:col-span-2">
            <textarea value={messagesJson} onChange={e=>setMessagesJson(e.target.value)} rows={4} className="w-full bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400" placeholder="Paste JSON array of messages: subject, sender, body_text" />
          </div>
        </div>
        <div>
          <button disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded">{loading ? 'Importing...' : 'Import from Email'}</button>
        </div>
        {message && <p className="text-xs text-slate-400 mt-1">{message}</p>}
      </form>
    </div>
  )
}
