import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/jugador-form.scss'

export default function JugadorList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')
  useEffect(()=>{ load() }, [])
  function load(){ fetch('/api/jugadores').then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e))) }
  async function doDelete(id:number){ if(!confirm('Eliminar jugador #' + id + '?')) return; const res = await fetch('/api/jugadores/' + id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }

  return (
    <div className="container">
      <h2 className="page-title">Jugadores</h2>
      <div style={{marginBottom:12}}>
        <Link to="/jugadores/nuevo" className="btn btn--primary">Nuevo Jugador</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>DNI</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(it=> (
            <tr key={it.id}><td>{it.id}</td><td>{it.nombre} {it.apellido}</td><td>{it.dni}</td>
              <td>
                <Link to={`/jugadores/editar/${it.id}`} className="nav__link">Edit</Link>
                <button className="btn" onClick={()=>doDelete(it.id)} style={{marginLeft:8}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
