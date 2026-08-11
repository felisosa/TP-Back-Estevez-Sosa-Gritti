import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth-form.scss'

type Rol = 'jugador' | 'dt'

export default function UsuarioRegisterForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState<Rol>('jugador')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [edad, setEdad] = useState('')
  const [numero, setNumero] = useState('')
  const [posicion, setPosicion] = useState('')

  const [msg, setMsg] = useState('')
  const [out, setOut] = useState<any>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setOut(null)

    const payloadBase = {
      email: String(email).trim(),
      password: String(password).trim(),
      rol,
      nombre: String(nombre).trim(),
      apellido: String(apellido).trim(),
      dni: String(dni).trim(),
      edad: Number(edad),
    }

    const payload = rol === 'jugador'
      ? { ...payloadBase, numero: Number(numero), posicion: String(posicion).trim() }
      : payloadBase

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error en el servidor')

      // La cookie httpOnly fue seteada automáticamente por el servidor
      navigate('/', { replace: true })
    } catch (err: any) {
      setMsg(err.message || String(err))
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Registro de Usuario</h2>

      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Email</span>
            <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Password</span>
            <input className="input" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Rol</span>
            <select className="input" value={rol} onChange={e => setRol(e.target.value as Rol)}>
              <option value="jugador">jugador</option>
              <option value="dt">dt</option>
            </select>
          </label>
          <div />
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Nombre</span>
            <input className="input" required value={nombre} onChange={e => setNombre(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Apellido</span>
            <input className="input" required value={apellido} onChange={e => setApellido(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">DNI</span>
            <input className="input" required value={dni} onChange={e => setDni(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Edad</span>
            <input className="input" type="number" min={1} required value={edad} onChange={e => setEdad(e.target.value)} />
          </label>
        </div>

        {rol === 'jugador' && (
          <div className="grid grid-2">
            <label className="form__label">
              <span className="label__title">Numero</span>
              <input className="input" type="number" min={1} required value={numero} onChange={e => setNumero(e.target.value)} />
            </label>
            <label className="form__label">
              <span className="label__title">Posicion</span>
              <input className="input" required value={posicion} onChange={e => setPosicion(e.target.value)} />
            </label>
          </div>
        )}

        <div className="form__actions">
          <button className="btn btn--primary" type="submit">Registrar</button>
          <Link to="/auth/login" className="btn btn--primary">Ir a Login</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}

      {out && (
        <div className="form__success" role="status" aria-live="polite">
          <div className="success__title">{out.message || 'Usuario registrado correctamente'}</div>
          {out.data && (
            <dl>
              {Object.entries(out.data).map(([k, v]) => (
                <div key={k} className="success__row">
                  <dt>{k}</dt>
                  <dd>{typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </div>
  )
}
