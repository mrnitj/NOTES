import React from 'react'
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
import Notes from './pages/Notes'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/notes' element={<Notes/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </Router>
  )
}

export default App