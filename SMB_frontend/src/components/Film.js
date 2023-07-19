import React from 'react'
import '../styles/Film.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Authenticate from '../components/Authenticate.js';

function Film(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authenticated, setAuthenticated] = useState();

  const title = encodeURIComponent(props.title);

  useEffect(() => {
    fetch(`/api/films?search=${title}`)
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

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Error!</div>;

  const handleDelete = () => {
    fetch(`/api/delete/film?id=${props.id}`)
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

  return (

    <div className="film">
      <div>
        <Link to={`/filmdetails/${props.title}`} state={{
          cover: props.photo,
          title: props.title,
          director: props.director,
          writer: props.screenplay,
          stars: props.stars,
          status: props.status,
          buy_links: props.buy_links,
          synopsis: props.description,
          photos: props.still_photos,
          videos: props.videos,
          id: props.id,
        }} ><img className="filmImg" src={props.photo} /></Link>
      </div>
      <span className="filmTitle"> {props.title} </span>
      <span className="filmDuration"> {props.type_film} </span>
      <Authenticate setAuthen={setAuthenticated}/>
        {authenticated ? (
          <div className='delete-button'>
            <button className="delete-feature" onClick={() => setShowConfirm(true)}>Delete</button>
            {showConfirm && (
              <div className = "popup">
                <div className = "popup-inner-upcomingAdd">
                  <div className="popup-header">
                    <h2>Are you sure you want to delete this film?</h2>
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

export default Film