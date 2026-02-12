import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/partido-form.scss'
import RowActions from '../components/RowActions'

export default function PartidoList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')
  const [filterTipo, setFilterTipo] = useState<string>('')

  useEffect(() => { load() }, [filterTipo])
  function load(filterTipo?: string){
    const url = '/api/partido' + (filterTipo ? '?tipo=' + encodeURIComponent(filterTipo) : '')
    fetch(url).then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e)))
  }

  function onSearch(){ load(filterTipo) }
  function onClear(){ setFilterTipo(''); load() }


  async function doDelete(id:number){
    if(!confirm('Eliminar partido #' + id + '?')) return
    const res = await fetch('/api/partido/' + id, { method: 'DELETE' })
    if(!res.ok){
      const d = await res.json().catch(()=>({}))
      setMsg(d.message || 'Error al eliminar')
      return
    }
    load()
  }

  return (
    <div className="container">
      <h2 className="page-title">Partidos</h2>
      <div className="filter-row">
        <input placeholder="Filtrar por tipo (ej: Amistoso)" value={filterTipo} onChange={e=>setFilterTipo(e.target.value)} />
        <button className="btn btn--primary" onClick={onSearch}>Buscar</button>
        <button className="btn" onClick={onClear}>Limpiar</button>
      </div>
      <div style={{marginBottom:12}}>
        <Link to="/partidos/nuevo" className="btn btn--primary">Nuevo Partido</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Fecha</th><th>Horario</th><th>Rival</th><th>Tipo</th><th>Fecha #</th><th>Equipo</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.fecha}</td>
              <td>{it.horario}</td>
              <td>{it.rival}</td>
              <td>{it.tipo}</td>
              <td>{it.nroFecha}</td>
              <td>{it.equipo ? (it.equipo.nombre ? `${it.equipo.nombre} (id:${it.equipo.id})` : `id:${it.equipo.id ?? it.equipo}`) : ''}</td>
              <td>
                <RowActions editUrl={`/partidos/editar/${it.id}`} onDelete={async ()=>{ if(!confirm('Eliminar partido #' + it.id + '?')) return; const res = await fetch('/api/partido/' + it.id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error al eliminar'); return } ; load() }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
