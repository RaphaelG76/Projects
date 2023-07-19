import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Authenticate from '../components/Authenticate.js';
import '../styles/Popup.css'

function PhotoAddPopup(props) {
    const [authenticated, setAuthenticated] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const togglePhotoTrigger = () => {
        props.setAddPhotoTrigger(!props.addPhotoTrigger);
    }

    const handlePhotoUrlSubmit = (event) => {
        event.preventDefault();
    
        if (photoUrl === "") {
          return alert('Please enter a photo link.');
        }
    
        for (let i=0; i<props.stateParamValPhotos.length; i++) {
          if (photoUrl === props.stateParamValPhotos[i].photo) {
            setPhotoUrl('');
            return alert('This photo link already exists!');
          }
        }
    
        fetch(`/api/${props.type}/create/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photoUrl: photoUrl,
            title: props.stateParamValTitle
          })
        })
          .then(response => response.json())
          .then(data => {
            setPhotoUrl('');
            props.setAddPhotoTrigger(!props.addPhotoTrigger);
            console.log('Success');
            window.location.replace(`/#/${props.type}s`);
            return alert(`Photo URL saved successfully! The photo is now viewable on the ${props.type}'s detail page.`);
          })
          .catch(error => {
            console.error('Error:', error);
            return alert('Error: Photo URL could not be saved!');
          });
    };

    const handlePhotoFileSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
          return alert('Please upload a photo.');
        }
    
        const formData = new FormData();
        formData.append('files', selectedFile);
    
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
    
        setLoading(true);
        fetch('/api/upload/files', {
            method: 'POST',
            body: formData,
            signal: abortController.signal
        })
        .then(response => response.json())
        .then(data => {
          fetch(`/api/${props.type}/create/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photoUrl: data[0],
            title: props.stateParamValTitle
          })
        })
          .then(response => response.json())
          .then(data => {
            setLoading(false);
            props.setAddPhotoTrigger(!props.addPhotoTrigger);
            console.log('Success');
            window.location.replace(`/#/${props.type}s`);
            return alert(`Photo uploaded and saved successfully! It is now viewable on the ${props.type}'s detail page.`);
          })
          .catch(error => {
            console.error('Error:', error);
            return alert('Error: Photo could not be saved!');
          });
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
          return alert('Error: Photo could not be uploaded!');
        });
    };

    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
    };

    return (
        <div>
            <Authenticate setAuthen={setAuthenticated}/>
            {authenticated ? (
                <div>
                    {props.addPhotoTrigger && (
                        <div className = "popup">
                            <div className = "popup-inner-upcomingAdd">
                                <button className = "close-btn" onClick ={() => togglePhotoTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                                <div className="popup-header">
                                    <h2>ENTER THE PHOTO'S URL LINK</h2>
                                </div>
                                <div className="popup-content">
                                    <label htmlFor="photo-url">Enter photo URL:</label>
                                    <form className='popup-form' onSubmit={handlePhotoUrlSubmit}>
                                        <input type="text" id="photo-url" name="photo-url" value={photoUrl} placeholder="Enter the URL of a photo" onChange={(e) => setPhotoUrl(e.target.value)} />
                                        <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                                    </form>
                                </div>
                                <div className="popup-header">
                                    <h2>OR UPLOAD A PHOTO</h2>
                                </div>
                                <div className="popup-content">
                                    <label htmlFor="files">Select a photo file to upload:</label>
                                    <form className='popup-form' onSubmit={handlePhotoFileSubmit}>
                                        <input className="upload-content" type="file" id="files" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                        <button className="button-submitUpcoming" type="submit" disabled={loading}>Upload</button>
                                        {loading && 
                                          <div className = "popup">
                                            <div className = "popup-inner-upcomingAdd">
                                              <div className='loading'>
                                                <div className="popup-header">
                                                  <h2>Uploading file...</h2>
                                                </div>
                                                <label>This may take a while</label>
                                              <div className="popup-content">
                                                  <div className="loader"></div>
                                              </div>
                                              <button className="cancel-upload" type="cancel" onClick={handleCancelUpload}>Cancel</button>
                                            </div>
                                          </div>
                                        </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (null)}
        </div>
    );
}

export default PhotoAddPopup;