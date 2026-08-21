import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/jugador-form.scss'

export default function JugadorForm(){
  const params = useParams()
  const navigate = useNavigate()
  const editingId = params.id ? Number(params.id) : null

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [edad, setEdad] = useState('')
  const [numero, setNumero] = useState('')
  const [posicion, setPosicion] = useState('')

  const [fotoActual, setFotoActual] = useState<string>('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string>('')

  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(()=>{
    if(editingId){
      fetch('/api/jugadores/' + editingId).then(r=>r.json()).then(d=>{
        const data = d.data || {}
        setNombre(data.nombre || '')
        setApellido(data.apellido || '')
        setDni(data.dni || '')
        setEdad(String(data.edad || ''))
        setNumero(String(data.numero || ''))
        setPosicion(data.posicion || '')
        setFotoActual(data.foto || '')
      }).catch(e=>setMsg(String(e)))
    }
  },[editingId])

  function onFotoChange(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0] || null
    setFotoFile(file)
    setFotoPreview(file ? URL.createObjectURL(file) : '')
  }

  async function subirFoto(jugadorId: number){
    if(!fotoFile) return
    const formData = new FormData()
    formData.append('foto', fotoFile)
    const res = await fetch(`/api/jugadores/${jugadorId}/foto`, { method: 'POST', body: formData })
    const data = await res.json()
    if(!res.ok) throw new Error(data.message || 'No se pudo subir la foto')
    setFotoActual(data.data?.foto || '')
    setFotoFile(null)
    setFotoPreview('')
  }

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setMsg(''); setOut(null)
    const payload = { nombre: String(nombre).trim(), apellido: String(apellido).trim(), dni: String(dni).trim(), edad: String(edad).trim(), numero: String(numero).trim(), posicion: String(posicion).trim() }
    try{
      const url = editingId ? '/api/jugadores/' + editingId : '/api/jugadores'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')

      const savedId = editingId ?? data.data?.id
      if(savedId && fotoFile){
        await subirFoto(savedId)
      }

      setOut(data)
      if(!editingId){ setNombre(''); setApellido(''); setDni(''); setEdad(''); setNumero(''); setPosicion(''); setFotoFile(null); setFotoPreview('') }
    }catch(err:any){ setMsg(err.message || String(err)) }
  }

  async function doDelete(){ if(!editingId) return; if(!confirm('Eliminar jugador #' + editingId + '?')) return; const res = await fetch('/api/jugadores/' + editingId, { method: 'DELETE' }); if(!res.ok){ const d = await res.json().catch(()=>({})); setMsg(d.message||'Error'); return } ; navigate('/jugadores') }

  return (
    <div className="container">
      <h2 className="page-title">{editingId ? `Editar Jugador #${editingId}` : 'Nuevo Jugador'}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Nombre</span>
            <input className="input" name="nombre" required value={nombre} onChange={e=>setNombre(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Apellido</span>
            <input className="input" name="apellido" required value={apellido} onChange={e=>setApellido(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">DNI</span>
            <input className="input" name="dni" required value={dni} onChange={e=>setDni(e.target.value)} />
          </label>
          <div></div>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Edad</span>
            <input className="input" name="edad" required value={edad} onChange={e=>setEdad(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Número</span>
            <input className="input" name="numero" required value={numero} onChange={e=>setNumero(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Posición</span>
            <input className="input" name="posicion" required value={posicion} onChange={e=>setPosicion(e.target.value)} />
          </label>
          <div></div>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Foto</span>
            <input className="input" type="file" accept="image/*" onChange={onFotoChange} />
          </label>
          <div className="foto-preview">
            {(fotoPreview || fotoActual) ? (
              <img src={fotoPreview || fotoActual} alt="Foto del jugador" />
            ) : (
              <span className="foto-preview__placeholder">Sin foto</span>
            )}
          </div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn--primary" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
          {editingId && <button type="button" className="btn" onClick={doDelete}>Eliminar</button>}
          {editingId && <Link to={`/jugadores/ficha/${editingId}`} className="btn btn--primary">Ver ficha</Link>}
          <Link to="/jugadores" className="btn btn--primary">Listado</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && (
        <div className="form__success" role="status" aria-live="polite">
          <div className="success__title">{out.message || (editingId ? 'Actualizado' : 'Creado')}</div>
          <div className="success__body">
            {out.data ? (
              <dl>
                {Object.entries(out.data).map(([k, v]) => (
                  <div key={k} className="success__row"><dt>{k}</dt><dd>{typeof v === 'object' && v !== null ? (((v as any).nombre) ? `${(v as any).nombre} ${(v as any).apellido || ''} (id:${(v as any).id})` : JSON.stringify(v)) : String(v)}</dd></div>
                ))}
              </dl>
            ) : <div>{JSON.stringify(out)}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
