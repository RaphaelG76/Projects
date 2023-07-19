import React from 'react'
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../styles/PressDetails.css'
import Authenticate from './Authenticate';


function Press(props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [secondTrigger, setSecondTrigger] = useState(false);
  const [isEditingPressDetails, setIsEditingPressDetails] = useState(false);
  const [newPressName, setNewPressName] = useState(props.press_title);
  const [projectName, setProjectName] = useState(props.project_name.toUpperCase());
  const [quote, setQuote] = useState(props.quote);
  const [author, setAuthor] = useState(props.author);
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const abortControllerRef = useRef(null);

  const toggleTrigger = () => {
    setTrigger(!trigger);
  }

  const toggleSecondTrigger = () => {
    setSecondTrigger(!secondTrigger);
  }

  const handlePressNameSubmit = (event) => {
    event.preventDefault();

    fetch('/api/press/edit/press_title', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: props.id,
        press_title: newPressName
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success');
      setTrigger(false);
      toggleSecondTrigger();
    })
    .catch(error => {
      console.error('Error:', error);
      return alert('Error: Press name could not be updated!');
    });
  }

  const handleLogoUrlChange = (event) => {
    setLogoUrl(event.target.value);
  };

  const handleUrlSubmit = (event) => {
    event.preventDefault();

    if (logoUrl === "") {
        return alert('Please enter a logo image link.');
    }

    fetch('/api/press/edit/image', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            logo: logoUrl,
            id: props.id
        })
    })
    .then(response => response.json())
    .then(data => {
        setLogoUrl('');
        console.log('Success');
        toggleSecondTrigger();
        window.location.reload();
        return alert('Logo URL updated successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        return alert('Error: Logo URL could not be updated!');
    });
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      return alert('Please upload an image.');
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
      fetch('/api/press/edit/image', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        logo: logoUrl,
        id: props.id
      })
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        console.log('Success');
        toggleSecondTrigger();
        window.location.reload();
        return alert('Logo uploaded and updated successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        return alert('Error: Logo could not be updated!');
      });
    })
    .catch(error => {
      console.error('Error:', error);
      setLoading(false);
      return alert('Error: File could not be uploaded!');
    });
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleEditDetails = () => {
    setIsEditingPressDetails(true);
  }

  const handleDetailsCancel = () => {
    setIsEditingPressDetails(false);
  }

  const handleDetailsSave = (event) => {
    event.preventDefault();

    fetch('/api/press/edit/details', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: props.id,
            project_title: projectName,
            quote: quote,
            author: author
        })
    })
    .then(response => response.json())
    .then(data => {
        setIsEditingPressDetails(false);
        console.log('Success');
    })
    .catch(error => {
        console.error('Error:', error);
        return alert('Error: Press details could not be updated!');
    });
  }

  const handleDelete = () => {
    fetch(`/api/delete/press?id=${props.id}`)
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
    window.location.reload();
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    handleDelete();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  }

  return (
    <div className = "pressIcon">
        <Authenticate setAuthen={setAuthenticated}/>
        {authenticated ? (
          <div>
            <div className='editContent-press'>
              <button className='buttonDetailsEdit' onClick={() => toggleTrigger()}>EDIT LOGO</button>
            </div>
            {trigger && (
              <div>
                <div className = "popup">
                  <div className = "popup-inner-upcomingAdd">
                    <button className = "close-btn" onClick ={() => toggleTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                    <div className="popup-header">
                      <h2>UPDATE THE PRESS NAME</h2>
                    </div>
                    <div className="popup-content">
                      <label htmlFor="press-name">Enter updated press name:</label>
                      <form className='popup-form' onSubmit={handlePressNameSubmit}>
                        <input type="text" id="press-name" name="press-name" value={newPressName} onChange={(e) => setNewPressName(e.target.value)} />
                        <button className="button-submitUpcoming" type="submit">Submit</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {secondTrigger && (
              <div className = "popup">
                <div className = "popup-inner-upcomingAdd">
                  <button className = "close-btn" onClick ={() => toggleSecondTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                  <div className="popup-header-img">
                    <label className='optional'>Logo url/upload is optional. Press 'x' to opt-out</label>
                    <h2>ENTER THE PRESS'S LOGO IMAGE URL</h2>
                  </div>
                  <div className="popup-content">
                    <label htmlFor="logo-url">Enter logo URL:</label>
                    <form className='popup-form' onSubmit={handleUrlSubmit}>
                      <input type="text" id="logo-url" name="logo-url" value={logoUrl} placeholder="Enter the URL of the press's logo image" onChange={handleLogoUrlChange} />
                      <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                    </form>
                  </div>
                  <div className="popup-header">
                    <h2>OR UPLOAD THE PRESS'S LOGO IMAGE</h2>
                  </div>
                  <div className="popup-content">
                    <label htmlFor="files">Select a file to upload:</label>
                    <form className='popup-form' onSubmit={handleFileSubmit}>
                      <input className="upload-content" type="file" id="files" onChange={handleFileSelect} />
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
        {props.press_image ? <img className = "press_image" src = {props.press_image} alt=""/> : <span className="press_title"> {newPressName} </span>}
        {authenticated ? (
          <div>
            {isEditingPressDetails ? (
              <div className='edit-press'>
                <input className='project_title-edit' type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                <textarea className='quote-edit' type="text" value={quote} onChange={(e) => setQuote(e.target.value)} />
                <input className='author-edit' type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />

                <div className='buttonDetailsUpdate-press'>
                  <button onClick={handleDetailsSave}>SAVE</button>
                  <button onClick={handleDetailsCancel}>CANCEL</button>
                </div>
              </div>
            ) : (
              <div>
                <span className = "project_title"> {projectName} </span>
                <span className = "quote"> {quote} </span>
                <span className = "author"> {author} </span>

                <div className='editContent-press'>
                  <button className='buttonDetailsEdit' onClick={handleEditDetails}>EDIT DETAILS</button>
                </div>
                <div className='delete-button-press'>
                  <button className="delete-feature" onClick={() => setShowConfirm(true)}>Delete</button>
                  {showConfirm && (
                    <div className = "popup">
                      <div className = "popup-inner-upcomingAdd">
                        <div className="popup-header">
                          <h2>Are you sure you want to delete this press?</h2>
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
              </div>
            )}
          </div>
        ) : (
          <div>
            <span className = "project_title"> {projectName} </span>
            <span className = "quote"> {quote} </span>
            <span className = "author"> {author} </span>
          </div>
        )}
  </div>
  )
}

export default Press
