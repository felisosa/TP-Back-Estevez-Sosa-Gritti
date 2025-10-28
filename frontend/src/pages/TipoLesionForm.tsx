import React, { useState } from 'react'
import '../styles/tipo-lesion-form.scss'

export default function TipoLesionForm(){
  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setMsg('')
    setOut(null)

    const fd = new FormData(e.target as HTMLFormElement)
    const payload = {
      cdTipoLesion: String(fd.get('cdTipoLesion')||'').trim(),
      descTipoLesion: String(fd.get('descTipoLesion')||'').trim(),
      diasRecuperacion: String(fd.get('diasRecuperacion')||'').trim(),
      tratamiento: String(fd.get('tratamiento')||'').trim(),
    }

    try{
      const res = await fetch('/api/tipoLesiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Error en el servidor')
      setOut(data)
    }catch(err:any){
      setMsg(err.message || String(err))
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Nuevo Tipo de Lesión</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Código de Tipo</span>
            <input className="input" name="cdTipoLesion" required />
          </label>
          <label className="form__label">
            <span className="label__title">Descripción</span>
            <input className="input" name="descTipoLesion" required />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Días de recuperación</span>
            <input className="input" name="diasRecuperacion" required />
          </label>
          <label className="form__label">
            <span className="label__title">Tratamiento</span>
            <input className="input" name="tratamiento" required />
          </label>
        </div>

        <button className="btn btn--primary" type="submit">Crear</button>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && <pre className="form__output">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
