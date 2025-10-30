import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import LesionForm from './pages/LesionForm'
import LesionList from './pages/LesionList'
import TipoLesionForm from './pages/TipoLesionForm'
import TipoLesionList from './pages/TipoLesionList'
import JugadorForm from './pages/JugadorForm'
import JugadorList from './pages/JugadorList'
import EquipoForm from './pages/EquipoForm'
import EquipoList from './pages/EquipoList'
import EstadisticaJugadorForm from './pages/EstadisticaJugadorForm'
import EstadisticaJugadorList from './pages/EstadisticaJugadorList'
import './styles/global.scss'

function Layout(){
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand" aria-label="Ir al inicio">
          <img src="/img/teamtrack-logo-sm.png" alt="TeamTrack" className="brand__logo" />
          <span className="brand__text">TeamTrack</span>
        </Link>
        <nav className="nav">
          <Link to="/lesiones/nueva" className="nav__link">Nueva Lesión</Link>
          <Link to="/tipos-lesion/nuevo" className="nav__link">Nuevo Tipo de Lesión</Link>
          <Link to="/jugadores/nuevo" className="nav__link">Nuevo Jugador</Link>
          <Link to="/equipos/nuevo" className="nav__link">Nuevo Equipo</Link>
          <Link to="/estadisticas-jugador/nuevo" className="nav__link">Nueva Estadística</Link>
        </nav>
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

const router = createBrowserRouter([
  { path: '/', element: <><Layout/><Home/></> },
  { path: '/lesiones', element: <><Layout/><LesionList/></> },
  { path: '/lesiones/nueva', element: <><Layout/><LesionForm/></> },
  { path: '/lesiones/editar/:id', element: <><Layout/><LesionForm/></> },

  { path: '/tipos-lesion', element: <><Layout/><TipoLesionList/></> },
  { path: '/tipos-lesion/nuevo', element: <><Layout/><TipoLesionForm/></> },
  { path: '/tipos-lesion/editar/:id', element: <><Layout/><TipoLesionForm/></> },

  { path: '/jugadores', element: <><Layout/><JugadorList/></> },
  { path: '/jugadores/nuevo', element: <><Layout/><JugadorForm/></> },
  { path: '/jugadores/editar/:id', element: <><Layout/><JugadorForm/></> },

  { path: '/equipos', element: <><Layout/><EquipoList/></> },
  { path: '/equipos/nuevo', element: <><Layout/><EquipoForm/></> },
  { path: '/equipos/editar/:id', element: <><Layout/><EquipoForm/></> },

  { path: '/estadisticas-jugador', element: <><Layout/><EstadisticaJugadorList/></> },
  { path: '/estadisticas-jugador/nuevo', element: <><Layout/><EstadisticaJugadorForm/></> },
  { path: '/estadisticas-jugador/editar/:id', element: <><Layout/><EstadisticaJugadorForm/></> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
