import React from 'react';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

/* All Pages
    -latest
    -health
    -entertainment
    -sports
    -academics
    -politics
    -business
    -lifestyle
*/

import Latest from "./pages/latest";
import Sports from './pages/sports';
import Lifestyle from './pages/lifestyle';
import Entertainment from './pages/entertainment';
import Politics from './pages/politics';
import Business from './pages/business';
import Health from './pages/health';
import Academics from './pages/academics';
import Login from './pages/login'
import NewsUpdating from './pages/newsUpdating';
import Register from './pages/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Latest/>}/>
        <Route path='/sports' element={<Sports/>}/>
        <Route path='/lifestyle' element={<Lifestyle/>}/>
        <Route path='/entertainment' element={<Entertainment/>}/>
        <Route path='/politics' element={<Politics/>}/>
        <Route path='/business' element={<Business/>}/>
        <Route path='/health' element={<Health/>}/>
        <Route path='/academics' element={<Academics/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/newsPosting' element={<NewsUpdating/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;
