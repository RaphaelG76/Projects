import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass, faXmark} from '@fortawesome/free-solid-svg-icons';
import '../styles/SearchBar.css';

function SearchBar(props){
    const [data, setData] = useState(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChange = event => {
        setQuery(event.target.value);
    }
    
    const handleSubmit = event => {
        event.preventDefault();
            fetch(`/api/${props.name}?title=${query}`)
              .then(response => {
                if (response.ok) {
                  return response.json()
                }
                throw response;
              })
              .then(data => {
                props.setContent(data.reverse());
                props.setActiveProp(null);
                setData(data.reverse());
              })
              .catch(error => {
                console.error("Error fetching data: ", error);
                setError(error);
              })
              .finally(() => {
                setLoading(false);
              })
        
          if (loading) return <div className="page">Loading...</div>;
          if (error) return <div className="page">Error!</div>;
      };

    const clearInput = () => {
        props.showAll();
        props.setActiveProp("All")
        setQuery("");
        setData(null);
    }

    return(
        <div className="search">
            <div className="searchInput">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder= "Search"
                        value = {query} 
                        onChange={handleChange}
                    />
                    <div className = "searchIcon">
                    {
                        data === null ? (
                            <FontAwesomeIcon icon={faMagnifyingGlass} id="clickBtn" onClick={handleSubmit} width="25" size="1x"/>
                        ):(
                            <FontAwesomeIcon icon={faXmark} id="clearBtn" onClick={clearInput} size="1x"/> 
                    )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SearchBar;