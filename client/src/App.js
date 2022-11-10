// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './components';
import { ParkingLot } from './pages';

function App() {
  // const [logged,setLogged]=useState(false);

  return (
    <>
      <Header/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<h1>Hike Tracker!</h1>} />
              <Route path='/parking' element={<ParkingLot/>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
