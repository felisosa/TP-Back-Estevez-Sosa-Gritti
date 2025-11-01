import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/equipo-form.scss'
import RowActions from '../components/RowActions'

export default function EquipoList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')
  const [filterCat, setFilterCat] = useState<string>('')
  useEffect(()=>{ load() }, [])
  function load(categoria?: string){
    const url = '/api/equipos' + (categoria ? `?categoria=${encodeURIComponent(categoria)}` : '')
    fetch(url).then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e)))
  }
  function onSearch(){ load(filterCat) }
  function onClear(){ setFilterCat(''); load() }
  async function doDelete(id:number){ if(!confirm('Eliminar equipo #' + id + '?')) return; const res = await fetch('/api/equipos/' + id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }

  return (
    <div className="container">
      <h2 className="page-title">Equipos</h2>
      <div className="filter-row">
        <input placeholder="Filtrar por categoría (ej: Primera)" value={filterCat} onChange={e=>setFilterCat(e.target.value)} />
        <button className="btn btn--primary" onClick={onSearch}>Buscar</button>
        <button className="btn" onClick={onClear}>Limpiar</button>
      </div>
      <div style={{marginBottom:12}}>
        <Link to="/equipos/nuevo" className="btn btn--primary">Nuevo Equipo</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <div className="table-wrapper">
      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Liga</th><th>Categoría</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(it=> (
            <tr key={it.id}><td>{it.id}</td><td>{it.nombre}</td><td>{it.liga}</td><td>{it.categoria}</td>
              <td>
                <RowActions editUrl={`/equipos/editar/${it.id}`} onDelete={async ()=>{ if(!confirm('Eliminar equipo #' + it.id + '?')) return; const res = await fetch('/api/equipos/' + it.id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
