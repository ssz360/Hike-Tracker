import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LocalGuide from './pages/localGuide';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { ParkingLot,HikesList,Hut} from './pages';
import api from './lib/api';
import { Header, Login, SignUp,CheckEmail } from './components';
import { useEffect, useState } from 'react';
function App() {
  /*let vett = [{name: "Hut1", country: "Italy", numOfGuests: 10, numOfBedrooms: 3}, 
    {name: "Hut2", country: "Italy", numOfGuests: 30, numOfBedrooms: 7},
    {name: "Hut3", country: "Italy", numOfGuests: 25, numOfBedrooms: 5}];*/
  const [logged,setLogged]=useState(false);
  const [hikes, setHikes] = useState([]);
  const [huts, setHuts] = useState([]);
  const [message, setMessage] = useState('');
  const [user,setUser]=useState();
  const location=useLocation();
  const path=location.pathname;
  const navigate=useNavigate();
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const getHikesUseEff=async ()=>{
      try {
        //console.log("IN APP")
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
          setUser();
          if(path!=="/login" && path!=="/signup") navigate('/');
        }
        else{
          setMessage(error);
          setLogged(false);
          setUser();
          if(path!=="/login" && path!=="/signup") navigate('/');
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
}, [logged])

useEffect(() => {
  if (logged && dirty) {
  api.getHutsListWithFilters(null, null, null, null, null, null)
    .then((hut) => {
      setHuts(hut); 
      setDirty(false);})
    .catch(err => setMessage(err.error))
  }
}, [logged, dirty])

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
      //console.log("Now sumarr",sumArr);
      setHikes([...sumArr]);
    } catch (error) {
      setHikes(-1);
      throw error;
    }
  }

  async function filteringHut(name, country, numberOfGuests, numberOfBedrooms){
    try {
      const newList=logged?await api.getHutsListWithFilters(name, country, numberOfGuests, numberOfBedrooms, null, null): 
        console.log("Error! User not authorized");
      setHuts(newList);
    } catch (error) {
      setHuts(-1);
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
  const setAllHikesShow=async()=>{
    const newHikes=[...hikes];
    newHikes.forEach(h=>{
      h.show=true
    });
    setHikes([...newHikes]);
  }
  return (
    <>
      <Header logged={logged} setLogged={setLogged} user={user} setUser={setUser} setDirty={setDirty}/>
      <Container>
        <Row>
          <Col>
            <Routes>
              <Route path='/' element={<HikesList logged={logged} hikes={hikes.filter(h=>h.show)} setAllHikesShow={setAllHikesShow} filtering={filtering}/>} />
              <Route path='/parking' element={<ParkingLot/>} />
              <Route path='/localGuide/*' element={<LocalGuide hikes={user!==undefined?hikes.filter(h=>h.author===user.username):[]} user={user} newHut={newHut}/>}></Route>
              <Route path='/hut' element={<Hut huts={huts} filteringHut={filteringHut}/>} />
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
