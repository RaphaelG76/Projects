import React, { useEffect } from 'react';

function Authenticate ({ setAuthen }) {

  useEffect(() => {
    // Make a request to check the authentication status
    fetch('/check_auth')
        .then(function(response) {
            if (response.ok) {
            response.json().then(data => {
                setAuthen(data.authenticated);
            });
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .catch(error => console.log(error));
    }, []);
}

export default Authenticate;