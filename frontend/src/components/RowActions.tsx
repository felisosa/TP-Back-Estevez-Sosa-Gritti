import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  editUrl: string
  onDelete: () => void
}

export default function RowActions({ editUrl, onDelete }: Props){
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    function onDoc(e: MouseEvent){
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return ()=> document.removeEventListener('click', onDoc)
  },[])

  return (
    <div className="row-actions" ref={ref}>
      <div className="row-actions-desktop">
        <Link to={editUrl} className="nav__link">Edit</Link>
        <button className="btn" onClick={onDelete} style={{marginLeft:8}}>Eliminar</button>
      </div>

      <div className="row-actions-mobile">
        <button className="btn btn--icon" onClick={()=>setOpen(s=>!s)} aria-haspopup="true" aria-expanded={open}>⋯</button>
        {open && (
          <div className="actions-popover" role="menu">
            <Link to={editUrl} className="nav__link" role="menuitem">Editar</Link>
            <button className="btn" onClick={()=>{ setOpen(false); onDelete() }} role="menuitem">Eliminar</button>
          </div>
        )}
      </div>
    </div>
  )
}
