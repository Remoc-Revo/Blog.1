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
import ResetPassword from './pages/resetPassword';
import { UserProvider } from './userContext';
import EmailTest from './pages/testEmailNotification';

function App() {
  return (
    
    <div id="app" className="">
      {/* basename set for build only */}
      <Router basename='/'> 
        <UserProvider>
          <Routes>            
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/articlePosting/:articleIdToUpdate' element={<ArticlesUpdating/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/sngl/:id' element={<Single/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/resetPassword/:resetToken' element={<ResetPassword/>}/>
            <Route path='/emailTest' element={<EmailTest/>} />
          </Routes>
        </UserProvider>
        
      </Router>
    </div>
  );
}

export default App;
