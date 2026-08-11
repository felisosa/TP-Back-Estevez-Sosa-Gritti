import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth-form.scss'

export default function UsuarioLoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [msg, setMsg] = useState('')
  const [out, setOut] = useState<any>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setOut(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(email).trim(),
          password: String(password).trim(),
        }),
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
      <h2 className="page-title">Login de Usuario</h2>

      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <label className="form__label">
            <span className="label__title">Email</span>
            <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="form__label">
            <span className="label__title">Password</span>
            <input className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </label>
        </div>

        <div className="form__actions">
          <button className="btn btn--primary" type="submit">Ingresar</button>
          <Link to="/auth/register" className="btn btn--primary">Ir a Registro</Link>
        </div>
      </form>

      {msg && <p className="form__error">{msg}</p>}

      {out && (
        <div className="form__success" role="status" aria-live="polite">
          <div className="success__title">{out.message || 'Login exitoso'}</div>
          <dl>
            <div className="success__row"><dt>rol</dt><dd>{String(out.rol || '')}</dd></div>
            <div className="success__row"><dt>token</dt><dd className="token-preview">{String(out.token || '')}</dd></div>
          </dl>
        </div>
      )}
    </div>
  )
}
