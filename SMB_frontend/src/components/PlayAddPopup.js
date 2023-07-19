import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../styles/UpcomingAdd.css';

function PlayAddPopup(props) {
    const [playId, setPlayId] = useState(null);
    const [playTitle, setPlayTitle] = useState('');
    const [playWriter, setPlayWriter] = useState('');
    const [playDesc, setPlayDesc] = useState('');
    const [playProduction, setPlayProduction] = useState('');
    const [playDev, setPlayDev] = useState('');
    const [selectedPlayType, setSelectedPlayType] = useState('');
    const [secondTrigger, setSecondTrigger] = useState(false);
    const [posterUrl, setPosterUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const toggleTrigger = () => {
        props.setTrigger(!props.trigger);
        props.setPlayAddPop(false);
        setPlayTitle('');
        setPlayWriter('');
        setPlayDesc('');
        setPlayProduction('');
        setPlayDev('');
        setSelectedPlayType('');
    }

    const toggleSecondTrigger = () => {
        setSecondTrigger(!secondTrigger);
        props.setPlayAddPop(false);
        setPlayTitle('');
        setPlayWriter('');
        setPlayDesc('');
        setPlayProduction('');
        setPlayDev('');
        setSelectedPlayType('');
        window.location.reload();
    };

    const handlePlayTitleChange = (event) => {
        setPlayTitle(event.target.value);
    };

    const handlePlayWriterChange = (event) => {
        setPlayWriter(event.target.value);
    };

    const handlePlayDescChange = (event) => {
        setPlayDesc(event.target.value);
    };

    const handlePlayProductionChange = (event) => {
        setPlayProduction(event.target.value);
    };

    const handlePlayDevChange = (event) => {
        setPlayDev(event.target.value);
    };

    const handleTypeSelect = (event) => {
        if (event.target.value === "") {
            return;
        }
        setSelectedPlayType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (playTitle === '') {
            return alert('Please enter a title for the play.')
        } else if (selectedPlayType === '') {
            return alert('Please select a play type.');
        }

        for (let i=0; i<props.data.length; i++) {
            if (playTitle === props.data[i].title) {
              setPlayTitle('');
              return alert('A play with that title already exists!');
            }
        }

        fetch('/api/plays', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: playTitle,
                photo: "https://s3-us-west-2.amazonaws.com/samuel-brett-williams/1680048013900-no-poster-avaliable.png",
                writer: playWriter,
                productions: playProduction,
                development: playDev,
                description: playDesc,
                type_play: selectedPlayType
            })
        })
        .then(response => response.json())
        .then(data => {
            setPlayTitle('');
            setPlayWriter('');
            setPlayProduction('');
            setPlayDev('');
            setPlayDesc('');
            setSelectedPlayType('');
            setPlayId(data.id);
            props.setTrigger(false);
            setSecondTrigger(true);
            console.log('Success');
        })
        .catch(error => {
            console.error('Error:', error);
            return alert('Error: Play data could not be saved!');
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

        fetch('/api/plays/photo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                photo: posterUrl,
                id: playId
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
          fetch('/api/plays/photo', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photo: data[0],
            id: playId
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
                    {props.playAddPop && (
                        <div className = "popup">
                            <div className = "popup-inner-upcomingAdd">
                                <button className = "close-btn" onClick ={() => toggleTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                                <div className="popup-header">
                                    <h2>ENTER PLAY DETAILS</h2>
                                </div>
                                <div className="popup-content">
                                <form className='popup-form' onSubmit={handleSubmit}>
                                    <label htmlFor="play-title">Title:</label>
                                    <input type="text" id="play-title" name="play-title" value={playTitle} placeholder="Enter the play's title" onChange={handlePlayTitleChange} />

                                    <label htmlFor="play-writer">Writer(s):</label>
                                    <textarea type="text" id="play-writer" name="play-writer" value={playWriter} placeholder="Enter the play's writer(s)" onChange={handlePlayWriterChange} />

                                    <label htmlFor="play-desc">Synopsis:</label>
                                    <textarea type="text" id="play-desc" name="play-desc" value={playDesc} placeholder="Enter the play's synopsis" onChange={handlePlayDescChange} />
                                    
                                    <label htmlFor="play-production">Production(s):</label>
                                    <textarea type="text" id="play-production" name="play-production" value={playProduction} placeholder="Enter the play's production(s)" onChange={handlePlayProductionChange} />
                                    
                                    <label htmlFor="play-dev">Development(s):</label>
                                    <textarea type="text" id="play-dev" name="play-dev" value={playDev} placeholder="Enter the play's development(s)" onChange={handlePlayDevChange} />
                                    
                                    <label htmlFor="link-select">Type:</label>
                                    <select id="link-select" onChange={handleTypeSelect}>
                                        <option value="">--Choose the play's type--</option>
                                        <option value="Full Length">Full Length</option>
                                        <option value="One Act">One Act</option>
                                        <option value="Ten Minute">Ten Minute</option>
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
                                    <h2>ENTER THE PLAY'S POSTER URL</h2>
                                </div>
                                <div className="popup-content">
                                    <label htmlFor="poster-url">Enter poster URL:</label>
                                    <form className='popup-form' onSubmit={handleUrlSubmit}>
                                        <input type="text" id="poster-url" name="poster-url" value={posterUrl} placeholder="Enter the URL of the play's poster" onChange={handlePosterUrlChange} />
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

export default PlayAddPopup;