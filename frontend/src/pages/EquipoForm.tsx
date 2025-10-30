import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/equipo-form.scss'

export default function EquipoForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [nombre, setNombre] = useState('')
  const [liga, setLiga] = useState('')
  const [pais, setPais] = useState('')
  const [categoria, setCategoria] = useState('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(()=>{
    if(editingId){
      fetch('/api/equipos/' + editingId).then(r=>r.json()).then(d=>{
        const data = d.data || {}
        setNombre(data.nombre || '')
        setLiga(data.liga || '')
        setPais(data.pais || '')
        setCategoria(data.categoria || '')
      }).catch(e=>setMsg(String(e)))
    }
  },[editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setOut(null)
    const payload = { nombre: String(nombre).trim(), liga: String(liga).trim(), pais: String(pais).trim(), categoria: String(categoria).trim() }
    try{
      const url = editingId ? '/api/equipos/' + editingId : '/api/equipos'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
      if(!editingId){ setNombre(''); setLiga(''); setPais(''); setCategoria('') }
    }catch(err:any){ setMsg(err.message || String(err)) }
  }

  async function doDelete(){ if(!editingId) return; if(!confirm('Eliminar equipo #' + editingId + '?')) return; const res = await fetch('/api/equipos/' + editingId, { method: 'DELETE' }); if(!res.ok){ const d = await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; navigate('/equipos') }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Equipo #${editingId}` : 'Nuevo Equipo'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Nombre</span>
            <input className="input" name="nombre" required value={nombre} onChange={e=>setNombre(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Liga</span>
            <input className="input" name="liga" required value={liga} onChange={e=>setLiga(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">País</span>
            <input className="input" name="pais" required value={pais} onChange={e=>setPais(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Categoría</span>
            <input className="input" name="categoria" required value={categoria} onChange={e=>setCategoria(e.target.value)} />
          </label>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/equipos" className="btn">Volver al listado</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && <pre className="form__output">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
