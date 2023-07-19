import React, { useState, useEffect } from 'react'
import '../styles/Video.css'
import blank from '../assets/blank.jpg'
import ReactPlayer from 'react-player'
import Authenticate from '../components/Authenticate.js';

function Video(props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  function popupBtn(){
    props.setButtonPopup(true);
    props.setUrl(props.url);
  }

  function handleDelete(videoId) {
    fetch(`/api/delete/video?id=${videoId}`)
      .then(response => response.json())
      .then(data => {
        window.location.replace(`/#/${props.type}s`);
        return alert(`Video successfully deleted. Change can be viewed on the ${props.type}'s detail page.`)
      })
      .catch(error => {
        console.error(error);
        return alert('Error: Could not delete video!');
      });
  };

  function handleConfirm(videoId) {
    setShowConfirm(false);
    handleDelete(videoId);
  };

  const config = {
    file: {
      attributes: {
        controlsList: 'nodownload', // disables download button for some browsers
      },
    },
    // disables right-click context menu on video
    disableContextMenu: true,
  };

  return (
    <div className = "video">
      <div className = "imgContainer-video">
        <div className='playButton-container'>
          <button className = "playButton"  onClick  = {() =>popupBtn() }></button>
        </div>
        <div className = 'blank' style={{backgroundColor: '#240f0e',}}/>
          <ReactPlayer
                className='react-player'
                url={props.url}
                width = '100%'
                height = '100%'
                fluid = { false }
                playing= {false}
                controls = {false}
                muted = {true}
                config = {config}
                style={{ pointerEvents: 'none' }}
              />
      </div>

      <Authenticate setAuthen={setAuthenticated}/>
      {authenticated ? (
        <div className='video-delete'>
          <button className="delete-video" onClick={() => setShowConfirm(true)}>Delete</button>
          {showConfirm && (
            <div className = "popup">
              <div className = "popup-inner-upcomingAdd">
                <div className="popup-header">
                  <h2>Are you sure you want to delete this video?</h2>
                </div>
                <div className="popup-content">
                  <div className="popup-deleteFeature">
                    <button className="confirm-buttons" onClick={() => handleConfirm(props.id)}>Yes</button>
                    <button className="confirm-buttons" onClick={() => setShowConfirm(false)}>No</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (null)}
    </div>
  )
}

export default Video