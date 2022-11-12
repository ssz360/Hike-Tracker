import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import HikesForHikers from './pages/HikesForHikers';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [logged,setLogged]=useState(false);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/hikes' element={<HikesForHikers/>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
