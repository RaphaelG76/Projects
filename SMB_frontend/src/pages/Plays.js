import React, { useState, useEffect } from 'react';
import '../styles/Plays.css'
import '../components/ButtonGroup.js'
import '../components/SearchBar.js'
import '../styles/SearchBar.css'
import SearchBar from '../components/SearchBar'
import ButtonGroup from '../components/ButtonGroup'
import Play from '../components/Play.js'
import playData from '../samples/samplePlays'
import banner_img from '../assets/plays_background.png'
import Authenticate from '../components/Authenticate.js';
import PlusIcon from '../assets/add-icon.png';
import PlayAddPopup from '../components/PlayAddPopup.js';
import '../styles/Banner.css'


export default function Plays() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("All");

  const [playAdd, setPlayAdd] = useState(false);
  const [playAddPop, setPlayAddPop] = useState(false);
  const [authenticated, setAuthenticated] = useState();

  const plays = filteredData && filteredData.map(item => {
    return(
      <Play key = {item.id}
      {...item}

      />
    )
  })

  const setPlays = plays => {
    setFilteredData(plays);
  }

  const setActiveProp = (tabname) => {
    setActive(tabname);
  }

   useEffect(() => {
     fetch('/api/plays')
       .then(response => {
         if (response.ok) {
           return response.json()
         }
         throw response;
       })
       .then(data => {
         setData(data.reverse());
         setFilteredData(data);
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

   const showAll = event => {
     setFilteredData(data);
   }
 
   const showType = (event, type) => {
     var filtered_data = data.filter(data => data.type_play === type);
     setFilteredData(filtered_data);
   }

   const types = [
     {
       type: "Full Length",
       event: showType
     },
     {
       type: "One Act",
       event: showType
     },
     {
       type: "Ten Minute",
       event: showType
    }];

    function playAddPopup(){
      setPlayAdd(true);
      setPlayAddPop(true);
    }

  return (
    <div className="page">
      <div className='banner-container'>
        <div className='banner-name'>
          <div className="banner">PLAYS</div>
        </div>
        <img className='bannerPlays' src={banner_img} />
      </div>
      <div className='page-container'>
        <div className='filterSearch-container'>
          <ButtonGroup showAll={showAll} types={types} setActiveProp={setActiveProp} active={active} />
          <SearchBar setContent={setPlays} showAll={showAll} setActiveProp={setActiveProp} name={"plays"} />
        </div>

        <Authenticate setAuthen={setAuthenticated}/>
        {
        <div className="plays">
          {authenticated ? (
            <div className="imgContainer">
              <div className="blank-add-plays">
                <button className="addButton" onClick={() => playAddPopup()}>
                  <img src = {PlusIcon}></img></button>
              </div>
            </div>
          ) : (null)}
          {plays}
        </div>
        }

        {authenticated ? (
          <PlayAddPopup trigger={playAdd}  setTrigger={setPlayAdd} playAddPop={playAddPop} setPlayAddPop={setPlayAddPop} data={data}></PlayAddPopup>
        ) : (null)}
      </div>  
    </div>
  );
}
