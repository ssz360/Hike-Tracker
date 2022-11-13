// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './API';


import { Header } from './components';
import { ParkingLot, Hut } from './pages';
import { Login } from './components';
import { SignUp } from './components';
function App() {
 const [logged,setLogged]=useState(false);

 async function newHut(name, country, numberOfGuests, numberOfBedrooms, coordinate){
  try {
    console.log(name, country, numberOfGuests, numberOfBedrooms, coordinate);
    await API.insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate);
  } catch (error) {
    throw error;
  }
}

  return (
    <>
      <Header logged={logged}/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<h1>Hike Tracker!</h1>} />
              <Route path='/parking' element={<ParkingLot/>} />
              <Route path='/hut' element={<Hut newHut={newHut}/>} />
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
