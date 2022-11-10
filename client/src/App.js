import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import './App.css';
import HikesTable from './components/hikesTable';
import { Routes,Route } from 'react-router-dom';
import LocalGuide from './components/localGuide';
import GlobalMap from './components/globalMap';
function App() {
  const [logged,setLogged]=useState(false);

  return (
    <>
      <Routes>
        <Route path='/' element={<HikesTable/>} />
      </Routes>
      <LocalGuide/>
    </>
  );
}

export default App;
