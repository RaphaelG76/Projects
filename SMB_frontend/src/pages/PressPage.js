import React, { useState, useEffect } from 'react';
import '../styles/Press.css'
import PressComp from '../components/Press.js'
import banner_img from '../assets/press-bg.jpg'
import Authenticate from '../components/Authenticate.js';
import PlusIcon from '../assets/add-icon.png';
import PressAddPopup from '../components/PressAddPopup.js';

export default function PressPages() {
    
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [pressAdd, setPressAdd] = useState(false);
  const [pressAddPop, setPressAddPop] = useState(false);

  const press = data.map(item => {
    return(
      <PressComp key={item.id} {...item} />
    )
  })

  useEffect(() => {
    fetch('/api/press')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response;
      })
      .then(data => {
        setData(data.reverse());
      })
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

  function pressAddPopup(){
    setPressAdd(true);
    setPressAddPop(true);
  }

  return (
    <div className='page'>
      <div className='banner-container'>
        <div className='banner-name'>
          <div className="banner">PRESS</div>
        </div>
        <img className='bannerImg' src={banner_img} />
      </div>
      <div className='page-container'>
        <Authenticate setAuthen={setAuthenticated}/>
        <div className='press'>
          {authenticated ? (
              <div className="press-add-container">
                <div className="blank-add-press">
                  <button className="addButton" onClick={() => pressAddPopup()}>
                    <img src = {PlusIcon}></img></button>
                </div>
              </div>
            ) : (null)}
          {press}
        </div>
        {authenticated ? (
          <PressAddPopup trigger={pressAdd}  setTrigger={setPressAdd} pressAddPop={pressAddPop} setPressAddPop={setPressAddPop} ></PressAddPopup>
        ) : (null)}
      </div>
    </div>
  )
}