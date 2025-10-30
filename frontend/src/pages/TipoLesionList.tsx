import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/tipo-lesion-form.scss'

export default function TipoLesionList(){
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState<string>('')
  useEffect(() => { load() }, [])
  function load(){ fetch('/api/tipoLesiones').then(r=>r.json()).then(j=>setItems(j.data||[])).catch(e=>setMsg(String(e))) }

  async function doDelete(id:number){
    if(!confirm('Eliminar tipo #' + id + '?')) return
    const res = await fetch('/api/tipoLesiones/' + id, { method: 'DELETE' })
    if(!res.ok){
      // try to read a structured error, fall back to text
      const txt = await res.text().catch(()=>'')
      let parsedMessage = ''
      try{ parsedMessage = JSON.parse(txt).message || txt }catch{ parsedMessage = txt }
      // detect foreign-key constraint messages and show a friendly Spanish message
      if(/foreign key|cannot delete|constraint fails|violat/i.test(parsedMessage)){
        setMsg('No se puede eliminar este tipo de lesion porque tiene lesiones asociadas')
      } else {
        setMsg(parsedMessage || 'Error al eliminar')
      }
      return
    }
    load()
  }

  return (
    <div className="container">
      <h2 className="page-title">Tipos de Lesión</h2>
      <div style={{marginBottom:12}}>
        <Link to="/tipos-lesion/nuevo" className="btn btn--primary">Nuevo Tipo</Link>
      </div>
      {msg && <p className="form__error">{msg}</p>}
      <div className="table-wrapper">
      <table className="table">
        <thead><tr><th>ID</th><th>Código</th><th>Descripción</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(it=> (
            <tr key={it.id}><td>{it.id}</td><td>{it.cdTipoLesion}</td><td>{it.descTipoLesion}</td>
              <td>
                <Link to={`/tipos-lesion/editar/${it.id}`} className="nav__link">Edit</Link>
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
