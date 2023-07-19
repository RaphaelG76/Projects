import React, { useState, useEffect } from 'react';
import '../styles/Films.css'
import '../components/SearchBar.js'
import '../components/ButtonGroup.js'
import '../styles/SearchBar.css'
import Film from '../components/Film.js'
import SearchBar from '../components/SearchBar'
import ButtonGroup from '../components/ButtonGroup'
import banner_img from '../assets/films_background.png'
import PlusIcon from '../assets/add-icon.png';
import AddFilmsPopup from '../components/AddFilmsPopup'
import '../styles/Banner.css'
import Authenticate from '../components/Authenticate.js';

export default function Films() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("All");
  const [authenticated, setAuthenticated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filmAdd, setFilmAdd] = useState(false);
  const [filmAddPop, setFilmAddPop] = useState(false);

  const films = filteredData && filteredData.map(item => {
    return(
      <Film key = {item.id}
      {...item}
      />
    )
  })

   const setFilms = films => {
     setFilteredData(films);
   }

   const setActiveProp = (tabname) => {
     setActive(tabname);
   }

   useEffect(() => {
     fetch('/api/films')
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

   const showAll = () => {
     setFilteredData(data);
   }
  
   const showType = (event, type) => {
     var filtered_data = data.filter(data => data.type_film === type);
     setFilteredData(filtered_data);
   }

   const types = [
     {
       type: "Feature Film",
       event: showType
     },
     {
       type: "Short Film",
       event: showType
     }];

     function filmAddPopup(){
      setFilmAdd(true);
      setFilmAddPop(true);
    }

  return (
    <div className='page'>
      <div className='banner-container'>
        <div className='banner-name'>
          <div className="banner">FILMS</div>
        </div>
        <img className='bannerFilms' src={banner_img} />
      </div>
      <div className='page-container'>
        <div className='filterSearch-container'>
          <ButtonGroup showAll={showAll} types={types} setActiveProp={setActiveProp} active={active} />
          <SearchBar setContent={setFilms} showAll={showAll} setActiveProp={setActiveProp} name={"films"} className = 'search'/>
        </div>

        <Authenticate setAuthen={setAuthenticated}/>
        {
        <div className="films">
          {authenticated ? (
            <div className="imgContainer">
              <div className="blank-add-plays">
                <button className="addButton" onClick={() => filmAddPopup()}>
                  <img src = {PlusIcon}></img></button>
              </div>
            </div>
          ) : (null)}
          {films}
        </div>
        }

        {authenticated ? (
          <AddFilmsPopup trigger={filmAdd}  setTrigger={setFilmAdd} filmAddPop={filmAddPop} setFilmAddPop={setFilmAddPop} data={data}></AddFilmsPopup>
        ) : (null)}
      </div>
    </div>
  );
}   