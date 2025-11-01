import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/estadistica-jugador-form.scss'
import RowActions from '../components/RowActions'

export default function EstadisticaJugadorList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')
  const [filterName, setFilterName] = useState<string>('')
  useEffect(()=>{ load() }, [])
  function load(jugadorNombre?: string){
    const url = '/api/estadisticasJugador' + (jugadorNombre ? `?jugadorNombre=${encodeURIComponent(jugadorNombre)}` : '')
    fetch(url).then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e)))
  }
  function onSearch(){ load(filterName) }
  function onClear(){ setFilterName(''); load() }
  async function doDelete(id:number){ if(!confirm('Eliminar estadística #' + id + '?')) return; const res = await fetch('/api/estadisticasJugador/' + id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }

  return (
    <div className="container">
      <h2 className="page-title">Estadísticas de Jugadores</h2>
      <div className="filter-row">
        <input placeholder="Buscar por nombre de jugador" value={filterName} onChange={e=>setFilterName(e.target.value)} />
        <button className="btn btn--primary" onClick={onSearch}>Buscar</button>
        <button className="btn" onClick={onClear}>Limpiar</button>
        <div style={{flex: '0 0 auto', marginLeft: 'auto'}}>
          <Link to="/estadisticas-jugador/nuevo" className="btn btn--primary">Nueva Estadística</Link>
        </div>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <div className="table-wrapper">
      <table className="table">
        <thead><tr><th>ID</th><th>Temporada</th><th>Goles</th><th>Asistencias</th><th>Jugador</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(it=> (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.temporada}</td>
              <td>{it.goles}</td>
              <td>{it.asistencias ?? ''}</td>
              <td>{it.jugador ? `${it.jugador.nombre} ${it.jugador.apellido || ''} (id:${it.jugador.id})` : (it.jugador?.id || it.jugador)}</td>
              <td>
                <RowActions editUrl={`/estadisticas-jugador/editar/${it.id}`} onDelete={async ()=>{ if(!confirm('Eliminar estadística #' + it.id + '?')) return; const res = await fetch('/api/estadisticasJugador/' + it.id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
