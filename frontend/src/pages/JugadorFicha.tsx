import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../styles/ficha-jugador.scss'

type Jugador = {
  id: number
  nombre: string
  apellido: string
  edad: string
  numero: string
  posicion: string
  foto?: string
}

type Contrato = {
  id: number
  fechaIni: string
  fechaFin: string
  fechaRealFin?: string | null
  equipo?: { id: number; nombre: string }
}

type Estadistica = {
  id: number
  temporada: number
  goles: number
  asistencias: number
  amarillas: number
  rojas: number
}

type Lesion = {
  id: number
  cdLesion: string
  descLesion: string
  fechaInicio: string
  fechaFin?: string
  tipoLesion?: { descTipoLesion: string }
}

export default function JugadorFicha(){
  const params = useParams()
  const id = Number(params.id)

  const [jugador, setJugador] = useState<Jugador | null>(null)
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([])
  const [lesiones, setLesiones] = useState<Lesion[]>([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!id) return
    fetch('/api/jugadores/' + id).then(r => r.json()).then(j => setJugador(j.data || null)).catch(e => setMsg(String(e)))
    fetch('/api/contrato?jugador=' + id).then(r => r.json()).then(j => setContratos(j.data || [])).catch(e => setMsg(String(e)))
    fetch('/api/estadisticasJugador?jugador=' + id).then(r => r.json()).then(j => setEstadisticas(j.data || [])).catch(e => setMsg(String(e)))
    fetch('/api/lesiones?jugador=' + id).then(r => r.json()).then(j => setLesiones(j.data || [])).catch(e => setMsg(String(e)))
  }, [id])

  // club actual = contrato sin fechaRealFin (todavía no terminó), el más reciente por fechaIni
  const clubActual = contratos
    .filter(c => !c.fechaRealFin)
    .sort((a, b) => (a.fechaIni < b.fechaIni ? 1 : -1))[0]?.equipo

  if (!jugador) {
    return (
      <div className="container ficha-jugador">
        {msg ? <p className="form__error">{msg}</p> : <p>Cargando ficha…</p>}
      </div>
    )
  }

  return (
    <div className="container ficha-jugador">
      <h2 className="page-title">Ficha de Jugador</h2>

      <div className="ficha-card">
        <div className="ficha-foto">
          <div className="ficha-foto__circle">
            {jugador.foto ? (
              <img src={jugador.foto} alt={`Foto de ${jugador.nombre} ${jugador.apellido}`} />
            ) : (
              <span className="ficha-foto__placeholder">Sin foto</span>
            )}
          </div>
        </div>

        <div className="ficha-box">
          <div className="ficha-box__title">{jugador.apellido}, {jugador.nombre}</div>
          <div className="ficha-box__sub">{jugador.edad} años · #{jugador.numero} · {jugador.posicion}</div>
        </div>

        <div className="ficha-box">
          <div className="ficha-box__title">{clubActual ? clubActual.nombre : 'Sin club actual'}</div>
        </div>

        <div className="ficha-grid-2">
          <div className="ficha-panel">
            <h3>Estadísticas</h3>
            {estadisticas.length === 0 ? (
              <p className="ficha-panel__empty">Sin estadísticas cargadas</p>
            ) : (
              <ul>
                {estadisticas.map(e => (
                  <li key={e.id}>
                    <strong>{e.temporada}</strong>: {e.goles} goles, {e.asistencias} asist., {e.amarillas} am., {e.rojas} roj.
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="ficha-panel">
            <h3>Historial de Lesiones</h3>
            {lesiones.length === 0 ? (
              <p className="ficha-panel__empty">Sin lesiones registradas</p>
            ) : (
              <ul>
                {lesiones.map(l => (
                  <li key={l.id}>
                    <strong>{l.cdLesion}</strong>: {l.descLesion}{l.tipoLesion ? ` (${l.tipoLesion.descTipoLesion})` : ''}
                    <br /><span style={{opacity:0.7}}>{l.fechaInicio}{l.fechaFin ? ` – ${l.fechaFin}` : ' (en curso)'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
        <Link to={`/jugadores/editar/${jugador.id}`} className="btn btn--primary">Editar</Link>
        <Link to="/jugadores" className="btn btn--primary">Listado</Link>
      </div>

      {msg && <p className="form__error">{msg}</p>}
    </div>
  )
}
