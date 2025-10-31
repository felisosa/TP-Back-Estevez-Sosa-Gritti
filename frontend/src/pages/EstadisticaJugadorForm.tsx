import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/estadistica-jugador-form.scss'

type Jugador = { id: number; nombre: string; apellido: string; dni: string }

export default function EstadisticaJugadorForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [temporada, setTemporada] = useState('')
  const [goles, setGoles] = useState('')
  const [asistencias, setAsistencias] = useState('')
  const [amarillas, setAmarillas] = useState('')
  const [rojas, setRojas] = useState('')
  const [jugadorId, setJugadorId] = useState<number | ''>('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(() => {
    fetch('/api/jugadores').then(r => r.json()).then(j => setJugadores(j.data || [])).catch(err => setMsg(err.message || String(err)))
    if(editingId){
      fetch('/api/estadisticasJugador/' + editingId).then(r=>r.json()).then(d=>{
        const data = d.data || {}
        setTemporada(String(data.temporada || ''))
        setGoles(String(data.goles || ''))
        setAsistencias(String(data.asistencias || ''))
        setAmarillas(String(data.amarillas || ''))
        setRojas(String(data.rojas || ''))
        setJugadorId(data.jugador?.id ?? data.jugador ?? '')
      }).catch(e=>setMsg(String(e)))
    }
  }, [editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setOut(null)
    const payload = { temporada: Number(temporada||0), goles: Number(goles||0), asistencias: Number(asistencias||0), amarillas: Number(amarillas||0), rojas: Number(rojas||0), jugador: Number(jugadorId||0) }
    try{
      const url = editingId ? '/api/estadisticasJugador/' + editingId : '/api/estadisticasJugador'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
      if(!editingId){ setTemporada(''); setGoles(''); setAsistencias(''); setAmarillas(''); setRojas(''); setJugadorId('') }
    }catch(err:any){ setMsg(err.message || String(err)) }
  }

  async function doDelete(){ if(!editingId) return; if(!confirm('Eliminar estadística #' + editingId + '?')) return; const res = await fetch('/api/estadisticasJugador/' + editingId, { method: 'DELETE' }); if(!res.ok){ const d = await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; navigate('/estadisticas-jugador') }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Estadística #${editingId}` : 'Nueva Estadística de Jugador'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Temporada</span>
            <input className="input" name="temporada" required value={temporada} onChange={e=>setTemporada(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Goles</span>
            <input className="input" name="goles" required value={goles} onChange={e=>setGoles(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Asistencias</span>
            <input className="input" name="asistencias" required value={asistencias} onChange={e=>setAsistencias(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Amarillas</span>
            <input className="input" name="amarillas" required value={amarillas} onChange={e=>setAmarillas(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Rojas</span>
            <input className="input" name="rojas" required value={rojas} onChange={e=>setRojas(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Jugador</span>
            <select className="input" name="jugador" required value={String(jugadorId)} onChange={e=>setJugadorId(Number(e.target.value)||'')}>
              <option value="" disabled>Seleccione un jugador…</option>
              {jugadores.map(j => (
                <option key={j.id} value={j.id}>{j.nombre} {j.apellido} ({j.dni})</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/estadisticas-jugador" className="btn btn--primary">Listado</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && (
        <div className="form__success" role="status" aria-live="polite">
          <div className="success__title">{out.message || (editingId ? 'Actualizado' : 'Creado')}</div>
          <div className="success__body">
            {out.data ? (
              <dl>
                {Object.entries(out.data).map(([k, v]) => (
                  <div key={k} className="success__row"><dt>{k}</dt><dd>{typeof v === 'object' && v !== null ? (((v as any).nombre) ? `${(v as any).nombre} ${(v as any).apellido || ''} (id:${(v as any).id})` : JSON.stringify(v)) : String(v)}</dd></div>
                ))}
              </dl>
            ) : <div>{JSON.stringify(out)}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
