import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/contrato-form.scss'

type Dt = { id: number; nombre: string; apellido: string }
type Jugador = { id: number; nombre: string; apellido: string }
type Equipo = { id: number; nombre: string }

export default function ContratoForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [dtsOptions, setDtsOptions] = useState<Dt[]>([])
  const [jugadoresOptions, setJugadoresOptions] = useState<Jugador[]>([])
  const [equiposOptions, setEquiposOptions] = useState<Equipo[]>([])

  const [cdContrato, setCdContrato] = useState('')
  const [fechaIni, setFechaIni] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [fechaRealFin, setFechaRealFin] = useState('')
  const [dtId, setDtId] = useState<number | ''>('')
  const [jugadorId, setJugadorId] = useState<number | ''>('')
  const [equipoId, setEquipoId] = useState<number | ''>('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(() => {
    fetch('/api/dts').then(r => r.json()).then(j => setDtsOptions(j.data || [])).catch(err => setMsg(err.message || String(err)))
    fetch('/api/jugadores').then(r => r.json()).then(j => setJugadoresOptions(j.data || [])).catch(err => setMsg(err.message || String(err)))
    fetch('/api/equipos').then(r => r.json()).then(j => setEquiposOptions(j.data || [])).catch(err => setMsg(err.message || String(err)))

    if(editingId){
      fetch('/api/contrato/' + editingId).then(r => r.json()).then(d => {
        const data = d.data || {}
        setCdContrato(data.cdContrato || '')
        setFechaIni(data.fechaIni || '')
        setFechaFin(data.fechaFin || '')
        setFechaRealFin(data.fechaRealFin || '')
        setDtId(data.dt?.id ?? data.dt ?? '')
        setJugadorId(data.jugador?.id ?? data.jugador ?? '')
        setEquipoId(data.equipo?.id ?? data.equipo ?? '')
      }).catch(err => setMsg(String(err)))
    }
  }, [editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setMsg('')
    setOut(null)

    const payload = {
      cdContrato: String(cdContrato || '').trim(),
      fechaIni: String(fechaIni || '').trim(),
      fechaFin: String(fechaFin || '').trim(),
      fechaRealFin: String(fechaRealFin || '').trim() || undefined,
      dt: Number(dtId || 0),
      jugador: Number(jugadorId || 0),
      equipo: Number(equipoId || 0),
    }

    try{
      const url = editingId ? '/api/contrato/' + editingId : '/api/contrato'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
      if(!editingId){
        setCdContrato('')
        setFechaIni('')
        setFechaFin('')
        setFechaRealFin('')
        setDtId('')
        setJugadorId('')
        setEquipoId('')
      }
    }catch(err:any){
      setMsg(err.message || String(err))
    }
  }

  async function doDelete(){
    if(!editingId) return
    if(!confirm('Eliminar contrato #' + editingId + '?')) return
    const res = await fetch('/api/contrato/' + editingId, { method: 'DELETE' })
    if(!res.ok){
      const d = await res.json().catch(()=>({}))
      setMsg(d.message || 'Error')
      return
    }
    navigate('/contratos')
  }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Contrato #${editingId}` : 'Nuevo Contrato'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Código de contrato</span>
            <input className="input" name="cdContrato" required value={cdContrato} onChange={e=>setCdContrato(e.target.value)} />
          </label>
          <div></div>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Fecha inicio</span>
            <input className="input" type="date" name="fechaIni" required value={fechaIni} onChange={e=>setFechaIni(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Fecha fin (pactada)</span>
            <input className="input" type="date" name="fechaFin" required value={fechaFin} onChange={e=>setFechaFin(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Fecha real de fin</span>
            <input className="input" type="date" name="fechaRealFin" value={fechaRealFin} onChange={e=>setFechaRealFin(e.target.value)} />
          </label>
          <div></div>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Jugador</span>
            <select className="input" name="jugador" required value={String(jugadorId)} onChange={e=>setJugadorId(Number(e.target.value)||'')}>
              <option value="" disabled>Seleccione un jugador...</option>
              {jugadoresOptions.map(j => (
                <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>
              ))}
            </select>
          </label>
          <label className="form__label">
            <span className="label__title">Director Técnico</span>
            <select className="input" name="dt" required value={String(dtId)} onChange={e=>setDtId(Number(e.target.value)||'')}>
              <option value="" disabled>Seleccione un DT...</option>
              {dtsOptions.map(d => (
                <option key={d.id} value={d.id}>{d.nombre} {d.apellido}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Equipo</span>
            <select className="input" name="equipo" required value={String(equipoId)} onChange={e=>setEquipoId(Number(e.target.value)||'')}>
              <option value="" disabled>Seleccione un equipo...</option>
              {equiposOptions.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.nombre}</option>
              ))}
            </select>
          </label>
          <div></div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/contratos" className="btn btn--primary">Listado</Link>
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
