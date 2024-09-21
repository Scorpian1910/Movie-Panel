import React from 'react'
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom';
import MovieDetail from './components/MovieDetail';

const App = () => {
  return (
    
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/:id' element={<MovieDetail/>}/>
    </Routes>
    
   
  )
}

export default App
