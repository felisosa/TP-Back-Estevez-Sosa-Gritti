import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/lesion-form.scss'

type Jugador = { id: number; nombre: string; apellido: string; dni: string }
type TipoLesion = { id: number; cdTipoLesion?: string }

export default function LesionForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [tipos, setTipos] = useState<TipoLesion[]>([])
  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  const [cdLesion, setCdLesion] = useState('')
  const [descLesion, setDescLesion] = useState('')
  const [jugadorId, setJugadorId] = useState<number | ''>('')
  const [tipoLesionId, setTipoLesionId] = useState<number | ''>('')

  useEffect(() => {
    Promise.all([
      fetch('/api/jugadores').then(r => r.json()),
      fetch('/api/tipoLesiones').then(r => r.json()),
    ]).then(([j,t]) => {
      setJugadores(j.data ?? [])
      setTipos(t.data ?? [])
    }).catch(err => setMsg(err.message || String(err)))

    if(editingId){
      fetch('/api/lesiones/' + editingId).then(r => r.json()).then(d => {
        const data = d.data || {}
        setCdLesion(data.cdLesion || '')
        setDescLesion(data.descLesion || '')
        setJugadorId(data.jugador?.id ?? data.jugador ?? '')
        setTipoLesionId(data.tipoLesion?.id ?? data.tipoLesion ?? '')
      }).catch(err => setMsg(String(err)))
    }
  }, [editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setMsg('')
    setOut(null)

    const payload = {
      cdLesion: String(cdLesion||'').trim(),
      descLesion: String(descLesion||'').trim(),
      jugador: Number(jugadorId||0),
      tipoLesion: Number(tipoLesionId||0),
    }

    try{
      const url = editingId ? '/api/lesiones/' + editingId : '/api/lesiones'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
      if(!editingId) {
        // reset
        setCdLesion('')
        setDescLesion('')
        setJugadorId('')
        setTipoLesionId('')
      }
    }catch(err:any){
      setMsg(err.message || String(err))
    }
  }

  async function doDelete(){
    if(!editingId) return
    if(!confirm('Eliminar lesión #' + editingId + '?')) return
    const res = await fetch('/api/lesiones/' + editingId, { method: 'DELETE' })
    if(!res.ok){ const d = await res.json().catch(()=>({})); setMsg(d.message||'Error'); return }
    navigate('/lesiones')
  }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Lesión #${editingId}` : 'Nueva Lesión'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Código de Lesión</span>
            <input className="input" name="cdLesion" required value={cdLesion} onChange={e=>setCdLesion(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Descripción</span>
            <input className="input" name="descLesion" required value={descLesion} onChange={e=>setDescLesion(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Jugador</span>
            <select className="input" name="jugador" required value={String(jugadorId)} onChange={e=>setJugadorId(Number(e.target.value)||'')}>
              <option value="" disabled>Seleccione un jugador…</option>
              {jugadores.map(j => (
                <option key={j.id} value={j.id}>{j.nombre} {j.apellido} ({j.dni})</option>
              ))}
            </select>
          </label>
          <label className="form__label">
            <span className="label__title">Tipo de lesión</span>
            <select className="input" name="tipoLesion" required value={String(tipoLesionId)} onChange={e=>setTipoLesionId(Number(e.target.value)||'')}>
              <option value="" disabled>Seleccione un tipo…</option>
              {tipos.map(t => (
                <option key={t.id} value={t.id}>{t.cdTipoLesion || `Tipo ${t.id}`}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/lesiones" className="btn">Volver al listado</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && <pre className="form__output">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
