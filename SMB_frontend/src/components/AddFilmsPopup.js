import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../styles/UpcomingAdd.css';

function AddFilmsPopup(props) {
    const [filmId, setFilmId] = useState(null);
    const [filmTitle, setFilmTitle] = useState('');
    const [filmDirector, setFilmDirector] = useState('');
    const [filmWriter, setFilmWriter] = useState('');
    const [stars, setStars] = useState('');
    const [status, setStatus] = useState('');
    const [filmDesc, setFilmDesc] = useState('');
    const [selectedFilmType, setSelectedFilmType] = useState('');
    const [secondTrigger, setSecondTrigger] = useState(false);
    const [posterUrl, setPosterUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const toggleTrigger = () => {
        props.setTrigger(!props.trigger);
        props.setFilmAddPop(false);
        setFilmTitle('');
        setFilmDirector('')
        setFilmWriter('');
        setStars('');
        setStatus('');
        setFilmDesc('');
        setSelectedFilmType('');
    }

    const toggleSecondTrigger = () => {
        setSecondTrigger(!secondTrigger);
        props.setFilmAddPop(false);
        setFilmTitle('');
        setFilmDirector('')
        setFilmWriter('');
        setStars('');
        setStatus('');
        setFilmDesc('');
        setSelectedFilmType('');
        window.location.reload();
    };

    const handleFilmTitleChange = (event) => {
        setFilmTitle(event.target.value);
    };

    const handleFilmDirectorChange = (event) => {
        setFilmDirector(event.target.value);
    };

    const handleStarsChange = (event) => {
        setStars(event.target.value);
    };

    const handleFilmWriterChange = (event) => {
        setFilmWriter(event.target.value);
    };

    const handleFilmDescChange = (event) => {
        setFilmDesc(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleTypeSelect = (event) => {
        if (event.target.value === "") {
            return;
        }
        setSelectedFilmType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (filmTitle === '') {
            return alert('Please enter a title for the film.')
        } else if (selectedFilmType === '') {
            return alert('Please select a film type.');
        }

        for (let i=0; i<props.data.length; i++) {
            if (filmTitle === props.data[i].title) {
              setFilmTitle('');
              return alert('A film with that title already exists!');
            }
        }

        fetch('/api/films', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: filmTitle,
                photo: "https://s3-us-west-2.amazonaws.com/samuel-brett-williams/1680048013900-no-poster-avaliable.png",
                screenplay: filmWriter,
                director: filmDirector,
                stars: stars,
                status: status,
                description: filmDesc,
                type_film: selectedFilmType
            })
        })
        .then(response => response.json())
        .then(data => {
            setFilmTitle('');
            setFilmDirector('')
            setFilmWriter('');
            setStars('');
            setStatus('');
            setFilmDesc('');
            setSelectedFilmType('');
            setFilmId(data.id);
            props.setTrigger(false);
            setSecondTrigger(true);
            console.log('Success');
        })
        .catch(error => {
            console.error('Error:', error);
            return alert('Error: Film data could not be saved!');
        });
    }

    const handlePosterUrlChange = (event) => {
        setPosterUrl(event.target.value);
    };

    const handleUrlSubmit = (event) => {
        event.preventDefault();

        if (posterUrl === "") {
            return alert('Please enter a poster link.');
        }

        fetch('/api/films/photo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                photo: posterUrl,
                id: filmId
            })
        })
        .then(response => response.json())
        .then(data => {
            setPosterUrl('');
            console.log('Success');
            toggleSecondTrigger();
            return alert('Poster URL updated successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            return alert('Error: Poster URL could not be updated!');
        });
    }

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
          return alert('Please upload a poster.');
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
          fetch('/api/films/photo', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photo: data[0],
            id: filmId
          })
        })
          .then(response => response.json())
          .then(data => {
            setLoading(false);
            console.log('Success');
            toggleSecondTrigger();
            return alert('Poster uploaded and updated successfully!');
          })
          .catch(error => {
            console.error('Error:', error);
            return alert('Error: Poster could not be updated!');
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

    return (
        <div>
            {props.trigger ? (
                <div>
                    {props.filmAddPop && (
                        <div className = "popup">
                            <div className = "popup-inner-upcomingAdd">
                                <button className = "close-btn" onClick ={() => toggleTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                                <div className="popup-header">
                                    <h2>ENTER FILM DETAILS</h2>
                                </div>
                                <div className="popup-content">
                                <form className='popup-form' onSubmit={handleSubmit}>
                                    <label htmlFor="film-title">Title:</label>
                                    <input type="text" id="film-title" name="film-title" value={filmTitle} placeholder="Enter the film's title" onChange={handleFilmTitleChange} />

                                    <label htmlFor="film-director">Director(s):</label>
                                    <textarea type="text" id="film-director" name="film-director" value={filmDirector} placeholder="Enter the film's director(s)" onChange={handleFilmDirectorChange} />

                                    <label htmlFor="film-screenplay">Screenplay:</label>
                                    <input type="text" id="film-screenplay" name="film-screenplay" value={filmWriter} placeholder="Enter the film's screenplay writer" onChange={handleFilmWriterChange} />

                                    <label htmlFor="film-stars">Stars:</label>
                                    <textarea type="text" id="film-stars" name="film-stars" value={stars} placeholder="Enter the film's stars" onChange={handleStarsChange} />
                                    
                                    <label htmlFor="film-status">Status:</label>
                                    <input type="text" id="film-status" name="film-status" value={status} placeholder="Enter the film's status" onChange={handleStatusChange} />

                                    <label htmlFor="film-desc">Synopsis:</label>
                                    <textarea type="text" id="film-desc" name="film-desc" value={filmDesc} placeholder="Enter the film's synopsis" onChange={handleFilmDescChange} />
                                    
                                    <label htmlFor="link-select">Type:</label>
                                    <select id="link-select" onChange={handleTypeSelect}>
                                        <option value="">--Choose the film's type--</option>
                                        <option value="Feature Film">Feature Film</option>
                                        <option value="Short Film">Short Film</option>
                                    </select>
                                    <button className="button-submitUpcoming" type="submit" >Submit</button>
                                </form>
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
                                <button className = "close-btn" onClick ={() => toggleSecondTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark}/>} </button>
                                <div className="popup-header-img">
                                    <label className='optional'>Photo url/upload is optional. Press 'x' to opt-out</label>
                                    <h2>ENTER THE FILMS'S POSTER URL</h2>
                                </div>
                                <div className="popup-content">
                                    <label htmlFor="poster-url">Enter poster URL:</label>
                                    <form className='popup-form' onSubmit={handleUrlSubmit}>
                                        <input type="text" id="poster-url" name="poster-url" value={posterUrl} placeholder="Enter the URL of the film's poster" onChange={handlePosterUrlChange} />
                                        <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                                    </form>
                                </div>
                                <div className="popup-header">
                                    <h2>OR UPLOAD A POSTER</h2>
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
            )}
        </div>
    )
}

export default AddFilmsPopup;