import './App.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import PlanPage from './pages/plan/PlanPage';
import ProfilePage from './pages/profile/ProfilePage';
import {Navigate, Link} from "react-router-dom"

import Header from './components/Header/Header'


export default function App() {

  
  return (
    
    <div className='App'>
        <Header/>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/profile/:name" element={<ProfilePage />} />
          <Route
              path="/plan.html"
              element={<Navigate to="/plan.html"/>}
          />
        </Routes>
    </div>
  );
}