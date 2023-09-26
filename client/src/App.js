import React from 'react';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

/* All Pages
    -home
    -login
    -register
    -articleUpdating
    -single
*/

import Home from "./pages/home";
import Login from './pages/login'
import ArticlesUpdating from './pages/articleUpdating';
import Register from './pages/register';
import Single from './pages/single';
import Profile from './pages/profile';
import { UserProvider } from './userContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/articlePosting/:articleToUpdate' element={<ArticlesUpdating/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/sngl/:id' element={<Single/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </UserProvider>
      
    </Router>
  );
}

export default App;
