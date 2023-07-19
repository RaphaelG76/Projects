import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import '../styles/Navbar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faFacebookF,
    faTwitter,
    faInstagram
  } from "@fortawesome/free-brands-svg-icons";
import '../styles/SocialMediaBar.css';
import Authenticate from '../components/Authenticate.js';

function SocialMediaBar() {
    const [authenticated, setAuthenticated] = useState();

    const handleLogout = () => {
        fetch('/logout', { method: 'GET' })
        .then(() => {
            window.location.href = '/';
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className='socialBar'>
            <div className='social-links'>
                <a href = "https://www.Twitter.com" className = "icons">
                    <FontAwesomeIcon icon = {faTwitter}/>
                </a>
                <a href = "https://www.facebook.com/samuel.b.williams.18" className = "icons">
                    <FontAwesomeIcon icon = {faFacebookF}/>
                </a>
                <a href = "https://www.instagram.com/samuelbrett44/" className = "icons">
                    <FontAwesomeIcon icon = {faInstagram}/>
                </a>
                <a href = "https://www.youtube.com/results?search_query=samuel+brett+williams" className = "icons">
                    <FontAwesomeIcon icon = {faYoutube}/>
                </a>
            </div>
            <div className='admin-link'>
                <Authenticate setAuthen={setAuthenticated}/>
                {authenticated ? (
                    <button onClick={handleLogout}>LOGOUT</button>
                ) : (
                    <Link to ="admin_login">ADMIN</Link>
                )}
            </div>
        </div>
    )
}

export default SocialMediaBar;  