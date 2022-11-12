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

  const [hikes, setHikes] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    API.getHikesList()
      .then((hikes) => setHikes(hikes))
      .catch(err => setMessage(err));
  }, [])

  async function filtering(area, len, dif, asc, time){
    //lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty
    try {
      let lengthMin = null;
      let lengthMax = null;
      let expectedTimeMin = null;
      let expectedTimeMax = null;
      let ascentMin = null;
      let ascentMax = null;

      if(dif == ""){
        dif = null;
      }

      if(len==1){
        lengthMin="0";
        lengthMax="5";  
      }
      else if(len==2){
        lengthMin=6;
        lengthMax=10; 
      }
      else if(len==3){
        lengthMin=11;
      }

      if(time==1){
        expectedTimeMin=0;
        expectedTimeMax=1;
      }
      else if(time==2){
        expectedTimeMin=1.5;
        expectedTimeMax=3;
      }
      else if(time==3){
        expectedTimeMin=3.5;
      }

      if(asc==1){
        ascentMin=0;
        ascentMax=300;
      }

      else if(asc==2){
        ascentMin=301;
        ascentMax=600;
      }

      else if(asc==3){
        ascentMin=601;
        ascentMax=1000;
      }

      else if(asc==4){
        ascentMin=1001;
      }

      const newList=await API.getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, dif);
      console.log(newList);
      setHikes(newList);
    } catch (error) {
      setHikes(-1);
      throw error;
    }
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
