import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link, Navigate, useLocation } from 'react-router-dom'
import LesionForm from './pages/LesionForm'
import LesionList from './pages/LesionList'
import TipoLesionForm from './pages/TipoLesionForm'
import TipoLesionList from './pages/TipoLesionList'
import JugadorForm from './pages/JugadorForm'
import JugadorList from './pages/JugadorList'
import JugadorFicha from './pages/JugadorFicha'
import EquipoForm from './pages/EquipoForm'
import EquipoList from './pages/EquipoList'
import EstadisticaJugadorForm from './pages/EstadisticaJugadorForm'
import EstadisticaJugadorList from './pages/EstadisticaJugadorList'
import PartidoForm from './pages/PartidoForm'
import PartidoList from './pages/PartidoList'
import DtForm from './pages/DtForm'
import DtList from './pages/DtList'
import ContratoForm from './pages/ContratoForm'
import ContratoList from './pages/ContratoList'
import UsuarioRegisterForm from './pages/UsuarioRegisterForm'
import UsuarioLoginForm from './pages/UsuarioLoginForm'
import { checkAuthSession, clearAuthToken } from './auth.js'
import './styles/global.scss'

function Layout({ authenticated }: { authenticated: boolean }){
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(()=>{
    setOpen(false)
  }, [location.pathname])

  async function handleLogout() {
    await clearAuthToken()
    window.location.href = '/auth/login'
  }

  const NavLinks = authenticated
    ? (
      <>
        <Link to="/lesiones/nueva" className="nav__link" onClick={()=>setOpen(false)}>Nueva Lesión</Link>
        <Link to="/tipos-lesion/nuevo" className="nav__link" onClick={()=>setOpen(false)}>Nuevo Tipo de Lesión</Link>
        <Link to="/jugadores/nuevo" className="nav__link" onClick={()=>setOpen(false)}>Nuevo Jugador</Link>
        <Link to="/equipos/nuevo" className="nav__link" onClick={()=>setOpen(false)}>Nuevo Equipo</Link>
        <Link to="/estadisticas-jugador/nuevo" className="nav__link" onClick={()=>setOpen(false)}>Nueva Estadística</Link>
        <Link to="/partidos/nuevo" className="nav__link" onClick={()=>setOpen(false)}>Nuevo Partido</Link>
        <Link to="/dts/nuevo" className="nav__link" onClick={()=>setOpen(false)}>Nuevo DT</Link>
        <Link to="/contratos/nuevo" className="nav__link" onClick={()=>setOpen(false)}>Nuevo Contrato</Link>
        <button
          className="nav__link"
          onClick={() => {
            handleLogout()
            setOpen(false)
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0.75rem' }}
        >
          Cerrar sesión
        </button>
      </>
    )
    : (
      <>
        <Link to="/auth/register" className="nav__link" onClick={()=>setOpen(false)}>Registro</Link>
        <Link to="/auth/login" className="nav__link" onClick={()=>setOpen(false)}>Login</Link>
      </>
    )

  return (
    <header className="app-header">
      <div className="app-header__inner">
        {/* hamburger - visible on small screens */}
        <button className="hamburger" aria-label="Abrir menú" aria-expanded={open} onClick={()=>setOpen(s=>!s)}>☰</button>

        <Link to="/" className="brand" aria-label="Ir al inicio">
          <img src="/img/teamtrack-logo-sm.png" alt="TeamTrack" className="brand__logo" />
          <span className="brand__text">TeamTrack</span>
        </Link>

        <nav className="nav">
          {NavLinks}
        </nav>

        {/* mobile dropdown that appears when hamburger is toggled */}
        <div className={`mobile-nav ${open ? 'open' : ''}`} role="dialog" aria-modal="false">
          {NavLinks}
        </div>
      </div>
    </header>
  )
}

function Home() {
  return (
    <main className="app-main">
      <div className="hero">
        <img src="/img/teamtrack-logo.png" alt="TeamTrack" className="hero__logo" />
      </div>
    </main>
  )
}

/*login y registro */
function ProtectedShell({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    checkAuthSession().then((isAuthenticated) => {
      if (mounted) setAuthenticated(isAuthenticated)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (authenticated === null) {
    return null
  }

  if (!authenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <>
      <Layout authenticated={true} />
      {children}
    </>
  )
}

function PublicShell({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    checkAuthSession().then((isAuthenticated) => {
      if (mounted) setAuthenticated(isAuthenticated)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (authenticated === null) {
    return null
  }

  if (authenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <Layout authenticated={false} />
      {children}
    </>
  )
}

/* ------------------------------------------------------------------------- */

const router = createBrowserRouter([
  { path: '/', element: <ProtectedShell><Home/></ProtectedShell> },
  { path: '/lesiones', element: <ProtectedShell><LesionList/></ProtectedShell> },
  { path: '/lesiones/nueva', element: <ProtectedShell><LesionForm/></ProtectedShell> },
  { path: '/lesiones/editar/:id', element: <ProtectedShell><LesionForm/></ProtectedShell> },

  { path: '/tipos-lesion', element: <ProtectedShell><TipoLesionList/></ProtectedShell> },
  { path: '/tipos-lesion/nuevo', element: <ProtectedShell><TipoLesionForm/></ProtectedShell> },
  { path: '/tipos-lesion/editar/:id', element: <ProtectedShell><TipoLesionForm/></ProtectedShell> },

  { path: '/jugadores', element: <ProtectedShell><JugadorList/></ProtectedShell> },
  { path: '/jugadores/nuevo', element: <ProtectedShell><JugadorForm/></ProtectedShell> },
  { path: '/jugadores/editar/:id', element: <ProtectedShell><JugadorForm/></ProtectedShell> },
  { path: '/jugadores/ficha/:id', element: <ProtectedShell><JugadorFicha/></ProtectedShell> },

  { path: '/equipos', element: <ProtectedShell><EquipoList/></ProtectedShell> },
  { path: '/equipos/nuevo', element: <ProtectedShell><EquipoForm/></ProtectedShell> },
  { path: '/equipos/editar/:id', element: <ProtectedShell><EquipoForm/></ProtectedShell> },

  { path: '/estadisticas-jugador', element: <ProtectedShell><EstadisticaJugadorList/></ProtectedShell> },
  { path: '/estadisticas-jugador/nuevo', element: <ProtectedShell><EstadisticaJugadorForm/></ProtectedShell> },
  { path: '/estadisticas-jugador/editar/:id', element: <ProtectedShell><EstadisticaJugadorForm/></ProtectedShell> },

  { path: '/partidos', element: <ProtectedShell><PartidoList/></ProtectedShell> },
  { path: '/partidos/nuevo', element: <ProtectedShell><PartidoForm/></ProtectedShell> },
  { path: '/partidos/editar/:id', element: <ProtectedShell><PartidoForm/></ProtectedShell> },

  { path: '/dts', element: <ProtectedShell><DtList/></ProtectedShell> },
  { path: '/dts/nuevo', element: <ProtectedShell><DtForm/></ProtectedShell> },
  { path: '/dts/editar/:id', element: <ProtectedShell><DtForm/></ProtectedShell> },

  { path: '/contratos', element: <ProtectedShell><ContratoList/></ProtectedShell> },
  { path: '/contratos/nuevo', element: <ProtectedShell><ContratoForm/></ProtectedShell> },
  { path: '/contratos/editar/:id', element: <ProtectedShell><ContratoForm/></ProtectedShell> },

  { path: '/auth/register', element: <PublicShell><UsuarioRegisterForm/></PublicShell> },
  { path: '/auth/login', element: <PublicShell><UsuarioLoginForm/></PublicShell> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
