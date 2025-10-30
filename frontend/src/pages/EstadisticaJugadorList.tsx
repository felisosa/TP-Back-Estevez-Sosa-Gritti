import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/estadistica-jugador-form.scss'

export default function EstadisticaJugadorList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')
  useEffect(()=>{ load() }, [])
  function load(){ fetch('/api/estadisticasJugador').then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e))) }
  async function doDelete(id:number){ if(!confirm('Eliminar estadística #' + id + '?')) return; const res = await fetch('/api/estadisticasJugador/' + id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }

  return (
    <div className="container">
      <h2 className="page-title">Estadísticas de Jugadores</h2>
      <div style={{marginBottom:12}}>
        <Link to="/estadisticas-jugador/nuevo" className="btn btn--primary">Nueva Estadística</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <table className="table">
        <thead><tr><th>ID</th><th>Temporada</th><th>Goles</th><th>Jugador</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(it=> (
            <tr key={it.id}><td>{it.id}</td><td>{it.temporada}</td><td>{it.goles}</td><td>{it.jugador?.id || it.jugador}</td>
              <td>
                <Link to={`/estadisticas-jugador/editar/${it.id}`} className="nav__link">Edit</Link>
                <button className="btn" onClick={()=>doDelete(it.id)} style={{marginLeft:8}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
