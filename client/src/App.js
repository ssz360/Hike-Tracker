// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { CheckEmail, Header, Login, SignUp  } from './components';
import { ParkingLot, Hut } from './pages';

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
              <Route path='/hut' element={<Hut/>} />
              <Route path='/login' element={<Login setLogged={setLogged}/>}/>
              <Route path='/signup' element={<SignUp setLogged={setLogged}/>}/>
              <Route path='/checkemail' element={<CheckEmail/>}/>
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
