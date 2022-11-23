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
import api from './lib/api';


import { Header, Login, SignUp,CheckEmail } from './components';
import { useEffect, useState } from 'react';
import LocalGuideHikes from './pages/localGuideHikes';
function App() {
  //let filteredList=[];
  const [logged,setLogged]=useState(false);
  const [hikes, setHikes] = useState([]);
  const [message, setMessage] = useState('');
  const [user,setUser]=useState();
  const location=useLocation();
  const path=location.pathname;
  const navigate=useNavigate();

  useEffect(() => {
    const getHikesUseEff=async ()=>{
      try {
        const h=await api.getHikesList();
        setHikes([...h]);
        //filteredList=[...h];
        //console.log("NEW FILTERED LIST",filteredList,"hikes",hikes,"TO PASS",hikes.filter(h=>filteredList.map(f=>f.id).includes(h.id)));
        const usr=await api.isLogged();
        setUser(usr);
        setLogged(true);
      } catch (error) {
        if(error.status===401){
          setLogged(false);
          if(path!=="/login" && path!=="/signup") navigate('/');
        }
        else{
          setMessage(error);
        }
        /*if(error.status===401){
          try {
            console.log("TRYING TO GET NOT AUTH HIKES WITH LOGGED?",logged);
            const hikesnotauth=await api.getHikesList();
            setHikes([...hikesnotauth]);
            setLogged(false);
            if(path!=="/login" && path!=="/signup") navigate('/');
          } catch (error) {
            console.log("GOT ERROR WITH ERROR STATUS",error.status,"WITH LOGGED?",logged);
            setMessage(error.message);
            setLogged(false);
            if(path!=="/login" && path!=="/signup") navigate('/');
          }
        }*/
      }
    }
    getHikesUseEff();
}, [logged,user])

  async function filtering(area, lengthMin, lengthMax, dif, ascentMin, ascentMax, expectedTimeMin, expectedTimeMax){
    //lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty
    try {

      console.log(dif);

      console.log("Len min:", lengthMin);


      const newList=await api.getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, dif,area);
      const sumArr=[...hikes,...newList.filter(h=>!hikes.map(n=>n.id).includes(h.id))];
      sumArr.forEach(h=>{
        if(newList.map(n=>n.id).includes(h.id)) h.show=true;
        else h.show=false;
      });
      setHikes([...sumArr]);
    } catch (error) {
      setHikes(-1);
      throw error;
    }
  }

 async function newHut(name, country, numberOfGuests, numberOfBedrooms, coordinate){
  try {
    //console.log(name, country, numberOfGuests, numberOfBedrooms, coordinate);
    await api.insertHut(name, country, numberOfGuests, numberOfBedrooms, coordinate);
  } catch (error) {
    throw error;
  }
}

  return (
    <>
      <Header logged={logged} setLogged={setLogged} user={user}/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<HikesList logged={logged} hikes={hikes.length>0?hikes.filter(h=>h.show):hikes} filtering={filtering}/>} />
              <Route path='/parking' element={<ParkingLot/>} />
              <Route path='/localGuide/*' element={<LocalGuide hikes={user!==undefined?hikes.filter(h=>h.author===user.username):[]} user={user}/>}></Route>
              <Route path='/hut' element={<Hut newHut={newHut}/>} />
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
