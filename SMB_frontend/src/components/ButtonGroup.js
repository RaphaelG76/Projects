import React from 'react';
import '../styles/FilterButtons.css';

function ButtonGroup(props) {
    return (
        <div className="filterButtons">
          <button
              key={"All"}
              className={props.active === "All" ? "active fbutton": "fbutton" }
              onClick={() => { props.showAll(); props.setActiveProp("All");}}
            >
              {"ALL"}
          </button>
          {props.types.map((typeObject) => (
            <button
              key={typeObject.type}
              className={props.active === typeObject.type ? "active fbutton": "fbutton"}
              onClick={e => { typeObject.event(e, typeObject.type); props.setActiveProp(typeObject.type);}}
            >
              {typeObject.type.toUpperCase()}S
            </button>
          ))}
        </div>
    );
  }

  export default ButtonGroup;