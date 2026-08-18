import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/contrato-form.scss'
import RowActions from '../components/RowActions'

export default function ContratoList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')

  useEffect(() => { load() }, [])
  function load(){
    fetch('/api/contrato').then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e)))
  }

  async function doDelete(id:number){
    if(!confirm('Eliminar contrato #' + id + '?')) return
    const res = await fetch('/api/contrato/' + id, { method: 'DELETE' })
    if(!res.ok){
      const d = await res.json().catch(()=>({}))
      setMsg(d.message || 'Error al eliminar')
      return
    }
    load()
  }

  return (
    <div className="container">
      <h2 className="page-title">Contratos</h2>
      <div style={{marginBottom:12}}>
        <Link to="/contratos/nuevo" className="btn btn--primary">Nuevo Contrato</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Código</th><th>Jugador</th><th>DT</th><th>Equipo</th><th>Inicio</th><th>Fin</th><th>Fin real</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.cdContrato}</td>
              <td>{it.jugador ? `${it.jugador.nombre} ${it.jugador.apellido}` : ''}</td>
              <td>{it.dt ? `${it.dt.nombre} ${it.dt.apellido}` : ''}</td>
              <td>{it.equipo ? it.equipo.nombre : ''}</td>
              <td>{it.fechaIni}</td>
              <td>{it.fechaFin}</td>
              <td>{it.fechaRealFin || '—'}</td>
              <td>
                <RowActions editUrl={`/contratos/editar/${it.id}`} onDelete={()=>doDelete(it.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
