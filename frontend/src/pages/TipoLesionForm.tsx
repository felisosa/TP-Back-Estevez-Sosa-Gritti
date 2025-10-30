import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/tipo-lesion-form.scss'

export default function TipoLesionForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [cdTipoLesion, setCdTipoLesion] = useState('')
  const [descTipoLesion, setDescTipoLesion] = useState('')
  const [diasRecuperacion, setDiasRecuperacion] = useState('')
  const [tratamiento, setTratamiento] = useState('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(()=>{
    if(editingId){
      fetch('/api/tipoLesiones/' + editingId).then(r=>r.json()).then(d=>{
        const data = d.data || {}
        setCdTipoLesion(data.cdTipoLesion || '')
        setDescTipoLesion(data.descTipoLesion || '')
        setDiasRecuperacion(data.diasRecuperacion || '')
        setTratamiento(data.tratamiento || '')
      }).catch(e=>setMsg(String(e)))
    }
  },[editingId])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setOut(null)
    const payload = { cdTipoLesion: String(cdTipoLesion).trim(), descTipoLesion: String(descTipoLesion).trim(), diasRecuperacion: String(diasRecuperacion).trim(), tratamiento: String(tratamiento).trim() }
    try{
      const url = editingId ? '/api/tipoLesiones/' + editingId : '/api/tipoLesiones'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
      if(!editingId){ setCdTipoLesion(''); setDescTipoLesion(''); setDiasRecuperacion(''); setTratamiento('') }
    }catch(err:any){ setMsg(err.message || String(err)) }
  }

  async function doDelete(){
    if(!editingId) return
    if(!confirm('Eliminar tipo #' + editingId + '?')) return
    const res = await fetch('/api/tipoLesiones/' + editingId, { method: 'DELETE' })
    if(!res.ok){
      const txt = await res.text().catch(()=>'')
      let parsedMessage = ''
      try{ parsedMessage = JSON.parse(txt).message || txt }catch{ parsedMessage = txt }
      if(/foreign key|cannot delete|constraint fails|violat/i.test(parsedMessage)){
        setMsg('No se puede eliminar este tipo de lesion porque tiene lesiones asociadas')
      } else {
        setMsg(parsedMessage || 'Error al eliminar')
      }
      return
    }
    navigate('/tipos-lesion')
  }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Tipo #${editingId}` : 'Nuevo Tipo de Lesión'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Código de Tipo</span>
            <input className="input" name="cdTipoLesion" required value={cdTipoLesion} onChange={e=>setCdTipoLesion(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Descripción</span>
            <input className="input" name="descTipoLesion" required value={descTipoLesion} onChange={e=>setDescTipoLesion(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Días de recuperación</span>
            <input className="input" name="diasRecuperacion" required value={diasRecuperacion} onChange={e=>setDiasRecuperacion(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Tratamiento</span>
            <input className="input" name="tratamiento" required value={tratamiento} onChange={e=>setTratamiento(e.target.value)} />
          </label>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          <Link to="/tipos-lesion" className="btn">Listado</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && <pre className="form__output">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
