import React from 'react'
import '../styles/Play.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Authenticate from '../components/Authenticate.js';

function Play(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authenticated, setAuthenticated] = useState();

  const title = encodeURIComponent(props.title);

  useEffect(() => {
    fetch(`/api/plays?search=${title}`)
      .then((res) => res.json())
      .then((data) => {})
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])

  const handleDelete = () => {
    fetch(`/api/delete/play?id=${props.id}`)
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
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Error!</div>;

  return (

    <div className="play">
      <div>
        <Link to={`/playdetails/${props.title}`} state={{
          title: props.title,
          cover: props.photo,
          writer: props.writer,
          photos: props.still_photos,
          duration: props.type_play,
          synopsis: props.description,
          production: props.productions,
          development: props.development,
          videos: props.videos,
          buy_links: props.buy_links,
          id: props.id,
        }} ><img className="playImg" src={props.photo} /> </Link>
      </div>
      <span className="playTitle"> {props.title} </span>
      <span className="playDuration"> {props.type_play} </span>
      <Authenticate setAuthen={setAuthenticated}/>
        {authenticated ? (
          <div className='delete-button'>
            <button className="delete-feature" onClick={() => setShowConfirm(true)}>Delete</button>
            {showConfirm && (
              <div className = "popup">
                <div className = "popup-inner-upcomingAdd">
                  <div className="popup-header">
                    <h2>Are you sure you want to delete this play?</h2>
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
        ) : (null)}
    </div>

  )
}

export default Play