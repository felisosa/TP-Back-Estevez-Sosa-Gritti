import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/jugador-form.scss'

export default function JugadorForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [edad, setEdad] = useState('')
  const [numero, setNumero] = useState('')
  const [posicion, setPosicion] = useState('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(()=>{
    if(editingId){
      fetch('/api/jugadores/' + editingId).then(r=>r.json()).then(d=>{
        const data = d.data || {}
        setNombre(data.nombre || '')
        setApellido(data.apellido || '')
        setDni(data.dni || '')
        setEdad(String(data.edad || ''))
        setNumero(String(data.numero || ''))
        setPosicion(data.posicion || '')
      }).catch(e=>setMsg(String(e)))
    }
  },[editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setOut(null)
    const payload = { nombre: String(nombre).trim(), apellido: String(apellido).trim(), dni: String(dni).trim(), edad: String(edad).trim(), numero: String(numero).trim(), posicion: String(posicion).trim() }
    try{
      const url = editingId ? '/api/jugadores/' + editingId : '/api/jugadores'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
      if(!editingId){ setNombre(''); setApellido(''); setDni(''); setEdad(''); setNumero(''); setPosicion('') }
    }catch(err:any){ setMsg(err.message || String(err)) }
  }

  async function doDelete(){ if(!editingId) return; if(!confirm('Eliminar jugador #' + editingId + '?')) return; const res = await fetch('/api/jugadores/' + editingId, { method: 'DELETE' }); if(!res.ok){ const d = await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; navigate('/jugadores') }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Jugador #${editingId}` : 'Nuevo Jugador'}</h2>
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
          <div></div>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Edad</span>
            <input className="input" name="edad" required value={edad} onChange={e=>setEdad(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Número</span>
            <input className="input" name="numero" required value={numero} onChange={e=>setNumero(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Posición</span>
            <input className="input" name="posicion" required value={posicion} onChange={e=>setPosicion(e.target.value)} />
          </label>
          <div></div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/jugadores" className="btn">Listado</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && <pre className="form__output">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
