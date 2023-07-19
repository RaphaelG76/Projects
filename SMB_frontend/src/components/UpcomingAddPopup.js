import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../styles/UpcomingAdd.css';

function UpcomingAddPopup(props) {
  const [selectedFilm, setSelectedFilm] = useState('');
  const [filmTitles, setFilmTitles] = useState('');
  const [filmData, setFilmData] = useState(null);
  const [secondTrigger, setSecondTrigger] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const toggleTrigger = () => {
    props.setTrigger(!props.trigger);
    props.setFilmSelect(false);
  }

  const toggleSecondTrigger = () => {
    setSecondTrigger(!secondTrigger);
    props.setFilmSelect(false);
    setSelectedFilm('');
    setSelectedFile('');
    setVideoUrl('');
  };

  const handleFilmSelect = (event) => {
    event.preventDefault();
    if (event.target.value === "") {
        return;
    }
    fetch(`/api/feature/film?title=${event.target.value}`)
        .then(response => { return response.json() })
        .then(data => { 
            setFilmData(data);
            setSelectedFilm(data.title);
            props.setTrigger(!props.trigger);
            setSecondTrigger(true);
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
            console.log(error);
        })
  };

  const handleLinkSelect = (event) => {
    if (event.target.value === "") {
        return;
    }
    setSelectedLink(event.target.value);
  };

  const handleLinkSubmit = (event) => {
    event.preventDefault();
    if (selectedLink === '') {
      return alert('Please select a video link.');
    }

    fetch('/api/film/homeSet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: selectedFilm,
        url: selectedLink
      })
    })
    .then(response => response.json())
    .then(data => {
      setSelectedFilm('');
      setSecondTrigger(!secondTrigger);
      window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
      return alert('Error: Link could not be set!');
    });
  }

  const fetchFilmTitles = async() => {
    const response = await fetch('/api/films/titles');
    const titlesData = await response.json();
    setFilmTitles(titlesData);
  }

  useEffect(() => {
    fetchFilmTitles();
  }, [])

  const handleUrlSubmit = (event) => {
    event.preventDefault();

    if (videoUrl === "") {
      return alert('Please enter a video link.');
    }

    for (let i=0; i<filmData.videos.length; i++) {
      if (videoUrl === filmData.videos[i].video) {
        setVideoUrl('');
        return alert('This video link already exists!');
      }
    }

    fetch('/api/homepage/film/create/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoUrl: videoUrl,
        title: selectedFilm
      })
    })
      .then(response => response.json())
      .then(data => {
        setVideoUrl('');
        setSelectedFilm('');
        setSecondTrigger(!secondTrigger);
        console.log('Success');
        window.location.reload();
        return alert('URL saved successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        return alert('Error: URL could not be saved!');
      });
  };

  const handleVideoUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileSubmit = async (event) => {
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
      fetch('/api/homepage/film/create/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoUrl: data[0],
        title: selectedFilm
      })
    })
      .then(response => response.json())
      .then(data => {
        setSelectedFilm('');
        setLoading(false);
        setSecondTrigger(!secondTrigger);
        console.log('Success');
        window.location.reload();
        return alert('Video uploaded and saved successfully!');
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
        {props.trigger ? (
          <div>
            {props.filmSelect && (
              <div className = "popup">
                <div className = "popup-inner-upcomingAdd">
                    <button className = "close-btn" onClick ={() => toggleTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                    <div className="popup-header">
                        <h2>SELECT A FILM TO FEATURE</h2>
                    </div>
                    <div className="popup-content">
                        <label htmlFor="film-select">Existing films:</label>
                        <select id="film-select" value={selectedFilm} onChange={handleFilmSelect}>
                            <option value="">--Please choose a film--</option>
                            {
                                filmTitles.map((data) => (
                                    <option value={data.title}>{data.title}</option>
                                ))
                            }
                        </select>
                    </div>
                  </div>
              </div>
            )}
          </div>
        ) : (
            <div>
                {secondTrigger && (
                <div className = "popup">
                    <div className = "popup-inner-upcomingAdd">
                        <button className = "close-btn" onClick ={() => toggleSecondTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                        <div className="popup-header">
                            <h2>SELECT AN EXISTING VIDEO</h2>
                        </div>
                        <div className="popup-content">
                            <label htmlFor="link-select">Avaliable video links:</label>
                            <form className='popup-form' onSubmit={handleLinkSubmit}>
                              <select id="link-select" disabled={loading} onChange={handleLinkSelect}>
                                  <option value="">--Choose a link--</option>
                                  {
                                    filmData.videos.map((vid) => (
                                        <option value={vid.video}>{vid.video} </option>
                                    ))

                                  }
                              </select>
                              <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                            </form>
                        </div>
                        <div className="popup-header">
                            <h2>OR ENTER VIDEO URL</h2>
                        </div>
                        <div className="popup-content">
                            <label htmlFor="video-url">Enter video URL:</label>
                            <form className='popup-form' onSubmit={handleUrlSubmit}>
                                <input type="text" id="video-url" name="video-url" value={videoUrl} placeholder="Enter the URL of a video" onChange={handleVideoUrlChange} />
                                <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                            </form>
                        </div>
                        <div className="popup-header">
                            <h2>OR UPLOAD A VIDEO FILE</h2>
                        </div>
                        <div className="popup-content">
                          <label htmlFor="files">Select a video file to upload:</label>
                          <form className='popup-form' onSubmit={handleFileSubmit}>
                            <input className="upload-content" type="file" id="files" onChange={handleFileSelect} />
                            <button className="button-submitUpcoming" type="submit" disabled={loading}>Upload</button>
                            {loading && 
                              <div className = "popup">
                                <div className = "popup-inner-upcomingAdd">
                                  <div className='loading'>
                                    <div className="popup-header">
                                      <h2>Uploading video...</h2>
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
        )}
    </div>
  );
}

export default UpcomingAddPopup;
