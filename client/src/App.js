import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HikesTable from './components/hikesTable';
import LocalGuide from './pages/localGuide';
import GlobalMap from './components/globalMap';
// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './components';
import { ParkingLot, HikesList,Hut} from './pages';
import API from './API.js';
import { Login } from './components';
import { SignUp } from './components';
function App() {
  const [logged,setLogged]=useState(false);

  const [hikes, setHikes] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const getHikesUseEff=async ()=>{
      try {
        let h=null;
        if (logged) h=await API.getHikersHikesList();
        else h=await API.getHikesList();
        setHikes(h);
      } catch (error) {
        setMessage(error);
      }
    }
    getHikesUseEff();
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

      const newList=await API.getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, dif,area);
      console.log(newList);
      setHikes(newList);
    } catch (error) {
      setHikes(-1);
      throw error;
    }
  }

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
              <Route path='/' element={<HikesList logged={logged} hikes={hikes} filtering={filtering}/>} />
              <Route path='/parking' element={<ParkingLot/>} />
              <Route path='/localGuide' element={<LocalGuide></LocalGuide>}></Route>
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
