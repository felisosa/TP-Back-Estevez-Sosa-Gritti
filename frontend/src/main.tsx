import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import LesionForm from './pages/LesionForm'
import TipoLesionForm from './pages/TipoLesionForm'

function Layout(){
  return (
    <div style={{fontFamily:'system-ui,Segoe UI,Roboto,Arial,sans-serif', padding:'1rem'}}>
      <h1>TeamTrack</h1>
      <nav style={{display:'flex', gap:'1rem'}}>
        <Link to="/lesiones/nueva">Nueva Lesión</Link>
        <Link to="/tipos-lesion/nuevo">Nuevo Tipo de Lesión</Link>
      </nav>
    </div>
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
