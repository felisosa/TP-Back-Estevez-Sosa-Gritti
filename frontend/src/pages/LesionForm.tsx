import React, { useEffect, useState } from 'react'
import '../styles/lesion-form.scss'

type Jugador = { id: number; nombre: string; apellido: string; dni: string }

type TipoLesion = { id: number; cdTipoLesion?: string; descTipoLesion?: string; diasRecuperacion?: string; tratamiento?: string }

export default function LesionForm(){
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [tipos, setTipos] = useState<TipoLesion[]>([])
  const [msg, setMsg] = useState<string>('')
  const [out, setOut] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/jugadores').then(r => r.json()),
      fetch('/api/tipoLesiones').then(r => r.json()),
    ]).then(([j,t]) => {
      setJugadores(j.data ?? [])
      setTipos(t.data ?? [])
    }).catch(err => setMsg(err.message || String(err)))
  }, [])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setMsg('')
    setOut(null)

    const fd = new FormData(e.target as HTMLFormElement)
    const payload = {
      cdLesion: String(fd.get('cdLesion')||'').trim(),
      descLesion: String(fd.get('descLesion')||'').trim(),
      jugador: Number(fd.get('jugador')||0),
      tipoLesion: Number(fd.get('tipoLesion')||0),
    }

    try{
      const res = await fetch('/api/lesiones', {
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
      <h2 className="page-title">Nueva Lesión</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Código de Lesión</span>
            <input className="input" name="cdLesion" required />
          </label>
          <label className="form__label">
            <span className="label__title">Descripción</span>
            <input className="input" name="descLesion" required />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Jugador</span>
            <select className="input" name="jugador" required defaultValue="">
              <option value="" disabled>Seleccione un jugador…</option>
              {jugadores.map(j => (
                <option key={j.id} value={j.id}>{j.nombre} {j.apellido} ({j.dni})</option>
              ))}
            </select>
          </label>
          <label className="form__label">
            <span className="label__title">Tipo de lesión</span>
            <select className="input" name="tipoLesion" required defaultValue="">
              <option value="" disabled>Seleccione un tipo…</option>
              {tipos.map(t => (
                <option key={t.id} value={t.id}>{t.cdTipoLesion || `Tipo ${t.id}`}</option>
              ))}
            </select>
          </label>
        </div>

        <button className="btn btn--primary" type="submit">Crear</button>
      </form>

      {msg && <p className="form__error">{msg}</p>}
      {out && <pre className="form__output">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
