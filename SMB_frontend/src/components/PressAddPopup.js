import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../styles/UpcomingAdd.css';

function PressAddPopup(props) {
    const [projectTitle, setProjectTitle] = useState('');
    const [pressName, setPressName] = useState('');
    const [pressQuote, setPressQuote] = useState('');
    const [pressAuthor, setPressAuthor] = useState('');
    const [secondTrigger, setSecondTrigger] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [pressId, setPressId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const toggleTrigger = () => {
        props.setTrigger(!props.trigger);
        props.setPressAddPop(false);
        setProjectTitle('');
        setPressName('');
        setPressQuote('');
        setPressAuthor('');
    }

    const toggleSecondTrigger = () => {
        setSecondTrigger(!secondTrigger);
        props.setPressAddPop(false);
        setProjectTitle('');
        setPressName('');
        setPressQuote('');
        setPressAuthor('');
        window.location.reload();
    };

    const handleProjectTitleChange = (event) => {
        setProjectTitle(event.target.value);
    };

    const handlePressNameChange = (event) => {
        setPressName(event.target.value);
    };

    const handlePressQuoteChange = (event) => {
        setPressQuote(event.target.value);
    };

    const handlePressAuthorChange = (event) => {
        setPressAuthor(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (pressName === '') {
            return alert('Please enter a press name.')
        }

        fetch('/api/press', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                press_title: pressName,
                project_name: projectTitle,
                quote: pressQuote,
                author: pressAuthor,
            })
        })
        .then(response => response.json())
        .then(data => {
            setProjectTitle('');
            setPressName('');
            setPressQuote('');
            setPressAuthor('');
            props.setTrigger(false);
            setSecondTrigger(true);
            setPressId(data.id);
            console.log('Success');
        })
        .catch(error => {
            console.error('Error:', error);
            return alert('Error: Press data could not be saved!');
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
                id: pressId
            })
        })
        .then(response => response.json())
        .then(data => {
            setLogoUrl('');
            setPressId(null);
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
            id: pressId
          })
        })
          .then(response => response.json())
          .then(data => {
            setPressId(null);
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

    return (
        <div>
            {props.trigger ? (
                <div>
                    {props.pressAddPop && (
                        <div className = "popup">
                            <div className = "popup-inner-upcomingAdd">
                                <button className = "close-btn" onClick ={() => toggleTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                                <div className="popup-header">
                                    <h2>ENTER PRESS DETAILS</h2>
                                </div>
                                <div className="popup-content">
                                <form className='popup-form' onSubmit={handleSubmit}>
                                    <label htmlFor="press-name">Press name:</label>
                                    <input type="text" id="press-name" name="press-name" value={pressName} placeholder="Enter the name of the press" onChange={handlePressNameChange} />
                                    
                                    <label htmlFor="project-title">Project title:</label>
                                    <input type="text" id="project-title" name="project-title" value={projectTitle} placeholder="Enter the project title that the press is referencing" onChange={handleProjectTitleChange} />
                                    
                                    <label htmlFor="press-quote">Quote:</label>
                                    <textarea type="text" id="press-quote" name="press-quote" value={pressQuote} placeholder="Enter quote from the press" onChange={handlePressQuoteChange} />

                                    <label htmlFor="press-author">Author(s):</label>
                                    <input type="text" id="press-author" name="press-author" value={pressAuthor} placeholder="Enter the name of the author(s)" onChange={handlePressAuthorChange} />
                                    
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
                                    <label className='optional'>Logo url/upload is optional. Press 'x' to opt-out</label>
                                    <h2>ENTER THE PRESS'S LOGO IMAGE URL</h2>
                                </div>
                                <div className="popup-content">
                                    <label htmlFor="poster-url">Enter logo URL:</label>
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
            )}
        </div>
    )
}

export default PressAddPopup;