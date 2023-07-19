import React from 'react'
import '../styles/Popup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'



function Popup(props) {

  const toggleTrigger = () => {
    props.setTrigger(!props.trigger)
  }
  
  return (props.trigger) ? (
    <div className = "popup">
        <div className = "popup-inner">
            <button className = "close-btn"onClick ={() => toggleTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} size="xl" />} </button>
            <div className='popup-wrapper'>
          <ReactPlayer
            className='popup-player'
            url = {props.url}
            width='100%'
            height='100%'
            playing= {true}
            controls = {true}
            muted = {true}
            disableDeferredLoading = {true}
          />
        </div>
        </div>
    </div>
  ) : "";
}

export default Popup