// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Header } from './components';
import { ParkingLot, NewHut } from './pages';
import { Login } from './components';
import { SignUp } from './components';
function App() {
 const [logged,setLogged]=useState(false);

  return (
    <>
      <Header logged={logged}/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<h1>Hike Tracker!</h1>} />
              <Route path='/parking' element={<ParkingLot/>} />
              <Route path='/newhut' element={<NewHut/>} />
              <Route path='/login' element={<Login setLogged={setLogged}/>}/>
              <Route path='/signup' element={<SignUp setLogged={setLogged}/>}/>
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
