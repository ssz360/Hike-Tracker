// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './components';
import { ParkingLot, HikesList } from './pages';
import { useState } from 'react';

function App() {
  // const [logged,setLogged]=useState(false);

  const vett = [{label : "Crazy Mountain", length : 100, difficulty: "Tourist"}, 
  {label : "Yuuu hike", length : 200, difficulty: "Hiker"},
  {label : "Monte bianco", length : 300, difficulty: "Professional hiker"},
  {label : "Andrea best member", length : 100, difficulty: "Tourist"}];

  const [hikes, setHikes] = useState(vett);

  return (
    <>
      <Header/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<HikesList hikes={hikes} />} />
              <Route path='/parking' element={<ParkingLot/>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
