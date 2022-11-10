// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './components';
import { ParkingLot, HikesList } from './pages';
import { useState, useEffect } from 'react';
import API from './API.js';

function App() {
  // const [logged,setLogged]=useState(false);

  /*const vett = [{label : "Crazy Mountain", area: "one", length : 2, difficulty: "Tourist", ascent : 200, timeEx : 1}, 
  {label : "Yuuu hike", area: "one", length : 20, difficulty: "Hiker", ascent : 450, timeEx : 3},
  {label : "Monte bianco", area: "two", length : 10, difficulty: "Professional hiker", ascent : 1000, timeEx : 4},
  {label : "Andrea best member", area: "three", length : 4, difficulty: "Tourist", ascent : 150, timeEx : 2}];*/

  const [hikes, setHikes] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    API.getHikesList()
      .then((hikes) => setHikes(hikes))
      .catch(err => setMessage(err));
  }, [])

  function filtering(area, len, dif, asc, time){
    console.log(area, len, dif, asc, time);
  }

  return (
    <>
      <Header/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<HikesList hikes={hikes} filtering={filtering}/>} />
              <Route path='/parking' element={<ParkingLot/>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
