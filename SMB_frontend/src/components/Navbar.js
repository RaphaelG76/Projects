import React from 'react'
import {Link} from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <div className = "navbar">
       <div className ="links">
          <Link to ="">HOME</Link>
          <Link to ="biography">BIOGRAPHY</Link>
          <Link to ="plays">PLAYS</Link>
       </div>
       <div className = "title">
          <Link to="">SAMUEL BRETT WILLIAMS</Link>
       </div>
       <div className ="links">
          <Link to ="films">FILMS</Link>
          <Link to ="press">PRESS</Link>
          <Link to ="contact">CONTACT</Link>
       </div>
    </div>
  )
}

export default Navbar