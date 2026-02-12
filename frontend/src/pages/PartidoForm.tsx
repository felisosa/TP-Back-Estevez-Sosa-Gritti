import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/partido-form.scss'

type Equipo = { id: number; nombre: string; liga?: string; categoria?: string }

export default function PartidoForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [tipo, setTipo] = useState('')
  const [nroFecha, setNroFecha] = useState('')
  const [rival, setRival] = useState('')
  const [fecha, setFecha] = useState('')
  const [horario, setHorario] = useState('')
  const [lugar, setLugar] = useState('')
  const [equipoId, setEquipoId] = useState<number | ''>('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(() => {
    fetch('/api/equipos')
      .then(r => r.json())
      .then(j => setEquipos(j.data || []))
      .catch(err => setMsg(err.message || String(err)))

    if(editingId){
      fetch('/api/partido/' + editingId).then(r => r.json()).then(d => {
        const data = d.data || {}
        setTipo(data.tipo || '')
        setNroFecha(String(data.nroFecha || ''))
        setRival(data.rival || '')
        setFecha(data.fecha || '')
        setHorario(data.horario || '')
        setLugar(data.lugar || '')
        setEquipoId(data.equipo?.id ?? data.equipo ?? '')
      }).catch(err => setMsg(String(err)))
    }
  }, [editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setMsg('')
    setOut(null)

    const payload = {
      tipo: String(tipo || '').trim(),
      nroFecha: String(nroFecha || '').trim(),
      rival: String(rival || '').trim(),
      fecha: String(fecha || '').trim(),
      horario: String(horario || '').trim(),
      lugar: String(lugar || '').trim(),
      equipo: Number(equipoId || 0),
    }

    try{
      const url = editingId ? '/api/partido/' + editingId : '/api/partido'
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
        setTipo('')
        setNroFecha('')
        setRival('')
        setFecha('')
        setHorario('')
        setLugar('')
        setEquipoId('')
      }
    }catch(err:any){
      setMsg(err.message || String(err))
    }
  }

  async function doDelete(){
    if(!editingId) return
    if(!confirm('Eliminar partido #' + editingId + '?')) return
    const res = await fetch('/api/partido/' + editingId, { method: 'DELETE' })
    if(!res.ok){
      const d = await res.json().catch(()=>({}))
      setMsg(d.message || 'Error')
      return
    }
    navigate('/partidos')
  }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Partido #${editingId}` : 'Nuevo Partido'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Tipo</span>
            <input className="input" name="tipo" required value={tipo} onChange={e=>setTipo(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Nro. de Fecha</span>
            <input className="input" name="nroFecha" required value={nroFecha} onChange={e=>setNroFecha(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Rival</span>
            <input className="input" name="rival" value={rival} onChange={e=>setRival(e.target.value)} /> {/* Le saque el required para  se pueda crear un partido sin rival. Ej una final q todavia no se sabe el rival */}
          </label>
          <label className="form__label">
            <span className="label__title">Lugar</span>
            <input className="input" name="lugar" required value={lugar} onChange={e=>setLugar(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Fecha</span>
            <input className="input" type="date" name="fecha" required value={fecha} onChange={e=>setFecha(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Horario</span>
            <input className="input" type="time" name="horario" required value={horario} onChange={e=>setHorario(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Equipo</span>
            <select className="input" name="equipo" required value={String(equipoId)} onChange={e=>setEquipoId(Number(e.target.value)||'')}>
              <option value="" disabled>Seleccione un equipo...</option>
              {equipos.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.nombre}{eq.liga ? ` - ${eq.liga}` : ''}{eq.categoria ? ` (${eq.categoria})` : ''}</option>
              ))}
            </select>
          </label>
          <div></div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/partidos" className="btn btn--primary">Listado</Link>
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
