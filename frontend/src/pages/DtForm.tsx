import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/dt-form.scss'

export default function DtForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [edad, setEdad] = useState('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(()=>{
    if(editingId){
      fetch('/api/dts/' + editingId).then(r=>r.json()).then(d=>{
        const data = d.data || {}
        setNombre(data.nombre || '')
        setApellido(data.apellido || '')
        setDni(data.dni || '')
        setEdad(String(data.edad || ''))
      }).catch(e=>setMsg(String(e)))
    }
  },[editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setOut(null)
    const payload = { nombre: String(nombre).trim(), apellido: String(apellido).trim(), dni: String(dni).trim(), edad: String(edad).trim() }
    try{
      const url = editingId ? '/api/dts/' + editingId : '/api/dts'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
      if(!editingId){ setNombre(''); setApellido(''); setDni(''); setEdad('') }
    }catch(err:any){ setMsg(err.message || String(err)) }
  }

  async function doDelete(){ if(!editingId) return; if(!confirm('Eliminar director tecnico #' + editingId + '?')) return; const res = await fetch('/api/dts/' + editingId, { method: 'DELETE' }); if(!res.ok){ const d = await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; navigate('/dts') }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Director Tecnico #${editingId}` : 'Nuevo Director Tecnico'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Nombre</span>
            <input className="input" name="nombre" required value={nombre} onChange={e=>setNombre(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Apellido</span>
            <input className="input" name="apellido" required value={apellido} onChange={e=>setApellido(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">DNI</span>
            <input className="input" name="dni" required value={dni} onChange={e=>setDni(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Edad</span>
            <input className="input" name="edad" required value={edad} onChange={e=>setEdad(e.target.value)} />
          </label>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/dts" className="btn btn--primary">Listado</Link>
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
                  <div key={k} className="success__row"><dt>{k}</dt><dd>{typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}</dd></div>
                ))}
              </dl>
            ) : <div>{JSON.stringify(out)}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
