import React from 'react'
import '../styles/PlayDetails.css'
import {useParams,useLocation} from 'react-router-dom'
import Photo from '../components/Photo'
import {useRef} from 'react'
import {useEffect, useState} from 'react'
import Popup from '../components/Popup'
import Video from '../components/Video'
import BuyLink from '../components/BuyLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import PlusIcon from '../assets/add-icon.png';
import Authenticate from '../components/Authenticate.js';
import VideoAddPopup from '../components/VideoAddPopup.js';
import PhotoAddPopup from '../components/PhotoAddPopup.js';

function PlayDetails() {
  const stateParamVal = useLocation().state;
  const [authenticated, setAuthenticated] = useState();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [addLinkTrigger, setAddLinkTrigger] = useState(false);
  const [updateCoverTrigger, setUpdateCoverTrigger] = useState(false);
  const [addVideoTrigger, setAddVideoTrigger] = useState(false);
  const [addPhotoTrigger, setAddPhotoTrigger] = useState(false);
  const [cover, setCover] = useState(stateParamVal.cover);
  const [newTitle, setNewTitle] = useState('');
  const [writer, setWriter] = useState(stateParamVal.writer);
  const [production, setProduction] = useState(stateParamVal.production);
  const [dev, setDev] = useState(stateParamVal.development);
  const [desc, setDesc] = useState(stateParamVal.synopsis);
  const [buyLink, setBuyLink] = useState('');
  const [buyLinkImg, setBuyLinkImg] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const [buttonPopup,setButtonPopup] = useState(false);
  const [popupUrl,setPopupUrl] =useState('');

  const toggleLinkTrigger = () => {
    setAddLinkTrigger(!addLinkTrigger);
  }

  const toggleUpdateCoverTrigger = () => {
    setUpdateCoverTrigger(!updateCoverTrigger);
  }

  const scrollElementVid = useRef(null);
  const scrollElementPhoto = useRef(null);

  const scrollRight = (reelRef) =>{
    reelRef.current.scrollLeft = 
    reelRef.current.scrollLeft + 1290
  }

  const scrollLeft = (reelRef) =>{
    reelRef.current.scrollLeft = 
    reelRef.current.scrollLeft - 1290
  }

  const photoReel = stateParamVal.photos.reverse().map(item => {
    return(
      <Photo
        photo = {item.photo}
        id = {item.id}
        type = {'play'}
      />
    )
  })

  const videoReel = stateParamVal.videos.reverse().map(item => {   // later data will be equal to the state variable that accepted the api data from the fetch request
    return(
      <Video
          setButtonPopup = {setButtonPopup}
          setUrl = {setPopupUrl}
          url = {item.video}
          id = {item.id}
          type = {'play'}
      />
    )
  })

  const buy_links = stateParamVal.buy_links.map(item => {
    return(
      <BuyLink 
        id = {item.id}
        link = {item.link}
        photo = {item.link_photo}
        type = {'play'}
      />
    )
  })
  
  const handleEditTitle = () => {
    setIsEditingTitle(true);
    setNewTitle(stateParamVal.title);
  }

  const handleEditDetails = () => {
    setIsEditingDetails(true);
  }

  const handleTitleSave = (event) => {
    event.preventDefault();

    if (newTitle === "") {
        return alert('Please enter a new title for the play.');
    }

    fetch('/api/plays/edit/title', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: stateParamVal.id,
            newTitle: newTitle
        })
    })
    .then(response => response.json())
    .then(data => {
        setIsEditingTitle(false);
        console.log('Success');
        window.location.replace("/#/plays");
        return alert('Play title updated successfully. This change is now viewable on the plays page and on the details page for the specific play.');
    })
    .catch(error => {
        console.error('Error:', error);
        return alert('Error: Play title could not be updated!');
    });
  }

  const handleDetailsSave = (event) => {
    event.preventDefault();

    fetch('/api/plays/edit/details', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: stateParamVal.id,
            newWriter: writer,
            newProduction: production,
            newDev: dev,
            newDesc: desc
        })
    })
    .then(response => response.json())
    .then(data => {
        setIsEditingDetails(false);
        console.log('Success');
    })
    .catch(error => {
        console.error('Error:', error);
        return alert('Error: Play details could not be updated!');
    });
  }

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
  }

  const handleDetailsCancel = () => {
    setIsEditingDetails(false);
  }

  const handleBuyLinkSubmit = (event) => {
    event.preventDefault();

    if (buyLink === "") {
      return alert('Please enter a buy link.');
    } else if (buyLinkImg === "") {
      return alert('Please enter the URL of the buy link logo image');
    }

    fetch('/api/plays/add/buy_link', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: stateParamVal.id,
            newBuyLink: buyLink,
            newBuyLinkImg: buyLinkImg
        })
    })
    .then(response => response.json())
    .then(data => {
        setAddLinkTrigger(false);
        console.log('Success');
        window.location.replace("/#/plays");
        return alert('Buy link was successfully added to the play. It is now viewable in the details page.')
    })
    .catch(error => {
        console.error('Error:', error);
        return alert('Error: Buy link could not be added!');
    });
  }

  const handlePosterUrlSubmit = (event) => {
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
            id: stateParamVal.id
        })
    })
    .then(response => response.json())
    .then(data => {
        setCover(posterUrl);
        setPosterUrl('');
        setUpdateCoverTrigger(!updateCoverTrigger);
        console.log('Success');
        return alert('Poster URL updated successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        return alert('Error: Poster URL could not be updated!');
    });
  }

  const handlePosterFileSubmit = async (event) => {
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
      fetch('/api/plays/photo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        photo: data[0],
        id: stateParamVal.id
      })
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setCover(data.photo);
        setUpdateCoverTrigger(!updateCoverTrigger);
        setSelectedFile(null);
        console.log('Success');
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
    <div className = 'page'>
      <div className='page-container'>
        <div className = 'playDetails'>
          <Authenticate setAuthen={setAuthenticated}/>
          <div className = 'left'>
            <img src={cover} className = 'playCoverImg' /> 
            {authenticated ? (
              <div>
                <div className='editContent'>
                  <button className='buttonPosterEdit' onClick={() => toggleUpdateCoverTrigger()}>EDIT POSTER</button>
                </div>
                {updateCoverTrigger && (
                    <div className = "popup">
                      <div className = "popup-inner-upcomingAdd">
                          <button className = "close-btn" onClick ={() => toggleUpdateCoverTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                          <div className="popup-header">
                              <h2>ENTER THE PLAY'S POSTER URL</h2>
                          </div>
                          <div className="popup-content">
                              <label htmlFor="poster-url">Enter poster URL:</label>
                              <form className='popup-form' onSubmit={handlePosterUrlSubmit}>
                                  <input type="text" id="poster-url" name="poster-url" value={posterUrl} placeholder="Enter the URL of the play's poster" onChange={(e) => setPosterUrl(e.target.value)} />
                                  <button className="button-submitUpcoming" type="submit" disabled={loading}>Submit</button>
                              </form>
                          </div>
                          <div className="popup-header">
                              <h2>OR UPLOAD A POSTER</h2>
                          </div>
                          <div className="popup-content">
                              <label htmlFor="files">Select a file to upload:</label>
                              <form className='popup-form' onSubmit={handlePosterFileSubmit}>
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

          <div className = 'right'> 
            {authenticated ? (
              <div>
                {isEditingTitle || isEditingDetails || addLinkTrigger ? (
                  <div>
                    {isEditingTitle && (
                      <div className='editContent'>
                        <div className='titleUpdate'>
                          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                          <div className='buttonTitleUpdate'>
                            <button onClick={handleTitleSave}>SAVE</button>
                            <button onClick={handleTitleCancel}>CANCEL</button>
                          </div>
                        </div>
                        <span className = "play-writer"> Writer: {writer} </span>
                        <span className = 'production'> Productions: {production} </span>
                        <span className = 'development'> Development: {dev} </span>
                        <span className='play_avaliable'>Avaliable On:</span>
                        <div className='play_links'>
                          {buy_links}
                        </div>
                        <p className = 'playSynopsis'> {desc} </p>
                      </div>
                    )}
                    {isEditingDetails && (
                      <div className='editContent'>
                        <h1 className = 'playsTitle'>{stateParamVal.title}</h1>

                        <span className = "play-writer"> Writer:
                          <input type="text" value={writer} onChange={(e) => setWriter(e.target.value)} />
                        </span>

                        <div className='textarea-container'>
                          <span className = 'production'> Productions: </span>
                          <textarea type="text" value={production} onChange={(e) => setProduction(e.target.value)} />
                        </div>

                        <div className='textarea-container'>
                          <span className = 'development'> Development: </span>
                          <textarea type="text" value={dev} onChange={(e) => setDev(e.target.value)} />
                        </div>

                        <span className='play_avaliable'>Avaliable On:</span>
                        <div className='play_links'>
                          {buy_links}
                        </div>

                        <p className = 'playSynopsis'>
                          <textarea type="text" id="play-desc" name="play-desc" value={desc} onChange={(e) => setDesc(e.target.value)} />
                        </p>

                        <div className='buttonDetailsUpdate'>
                            <button onClick={handleDetailsSave}>SAVE</button>
                            <button onClick={handleDetailsCancel}>CANCEL</button>
                        </div>
                      </div>
                    )}
                    {addLinkTrigger && (
                      <div>
                        <div className = "popup">
                          <div className = "popup-inner-upcomingAdd">
                              <button className = "close-btn" onClick ={() => toggleLinkTrigger()} >{<FontAwesomeIcon className='x-button' icon={faXmark} />} </button>
                              <div className="popup-header">
                                  <h2>CREATE A NEW BUY LINK</h2>
                              </div>
                              <div className="popup-content">
                                  <form className='popup-form' onSubmit={handleBuyLinkSubmit}>
                                      <label htmlFor="buy-link">Enter the play's buy link:</label>
                                      <input type="text" id="buy-link" name="buy-link" value={buyLink} placeholder="Enter the link where you can buy the play" onChange={(e) => setBuyLink(e.target.value)} />
                                      
                                      <label htmlFor="buy-link-image">Enter the URL of the link's logo:</label>
                                      <input type="text" id="buy-link-image" name="buy-link-image" value={buyLinkImg} placeholder="Enter the URL of the buy link's logo image" onChange={(e) => setBuyLinkImg(e.target.value)} />
                                      <button className="button-submitUpcoming" type="submit" >Submit</button>
                                  </form>
                              </div>
                          </div>
                        </div>
                        <div className='editContent'>
                          <h1 className = 'playsTitle'>{stateParamVal.title}</h1>
                          <span className = "play-writer"> Writer: {writer} </span>
                          <span className = 'production'> Productions: {production} </span>
                          <span className = 'development'> Development: {dev} </span>
                          <span className='play_avaliable'>Avaliable On:</span>
                          <div className='play_links'>
                            {buy_links}
                          </div>
                          <p className = 'playSynopsis'> {desc} </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='editContent'>
                    <div className='titleEdit'>
                      <button className='buttonTitle' onClick={handleEditTitle}>EDIT TITLE</button>
                      <h1 className = 'playsTitle'>{stateParamVal.title}</h1>
                    </div>

                    <span className = "play-writer"> Writer: {writer} </span>
                    <span className = 'production'> Productions: {production} </span>
                    <span className = 'development'> Development: {dev} </span>
                    <span className='play_avaliable'>Avaliable On:</span>
                    <div className='play_links'>
                      {buy_links}
                      <div className="imgContainer">
                        <div className="blank-add-buyLink">
                          <button onClick={() => toggleLinkTrigger()}>
                            <img src = {PlusIcon}></img></button>
                        </div>
                      </div>
                    </div>
                    <p className = 'playSynopsis'> {desc} </p>
                    
                    <button className='buttonDetailsEdit' onClick={handleEditDetails}>EDIT DETAILS</button>
                  </div>
                )}
              </div>
            ) : (
              <div className='editContent'>
                <h1 className = 'playsTitle'>{stateParamVal.title}</h1>
                
                <span className = "play-writer"> Writer:  {stateParamVal.writer} </span>
                <span className = 'production'> Productions: {stateParamVal.production} </span>
                <span className = 'development'> Development: {stateParamVal.development} </span>
                <span className='play_avaliable'>Avaliable On:</span>
                <div className='play_links'>
                  {buy_links}
                </div>
                <p className = 'playSynopsis'> {stateParamVal.synopsis} </p>
              </div>
            )}
          </div>
        </div>
      
        <div className = 'playReel'>
          <div className = 'playTopReel'>
            <div className = 'playVideoReelText'>VIDEOS</div>
            <div className = 'arrows'>
              <FontAwesomeIcon className='scroll-icon-left' icon={faAngleLeft} onClick = {() => scrollLeft(scrollElementVid)}/>
              <FontAwesomeIcon className='scroll-icon-right' icon={faAngleRight} onClick = {() => scrollRight(scrollElementVid)}/>
            </div>
          </div>
          <div className = 'vidReel' ref = {scrollElementVid}>
            {authenticated ? (
              <div className="imgContainer-videos">
                <div className="blank-add-video">
                  <button onClick={(e) => setAddVideoTrigger(!addVideoTrigger)}>
                  <img src = {PlusIcon}></img></button>
                </div>
              </div>
            ) : (null)}
            {videoReel}
          </div>
        </div>

        {authenticated ? (
          <VideoAddPopup addVideoTrigger={addVideoTrigger}  setAddVideoTrigger={setAddVideoTrigger} stateParamValVideos={stateParamVal.videos.reverse()} stateParamValTitle={stateParamVal.title} type={'play'}></VideoAddPopup>
        ) : (null)}
        <Popup url = {popupUrl} trigger = {buttonPopup}  setTrigger = {setButtonPopup} ></Popup>

        <div className = 'playReel'>
          <div className = 'playTopReel'>
            <div className = 'playPhotoReelText'>PHOTOS</div>
            <div className = 'arrows'>
              <FontAwesomeIcon className='scroll-icon-left' icon={faAngleLeft} onClick = {() => scrollLeft(scrollElementPhoto)}/>
              <FontAwesomeIcon className='scroll-icon-right' icon={faAngleRight} onClick = {() => scrollRight(scrollElementPhoto)}/>
            </div>
          </div>
          <div className = 'photoReel' ref = {scrollElementPhoto}>
            {authenticated ? (
              <div className="imgContainer-photos">
                <div className="blank-add-photo">
                  <button onClick={(e) => setAddPhotoTrigger(!addPhotoTrigger)}>
                  <img src = {PlusIcon}></img></button>
                </div>
              </div>
            ) : (null)}
            {photoReel}
          </div>
        </div> 

        {authenticated ? (
          <PhotoAddPopup addPhotoTrigger={addPhotoTrigger}  setAddPhotoTrigger={setAddPhotoTrigger} stateParamValPhotos={stateParamVal.photos.reverse()} stateParamValTitle={stateParamVal.title} type={'play'}></PhotoAddPopup>
        ) : (null)}
      </div>
    </div>
  )
}

export default PlayDetails