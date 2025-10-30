import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/lesion-form.scss'

export default function LesionList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')

  useEffect(() => { load() }, [])
  function load(){
    fetch('/api/lesiones').then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e)))
  }

  async function doDelete(id:number){
    if(!confirm('Eliminar lesión #' + id + '?')) return
    const res = await fetch('/api/lesiones/' + id, { method: 'DELETE' })
    if(!res.ok) { const d = await res.json().catch(()=>({})); setMsg(d.message||'Error al eliminar'); return }
    load()
  }

  return (
    <div className="container">
      <h2 className="page-title">Lesiones</h2>
      <div style={{marginBottom:12}}>
        <Link to="/lesiones/nueva" className="btn btn--primary">Nueva Lesión</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Código</th><th>Descripción</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.cdLesion}</td>
              <td>{it.descLesion}</td>
              <td>
                <Link to={`/lesiones/editar/${it.id}`} className="nav__link">Edit</Link>
                <button className="btn" onClick={()=>doDelete(it.id)} style={{marginLeft:8}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
