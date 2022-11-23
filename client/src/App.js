import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HikesTable from './components/hikesTable';
import LocalGuide from './pages/localGuide';
import GlobalMap from './components/globalMap';
// import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ParkingLot,HikesList,Hut} from './pages';
import HikesForHikers from './pages/HikesForHikers';
import API from './API.js';


import { Header, Login, SignUp,CheckEmail } from './components';
import { useEffect, useState } from 'react';
function App() {

  let vett = [{name: "Hut1", country: "Italy", numOfGuests: 10, numOfBedrooms: 3}, 
    {name: "Hut2", country: "Italy", numOfGuests: 30, numOfBedrooms: 7},
    {name: "Hut3", country: "Italy", numOfGuests: 25, numOfBedrooms: 5}];
  
  const [logged,setLogged]=useState(false);
  const [hikes, setHikes] = useState([]);
  const [huts, setHuts] = useState(vett);
  const [message, setMessage] = useState('');
  const [user,setUser]=useState('');
  const location=useLocation();
  const path=location.pathname;
  const navigate=useNavigate();

  useEffect(() => {
    const getHikesUseEff=async ()=>{
      try {
        let h=null;
        h=await API.getHikersHikesList();
        setHikes(h);
        setLogged(true);
      } catch (error) {
        if(error.status===401){
          try {
            let hikesnotauth=await API.getHikesList();
            setHikes(hikesnotauth);
            setLogged(false);
            if(path!=="/login" && path!=="/signup") navigate('/');
          } catch (error) {
            setMessage(error.message);
            setLogged(false);
            if(path!=="/login" && path!=="/signup") navigate('/');
          }
        }
        else{
          setLogged(false);
          setMessage(error);
          if(path!=="/login" && path!=="/signup") navigate('/');
        }
      }
    }
    getHikesUseEff();
}, [logged])

  async function filtering(area, lengthMin, lengthMax, dif, ascentMin, ascentMax, expectedTimeMin, expectedTimeMax){
    //lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty
    try {

      console.log(dif);

      console.log("Len min:", lengthMin);


      const newList=logged?await API.getHikersHikesList(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, dif,area): await API.getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, dif,area);
      //console.log(newList);
      setHikes(newList);
    } catch (error) {
      setHikes(-1);
      throw error;
    }
  }

 async function newHut(name, country, numberOfGuests, numberOfBedrooms, coordinate){
  try {
    //console.log(name, country, numberOfGuests, numberOfBedrooms, coordinate);
    await API.insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate);
  } catch (error) {
    throw error;
  }
}

  return (
    <>
      <Header logged={logged} user={user}/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<HikesList logged={logged} hikes={hikes} filtering={filtering}/>} />
              <Route path='/parking' element={<ParkingLot/>} />
              <Route path='/localGuide' element={<LocalGuide/>}></Route>
              <Route path='/hut' element={<Hut newHut={newHut} huts={huts}/>} />
              <Route path='/login' element={<Login setLogged={setLogged} setUser={setUser}/>}/>
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
