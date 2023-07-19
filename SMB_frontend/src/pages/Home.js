import React from 'react'
import '../styles/Home.css'
import {useEffect, useState} from 'react'
import Project from '../components/Project'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import {useRef} from 'react'
import Popup from '../components/Popup'
import ReactPlayer from 'react-player'
import Authenticate from '../components/Authenticate.js';
import PlusIcon from '../assets/add-icon.png';
import UpcomingAddPopup from '../components/UpcomingAddPopup'

function Home() {
  const [data,setData] = useState(null);
  const [buttonPopup,setButtonPopup] = useState(false);
  const [popupUrl,setPopupUrl] =useState('');
  const [upcomingAdd, setUpcomingAdd] = useState(false);
  const [filmSelect, setFilmSelect] = useState(false);
  const [pic,setPic] = useState();
  const [desc, setDesc] = useState();
  const [projs,setProjects] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDes, setEditDes] = useState(false);
  const [newDes, setNewDes] = useState('');
  const [authenticated, setAuthenticated] = useState();
  const [photoUrl, setPhotoUrl] = useState('');
  const [updatePhotoTrigger, setUpdatePhotoTrigger] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);


  const handleEditDes = () => {
    setEditDes(true);
    setNewDes(desc);
  };
  
  const handleSave = () => {
    fetch('/api/homepage/edit/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ about_des: newDes }),
    })
      .then(() => {
        setDesc(newDes);
        setEditDes(false);
      })
      .catch((error) => {
        console.error('Error updating about description: ', error);
      });
  };

  const handleCancel = () => {
    setEditDes(false);
  }

  const toggleUpdatePhotoTrigger = () => {
    setUpdatePhotoTrigger(!updatePhotoTrigger);
  }

  const handlePhotoUrlSubmit = (event) => {
    event.preventDefault();

    if (photoUrl === "") {
        return alert('Please enter a photo link.');
    }

    fetch('/api/homepage/photo', {
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
      fetch('/api/homepage/photo', {
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

  const scrollElement = useRef(null)

  const scrollRight = () =>{
    scrollElement.current.scrollLeft = 
    scrollElement.current.scrollLeft + 1700
  }

  const scrollLeft = () =>{
    scrollElement.current.scrollLeft = 
    scrollElement.current.scrollLeft - 1700
  }

  function upcomingPopup(){
    setUpcomingAdd(true);
    setFilmSelect(true);
  }

useEffect(() => {
  fetch('/api/homepage')
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw response;
    })
    .then(data => {
      setData(data);
      setPic(data[0].client_photo);
      setDesc(data[0].about_des);
      setProjects(data[0].films.reverse());
    })
    .catch(error => {
      console.error("Error fetching data: ", error);
      setError(error);
    })
    .finally(() => {
      setPageLoading(false);
    })
}, [])

 
if (pageLoading) return <div className="page">Loading...</div>;
if (error) return <div className="page">Error!</div>;

const projectReel = projs.map(item => {   // later data will be equal to the state variable that accepted the api data from the fetch request
  return(
    <Project
        key = {item.id}
        setButtonPopup = {setButtonPopup}
        setUrl = {setPopupUrl}
        {...item}
    />
  )
})

const config = {
  file: {
    attributes: {
      controlsList: 'nodownload', // disables download button for some browsers
    },
  },
  // disables right-click context menu on video
  disableContextMenu: true,
};

  return (
    <div className="home">
      <div className='player-wrapper'>
        <div className='home-quote'>
          <h1 className='firstline'>"Call Samuel Brett Williams a</h1>
          <div className='secondline-container'>
            <h1 className='secondline'>PLAYWRIGHT ON THE VERGE</h1><h1 className='second-end'>."</h1>
          </div>
          <h1 className='thirdline'>David A. Rosenberg, BACKSTAGE</h1>
        </div>
        <ReactPlayer
          className='react-player'
          url='https://vimeo.com/817461599'
          fluid={false}
          width='100%'
          height='100%'
          playing={true}
          controls={false}
          muted={true} 
          loop={true} 
          config={config}
          playsinline={true}
          style={{ pointerEvents: 'none' }}/>
      </div>
      <div className="page">
        <div className='page-container'>
          {editDes ? (
            <div className = "about">  
              <div className = "aboutBody">
                <div>
                  <h1>ABOUT</h1>
                  <div className='textarea-container-home'>
                    <textarea id="des" type="text" value={newDes} onChange={(e) => setNewDes(e.target.value)} />
                  </div>
                  <div className='buttonDetailsUpdate'>
                    <button onClick={handleSave}>SAVE</button>
                    <button onClick={handleCancel}>CANCEL</button>
                  </div>
                </div>
                <img className = 'samImg' src = {pic} />
              </div>
            </div>
          ) : (
            <div className = "about">  
              <div className = "aboutBody">
                <div>
                  <h1>ABOUT</h1>
                  <h2 className = "clientDesc">
                    {desc}
                  </h2>
                  <Authenticate setAuthen={setAuthenticated}/>
                  {authenticated ? (
                    <div className = "editButtons">
                      <button onClick={handleEditDes}>EDIT DESCRIPTION</button>
                    </div>
                  ) : (null)}
                </div>
                <div className='clientPhoto-container'>
                  <img className = 'samImg' src = {pic} />
                  {authenticated ? (
                    <div>
                      <div className='editContent-clientPhoto'>
                        <button className='buttonPosterEdit' onClick={() => toggleUpdatePhotoTrigger()}>EDIT PHOTO</button>
                      </div>
                      {updatePhotoTrigger && (
                        <div className = "popup">
                          <div className = "popup-inner-upcomingAdd">
                            <button className = "close-btn" onClick ={() => toggleUpdatePhotoTrigger()} >{<FontAwesomeIcon icon={faXmark} size="xl" />} </button>
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
                    </div>
                  ) : (null)}
                </div>
              </div>
            </div>
          )}
          <div className='upcomingProjects'>
            <div className='topReel'>
              <div className='reelText'>FEATURED PROJECTS</div>
              <div className='arrows'>
                <FontAwesomeIcon className='scroll-icon-left' icon={faAngleLeft} onClick={scrollLeft} />
                <FontAwesomeIcon className='scroll-icon-right' icon={faAngleRight} onClick={scrollRight} />
              </div>
            </div>
            <div className='reel' ref={scrollElement}>
              {authenticated ? (
                <div className="imgContainer">
                  <div className="blank-add">
                    <button className="addButton" onClick={() => upcomingPopup()}>
                      <img src={PlusIcon}></img></button>
                  </div>
                </div>
              ) : (null)}
              {projectReel}
            </div>
            {authenticated ? (
              <UpcomingAddPopup trigger={upcomingAdd} setTrigger={setUpcomingAdd} filmSelect={filmSelect} setFilmSelect={setFilmSelect}></UpcomingAddPopup>
            ) : (null)}

            <Popup url={popupUrl} trigger={buttonPopup} setTrigger={setButtonPopup}></Popup>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default Home

