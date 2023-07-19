import React, { useState } from 'react'
import '../styles/Project.css'
import blank from '../assets/blank.jpg'
import play from '../assets/pbutton3.png'
import Authenticate from './Authenticate.js';

function Project(props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function popupBtn() {
      props.setButtonPopup(true);

      fetch(`/api/video/featured/film?title=${props.title}`)
      .then(response => response.json())
      .then(data => {
        props.setUrl(data.video);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleDelete = () => {
    fetch(`/api/feature/delete/film?id=${props.id}`)
      .then(response => response.json())
      .catch(error => {
        console.error(error);
        return alert('Error: Could not delete feature!');
      });
    window.location.reload();
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    handleDelete();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <><Authenticate setAuthen={setAuthenticated}/>
    <div className="imgContainer">
      <div className='img-container'>
        <div className='playButton-container'>
          <button className="playButton" onClick={() => popupBtn()}></button>
        </div>
        <img className='blank' src={props.photo} />
      </div>
        <span className='caption'>{props.title.toUpperCase()}</span>
        {authenticated ? (
          <div className='delete-button'>
            <button className="delete-feature" onClick={() => setShowConfirm(true)}>Delete</button>
            {showConfirm && (
              <div className = "popup">
                <div className = "popup-inner-upcomingAdd">
                  <div className="popup-header">
                    <h2>Are you sure you want to delete this feature?</h2>
                  </div>
                  <div className="popup-content">
                    <div className="popup-deleteFeature">
                      <button className="confirm-buttons" onClick={handleConfirm}>Yes</button>
                      <button className="confirm-buttons" onClick={handleCancel}>No</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (null)}
    </div></>
  )
}

export default Project;