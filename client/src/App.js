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
    -profile
*/

import Home from "./pages/home";
import Login from './pages/login'
import ArticlesUpdating from './pages/articleUpdating';
import Register from './pages/register';
import Single from './pages/single';
import Profile from './pages/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/articlePosting' element={<ArticlesUpdating/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/sngl/:id' element={<Single/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;
