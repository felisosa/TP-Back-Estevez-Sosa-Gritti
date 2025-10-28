import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import LesionForm from './pages/LesionForm'
import TipoLesionForm from './pages/TipoLesionForm'
import './styles/global.scss'

function Layout(){
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <h1 className="brand">TeamTrack</h1>
        <nav className="nav">
          <Link to="/lesiones/nueva" className="nav__link">Nueva Lesión</Link>
          <Link to="/tipos-lesion/nuevo" className="nav__link">Nuevo Tipo de Lesión</Link>
        </nav>
      </div>
    </header>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Layout/> },
  { path: '/lesiones/nueva', element: <LesionForm/> },
  { path: '/tipos-lesion/nuevo', element: <TipoLesionForm/> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
