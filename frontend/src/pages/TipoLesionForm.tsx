import React, { useState } from 'react'

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
    <div style={{maxWidth: 800, margin: '1rem auto'}}>
      <h2>Nuevo Tipo de Lesión</h2>
      <form onSubmit={onSubmit} style={{display:'grid', gap:'1rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
          <label>
            Código de Tipo
            <input name="cdTipoLesion" required />
          </label>
          <label>
            Descripción
            <input name="descTipoLesion" required />
          </label>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
          <label>
            Días de recuperación
            <input name="diasRecuperacion" required />
          </label>
          <label>
            Tratamiento
            <input name="tratamiento" required />
          </label>
        </div>

        <button type="submit">Crear</button>
      </form>

      {msg && <p style={{color:'#b00020'}}>{msg}</p>}
      {out && <pre style={{background:'#f7f7f7', padding:'.75rem', borderRadius:8}}>{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
