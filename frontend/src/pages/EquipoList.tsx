import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/equipo-form.scss'

export default function EquipoList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')
  useEffect(()=>{ load() }, [])
  function load(){ fetch('/api/equipos').then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e))) }
  async function doDelete(id:number){ if(!confirm('Eliminar equipo #' + id + '?')) return; const res = await fetch('/api/equipos/' + id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }

  return (
    <div className="container">
      <h2 className="page-title">Equipos</h2>
      <div style={{marginBottom:12}}>
        <Link to="/equipos/nuevo" className="btn btn--primary">Nuevo Equipo</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Liga</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(it=> (
            <tr key={it.id}><td>{it.id}</td><td>{it.nombre}</td><td>{it.liga}</td>
              <td>
                <Link to={`/equipos/editar/${it.id}`} className="nav__link">Edit</Link>
                <button className="btn" onClick={()=>doDelete(it.id)} style={{marginLeft:8}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
