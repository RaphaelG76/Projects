import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../styles/Photo.css';
import Authenticate from '../components/Authenticate.js';

function Photo(props) {
  const [trigger, setTrigger] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const toggleTrigger = () => {
    setTrigger(!trigger);
  }

  const handleImgClick = () => {
    setTrigger(true);
  }

  function handleDelete(photoID) {
    fetch(`/api/delete/photo?id=${photoID}`)
    .then(response => response.json())
    .then(data => {
      window.location.replace(`/#/${props.type}s`);
      return alert(`Photo successfully deleted. Change can be viewed on the ${props.type}'s detail page.`)
    })
    .catch(error => {
      console.error(error);
      return alert('Error: Could not delete photo!');
    });
  };

  function handleConfirm(photoID) {
    setShowConfirm(false);
    handleDelete(photoID);
  }

  return (
    <div className='photo'>
      <div className='imgContainer-photo'>
        <img src={props.photo} onClick = {() => handleImgClick()}/>
      </div>
      {trigger ? (
        <div className = "popup">
          <div className = "popup-inner-photo">
              <button className = "close-btn" onClick ={() => toggleTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
              <img src={props.photo} />
          </div>
        </div>
      ) : ('')}

      <Authenticate setAuthen={setAuthenticated}/>
      {authenticated ? (
        <div className='photo-delete'>
          <button className="delete-photo" onClick={() => setShowConfirm(true)}>Delete</button>
          {showConfirm && (
            <div className = "popup">
              <div className = "popup-inner-upcomingAdd">
                <div className="popup-header">
                  <h2>Are you sure you want to delete this photo?</h2>
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

export default Photo