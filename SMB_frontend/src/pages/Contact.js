import React, {useState, useEffect} from 'react'
import contactBackground from '../assets/contact_background.jpg'
import '../styles/Contact.css'
import validator from 'email-validator'
import Authenticate from '../components/Authenticate.js';
// import axios from 'axios'

function Contact() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [clientInfo, setClientInfo] = useState('');
  const [agentInfo, setAgentInfo] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [authenticated, setAuthenticated] = useState();
  const [isEditingClientInfo, setIsEditingClientInfo] = useState(false);
  const [isEditingAgentInfo, setIsEditingAgentInfo] = useState(false);

  useEffect(() => {
    fetch('/api/contactpage')
      .then((res) => res.json())
      .then((data) => {
        setClientInfo(data[0].client_info);
        setAgentInfo(data[0].agent_info);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setPageError(error);
      })
      .finally(() => {
        setPageLoading(false);
      })
  }, [])

  if (pageLoading) return <div className="page">Loading...</div>;
  if (pageError) return <div className="page">Error!</div>;

  function resetFields() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setMessage('');
  }

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (firstName === "") {
      return alert('Please enter your first name.');
    } else if (lastName === "") {
      return alert('Please enter your last name.');
    } else if (email === "") {
      return alert('Please enter your email.');
    } else if (message === "") {
      return alert('Please enter a message.');
    }

    await fetch('api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        message
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      resetFields();
      return alert('Message sent successfully!');
    })
    .catch(error => {
      console.error('Error sending email:', error);
    });

  };

  const handleEditClient = () => {
    setIsEditingClientInfo(true);
  }
  
  const handleClientCancel = () => {
    setIsEditingClientInfo(false);
  }

  const handleClientSave = (event) => {
    event.preventDefault();

    fetch('/api/contact/edit/client_info', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          client_info: clientInfo
      })
    })
    .then(response => response.json())
    .then(data => {
      setIsEditingClientInfo(false);
      console.log('Success');
    })
    .catch(error => {
      console.error('Error:', error);
      return alert('Error: Info could not be updated!');
    });
  }

  const handleEditAgent = () => {
    setIsEditingAgentInfo(true);
  }
  
  const handleAgentCancel = () => {
    setIsEditingAgentInfo(false);
  }

  const handleAgentSave = (event) => {
    event.preventDefault();

    fetch('/api/contact/edit/agent_info', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          agent_info: agentInfo
      })
    })
    .then(response => response.json())
    .then(data => {
      setIsEditingAgentInfo(false);
      console.log('Success');
    })
    .catch(error => {
      console.error('Error:', error);
      return alert('Error: Info could not be updated!');
    });
  }
   
  return (
    <div className="page">
    <div className='banner-container'>
      <div className='banner-name'>
        <div className="banner">CONTACT US</div>
      </div>
      <img className='bannerImg' src={contactBackground}/>
    </div>
    <div className='page-container'>
      <div className='contact-container'>
        <Authenticate setAuthen={setAuthenticated}/>
        {authenticated ? (
          <div className='info-container'>
            {isEditingClientInfo || isEditingAgentInfo ? (
              <div>
                {isEditingClientInfo && (
                  <div className='contact-info'>
                    <h3>Contact Information:</h3>
                    <div className='editing-client'>
                      <textarea id="client-info" value={clientInfo} onChange={(e) => setClientInfo(e.target.value)}></textarea>
                      <div className='buttonInfoUpdate'>
                        <button onClick={handleClientSave}>SAVE</button>
                        <button onClick={handleClientCancel}>CANCEL</button>
                      </div>
                    </div>
                    <div className="agent-info">
                      <h3>Agent:</h3>
                      <span>{agentInfo}</span>
                    </div>
                  </div>
                )}
                {isEditingAgentInfo && (
                  <div className='contact-info'>
                    <h3>Contact Information:</h3>
                    <span>{clientInfo}</span>
                    <div className="agent-info">
                      <h3>Agent:</h3>
                      <div className='editing-agent'>
                        <textarea id="agent-info" value={agentInfo} onChange={(e) => setAgentInfo(e.target.value)}></textarea>
                        <div className='buttonInfoUpdate'>
                          <button onClick={handleAgentSave}>SAVE</button>
                          <button onClick={handleAgentCancel}>CANCEL</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className='contact-info'>
                  <h3>Contact Information:</h3>
                  <span>{clientInfo}</span>
                  <div className='editContent-contact'>
                    <button className='buttonInfoEdit' onClick={handleEditClient}>EDIT INFO</button>
                  </div>
                </div>
                <div className="agent-info">
                  <h3>Agent:</h3>
                  <span>{agentInfo}</span>
                  <div className='editContent-contact'>
                    <button className='buttonInfoEdit' onClick={handleEditAgent}>EDIT INFO</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='info-container'>
            <div className="contact-info">
              <h3>Contact Information:</h3>
              <span>{clientInfo}</span>
            </div>
            <div className="agent-info">
              <h3>Agent:</h3>
              <span>{agentInfo}</span>
            </div>
          </div>
        )}
        <div className="message-container" >
          <form className="contact-form" onSubmit={handleSubmit} >
            <div className="top-contact-container">
              <div className="first-name">
                <input className='contact-first-name' type="text" id="firstName" value={firstName} name="firstName" placeholder="First Name*" onChange={handleFirstNameChange}/>
              </div>
              <div className="last-name">
                  <input className='contact-last-name' type="text" id="lastName" value={lastName} name="lastName" placeholder="Last Name*" onChange={handleLastNameChange}/>
              </div>  
            </div>
            <div className="form-group">
              <input className='contact-email' type="email" id="email" name="email" value={email} placeholder="Email Address*" onChange={handleEmailChange}  />
            </div>
            <div className="form-group">
              <textarea className='contact-message' id="message" name="message" value={message} rows="10" placeholder="Message*" onChange={handleMessageChange}></textarea>
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Contact