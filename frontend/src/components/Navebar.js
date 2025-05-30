import React from 'react'
import logo from '../images/actualLogo.png'
import { Link } from 'react-router-dom'
import "./Navebar.css"

const Navebar = () => {
    return (
      <>
      <div>
        <nav>
            <img  id="logo" src={logo} alt="Trade Master Logo"/>
            <ul className="navbar">
                <Link to={"/signin"}><li>Sign In</li></Link>
                <Link to={"/signup"}><li>Sign Up</li></Link>
            </ul>
        </nav>
    </div>
    </>
  )
}

export default Navebar
