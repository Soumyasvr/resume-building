import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Layout from './pages/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import Preview from './pages/Preview.jsx';
import Login from './pages/Login.jsx';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element = {<Home />}/>

          <Route path="app" element={<Layout />}>
            <Route index element={<Dashboard />}/>
            <Route path="builder/:resumeId" element={<ResumeBuilder />}/>
          </Route>

          <Route path="view/:resumeId" element={<Preview/>}/>
          <Route path="login" element={<Login/>}/>
        </Routes>
      </Router>
    </>
    
  )
}

export default App
