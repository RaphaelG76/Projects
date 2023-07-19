import React, { useState } from 'react'
import '../styles/PlayDetails.css'
import Authenticate from '../components/Authenticate.js';

function BuyLink(props) {
    const [authenticated, setAuthenticated] = useState(false);
    const [showConfirmBuyLink, setShowConfirmBuyLink] = useState(false);

    function handleBuyLinkConfirm(buyLinkId) {
        setShowConfirmBuyLink(false);
        handleBuyLinkDelete(buyLinkId);
    };

    function handleBuyLinkDelete(buyLinkId) {
    fetch(`/api/delete/buyLink?id=${buyLinkId}`)
        .then(response => response.json())
        .then(data => {
        window.location.replace(`/#/${props.type}s`);
        return alert(`Buy link successfully deleted. Change can be viewed on the ${props.type}'s detail page.`)
        })
        .catch(error => {
        console.error(error);
        return alert('Error: Could not delete buyLink!');
        });
    };

    return (
        <div className='playlink'>
        <a href={props.link}>
          <img src={props.photo} />
        </a>
        <Authenticate setAuthen={setAuthenticated}/>
        {authenticated ? (
          <div>
            <button className="delete-buyLink" onClick={() => setShowConfirmBuyLink(true)}>Delete</button>
            {showConfirmBuyLink && (
              <div className = "popup">
                <div className = "popup-inner-upcomingAdd">
                  <div className="popup-header">
                    <h2>Are you sure you want to delete this buy link?</h2>
                  </div>
                  <div className="popup-content">
                    <div className="popup-deleteFeature">
                      <button className="confirm-buttons" onClick={() => handleBuyLinkConfirm(props.id)}>Yes</button>
                      <button className="confirm-buttons" onClick={() => setShowConfirmBuyLink(false)}>No</button>
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

export default BuyLink;