import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Authenticate from '../components/Authenticate.js';
import '../styles/Popup.css'

function VideoAddPopup(props) {
    const [authenticated, setAuthenticated] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const toggleVideoTrigger = () => {
        props.setAddVideoTrigger(!props.addVideoTrigger);
    }

    const handleVidUrlSubmit = (event) => {
        event.preventDefault();
    
        if (videoUrl === "") {
          return alert('Please enter a video link.');
        }
    
        for (let i=0; i<props.stateParamValVideos.length; i++) {
          if (videoUrl === props.stateParamValVideos[i].video) {
            setVideoUrl('');
            return alert('This video link already exists!');
          }
        }
    
        fetch(`/api/${props.type}/create/video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            videoUrl: videoUrl,
            title: props.stateParamValTitle
          })
        })
          .then(response => response.json())
          .then(data => {
            setVideoUrl('');
            props.setAddVideoTrigger(!props.addVideoTrigger);
            console.log('Success');
            window.location.replace(`/#/${props.type}s`);
            return alert(`Video URL saved successfully! The video is now viewable on the ${props.type}'s detail page.`);
          })
          .catch(error => {
            console.error('Error:', error);
            return alert('Error: Video URL could not be saved!');
          });
    };

    const handleVidFileSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
          return alert('Please upload a video.');
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
          fetch(`/api/${props.type}/create/video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            videoUrl: data[0],
            title: props.stateParamValTitle
          })
        })
          .then(response => response.json())
          .then(data => {
            setLoading(false);
            props.setAddVideoTrigger(!props.addVideoTrigger);
            console.log('Success');
            window.location.replace(`/#/${props.type}s`);
            return alert(`Video uploaded and saved successfully! It is now viewable on the ${props.type}'s detail page.`);
          })
          .catch(error => {
            console.error('Error:', error);
            return alert('Error: Video could not be saved!');
          });
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
          return alert('Error: Video could not be uploaded!');
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
                    {props.addVideoTrigger && (
                        <div className = "popup">
                            <div className = "popup-inner-upcomingAdd">
                                <button className = "close-btn" onClick ={() => toggleVideoTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                                <div className="popup-header">
                                    <h2>ENTER THE VIDEO'S URL LINK</h2>
                                </div>
                                <div className="popup-content">
                                    <label htmlFor="video-url">Enter video URL:</label>
                                    <form className='popup-form' onSubmit={handleVidUrlSubmit}>
                                        <input type="text" id="video-url" name="video-url" value={videoUrl} placeholder="Enter the URL of a video" onChange={(e) => setVideoUrl(e.target.value)} />
                                        <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                                    </form>
                                </div>
                                <div className="popup-header">
                                    <h2>OR UPLOAD A VIDEO FILE</h2>
                                </div>
                                <div className="popup-content">
                                    <label htmlFor="files">Select a video file to upload:</label>
                                    <form className='popup-form' onSubmit={handleVidFileSubmit}>
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

export default VideoAddPopup;