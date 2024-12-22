import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home'; 
import Patients from './Patients'; 
import Charts from './Charts'; 
import HealthDataPrediction from './HealthDataPrediction'; 
import Navbar from './component/navBar'; // The Navbar component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Patients" element={<Patients />} />
        <Route path="/Charts" element={<Charts />} />
        <Route path="/HealthDataPrediction" element={<HealthDataPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
