import React from 'react'
import { useState, useEffect, useRef } from 'react'
import '../styles/Biography.css'
import banner_img from '../assets/biography_background.jpeg'
import '../styles/Banner.css'
import Authenticate from '../components/Authenticate.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function Biography() {
  const [authenticated, setAuthenticated] = useState();
  const [data, setData] = useState(null);
  const [pic, setPic] = useState();
  const [des, setDes] = useState();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDes, setEditDes] = useState(false);
  const [editPic, setEditPic] = useState(false);
  const [newDes, setNewDes] = useState('');
  const [newPic, setNewPic] = useState('');
  const [updatePhotoTrigger, setUpdatePhotoTrigger] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    fetch('/api/biopage')
      .then((res) => res.json())
      .then((data) => {
        setDes(data[0].bio_des);
        setPic(data[0].client_photo);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setPageLoading(false);
      })
  }, [])

  const toggleUpdatePhotoTrigger = () => {
    setUpdatePhotoTrigger(!updatePhotoTrigger);
  }

  const handlePhotoUrlSubmit = (event) => {
    event.preventDefault();

    if (photoUrl === "") {
        return alert('Please enter a photo link.');
    }

    fetch('/api/bio/photo', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            photo: photoUrl,
        })
    })
    .then(response => response.json())
    .then(data => {
        setPhotoUrl('');
        setUpdatePhotoTrigger(!updatePhotoTrigger);
        console.log('Success');
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        return alert('Error: Photo URL could not be updated!');
    });
  }

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
      fetch('/api/bio/photo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        photo: data[0],
      })
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setUpdatePhotoTrigger(!updatePhotoTrigger);
        console.log('Success');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        return alert('Error: Photo could not be updated!');
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

  const handleEditDes = () => {
    setEditDes(true);
    setNewDes(des);
  };

  const handleEditPic = () => {
    setEditPic(true);
    setNewPic(pic);
  };

  const handleSave = () => {
    fetch('/api/biopage/bio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio_des: newDes }),
    })
      .then(() => {
        setDes(newDes);
        setEditDes(false);
      })
      .catch((error) => {
        console.error('Error updating bio_des: ', error);
      });
  };

  const handleCancel = () => {
    setEditDes(false);
  }

  if (pageLoading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Error!</div>;

  return (
    <div className="page">
      <div className='banner-container'>
        <div className='banner-name'>
          <div className="banner">BIOGRAPHY</div>
        </div>
        <img className="bannerImg" src={banner_img} />
      </div>
      <div className='page-container'>
        <Authenticate setAuthen={setAuthenticated}/>
        {authenticated ? (
          <div className='bioBody'>
            {editDes ? (
              <div className='editBio-container'>
                <div className="editBio">
                  <textarea id="des" value={newDes} onChange={(e) => setNewDes(e.target.value)}></textarea>
                  <div className='buttonDetailsUpdate'>
                    <button onClick={handleSave}>SAVE</button>
                    <button onClick={handleCancel}>CANCEL</button>
                  </div>
                </div>
                <img className="bioImg" src={pic} />
              </div>
            ) : (
              <div className="bioBody">
                <img className="bioImg" src={pic} />
                <p className='bio-span'>{des}</p>
                {updatePhotoTrigger && (
                  <div className = "popup">
                    <div className = "popup-inner-upcomingAdd">
                      <button className = "close-btn" onClick ={() => toggleUpdatePhotoTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                      <div className="popup-header">
                        <h2>ENTER PHOTO URL</h2>
                      </div>
                      <div className="popup-content">
                        <label htmlFor="photo-url">Enter photo URL:</label>
                        <form className='popup-form' onSubmit={handlePhotoUrlSubmit}>
                          <input type="text" id="photo-url" name="photo-url" value={photoUrl} placeholder="Enter the URL of photo" onChange={(e) => setPhotoUrl(e.target.value)} />
                          <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                        </form>
                      </div>
                      <div className="popup-header">
                        <h2>OR UPLOAD A PHOTO</h2>
                      </div>
                      <div className="popup-content">
                        <label htmlFor="files">Select a file to upload:</label>
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
                <div className='editBioButtons'>
                  <button className='buttonBioEdit' onClick={handleEditDes}>EDIT BIO</button>
                  <button className='buttonPosterEdit' onClick={() => toggleUpdatePhotoTrigger()}>EDIT PHOTO</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bioBody">
            <img className="bioImg" src={pic} />
            <p className='bio-span'>{des}</p>
          </div>
        )}
      </div>
    </div>
  );
}