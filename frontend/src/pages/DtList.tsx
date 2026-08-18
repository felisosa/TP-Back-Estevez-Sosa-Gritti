import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/dt-form.scss'
import RowActions from '../components/RowActions'

export default function DtList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')

  useEffect(()=>{ load() }, [])
  function load(){
    fetch('/api/dts').then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e)))
  }

  async function doDelete(id:number){ if(!confirm('Eliminar director tecnico #' + id + '?')) return; const res = await fetch('/api/dts/' + id, { method: 'DELETE' }); if(!res.ok){ const d=await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; load() }

  return (
    <div className="container">
      <h2 className="page-title">Directores Tecnicos</h2>
      <div style={{marginBottom:12}}>
        <Link to="/dts/nuevo" className="btn btn--primary">Nuevo Director Tecnico</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <div className="table-wrapper">
      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>DNI</th><th>Edad</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(it=> (
            <tr key={it.id}><td>{it.id}</td><td>{it.nombre} {it.apellido}</td><td>{it.dni}</td><td>{it.edad}</td>
              <td>
                <RowActions editUrl={`/dts/editar/${it.id}`} onDelete={()=>doDelete(it.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
