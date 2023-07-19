import './App.css';
import React from 'react';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Biography from "./pages/Biography";
import Films from "./pages/Films";
import Plays from "./pages/Plays";
import Press from "./pages/PressPage";
import Contact from "./pages/Contact";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import SocialMediaBar from './components/SocialMediaBar';
import Admin from './pages/Admin';
import FilmDetails from './pages/FilmDetails'
import PlayDetails from './pages/PlayDetails'

import ForgotPassword from './components/ForgetPassword';
import PasswordReset from './components/PasswordReset';

function App() {
  return (
    <div className="App">
      <div className='page'>
        <Router>
          <Navbar />
          <Routes>
            <Route path = "" element = {<Home/>} />
            <Route path = "biography" element =  {<Biography/>}/>
            <Route path = "plays" element =  {<Plays/>}/>
            <Route path = "films" element =  {<Films/>}/>
            <Route path = "press" element =  {<Press/>}/>
            <Route path = "contact" element =  {<Contact/>}/>
            <Route path = "admin_login" element = {<Admin/>}/>
            <Route path='reset-password' element={<PasswordReset />} />
            <Route path='forgot_password' element={<ForgotPassword />} /> 
            <Route path = "filmdetails/:type" element = {<FilmDetails/>}/>
            <Route path = "playdetails/:type" element = {<PlayDetails/>}/>
          </Routes>
          <SocialMediaBar/>
        </Router>
      </div>
    </div>
  );
}

export default App;
