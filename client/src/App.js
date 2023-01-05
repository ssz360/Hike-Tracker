import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LocalGuide from './pages/localGuide';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HikesList, Hut, HomePage, Profile } from './pages';
import api from './lib/api';
import { Header, Login, SignUp, CheckEmail } from './components';
import { useEffect, useState } from 'react';

function App() {

  const [logged, setLogged] = useState(false);
  const [hikes, setHikes] = useState([]);
  const [huts, setHuts] = useState([]);
  const [ , setMessage] = useState('');
  const [user, setUser] = useState();
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const getHikesUseEff = async () => {
      try {
        const h = await api.getHikesList();
        setHikes([...h]);
        console.log(hikes);
        const usr = await api.isLogged();
        setUser(usr);
        setLogged(true);
      } catch (error) {
        if (error.status === 401) {
          setLogged(false);
          setUser();
          if (path !== "/login" && path !== "/signup" && path !== "/hikes") navigate('/');
        }
        else {
          setMessage(error);
          setLogged(false);
          setUser();
          if (path !== "/login" && path !== "/signup" && path !== "/hikes") navigate('/');
        }
      }
    }
    getHikesUseEff();
  }, [logged])

  useEffect(() => {
    if (logged && dirty) {
      api.getHutsListWithFilters(null, null, null, null, null, null)
        .then((hut) => {
          setHuts(hut);
          setDirty(false);
        })
        .catch(err => setMessage(err.error));
      api.isLogged().then((usr) => setUser(usr)).catch(err => setMessage(err))
    }
  }, [logged, dirty])

  const updateStartEndPoint = (initialHike, point, type) => {
    let hike = initialHike;
    if (type === "start") {
      hike.startPoint = point;
    }
    else if (type === "end") {
      hike.endPoint = point;
    }
    setHikes([...hikes.filter(h => h.id !== hike.id), hike]);
  }
  const refreshHikes = async () => {
    try {
      const h = await api.getHikesList();
      setHikes([...h]);
    } catch (error) {
      setHikes([]);
    }
  }
  async function filtering(area, lengthMin, lengthMax, dif, ascentMin, ascentMax, expectedTimeMin, expectedTimeMax) {

    try {
      const newList = await api.getHikesListWithFilters(lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, dif, area);
      const sumArr = [...hikes, ...newList.filter(h => !hikes.map(n => n.id).includes(h.id))];
      sumArr.forEach(h => {
        if (newList.map(n => n.id).includes(h.id)) h.show = true;
        else h.show = false;
      });
      setHikes([...sumArr]);
    } catch (error) {
      setHikes(-1);
      throw error;
    }
  }

  async function filteringHut(name, country, numberOfBedrooms) {
    try {
      console.log("IN FILTERING HUT WITH NAME", name, "coutnry", country, "num of beds", numberOfBedrooms);
      const newList = logged ? await api.getHutsListWithFilters(name, country, numberOfBedrooms, null) :
        console.log("Error! User not authorized");
      setHuts(newList);
    } catch (error) {
      setHuts(-1);
      throw error;
    }
  }

  async function newHut(name, description, country, numBeds, coord, phone, email, website, images) {
    try {
      //here call api.elevation with coordinate to get elevation
      await api.insertHut(name, description, country, numBeds, coord, phone, email, website, images);
    } catch (error) {
      throw error;
    }
  }

  const setAllHikesShow = async () => {
    const newHikes = [...hikes];
    newHikes.forEach(h => {
      h.show = true
    });
    setHikes([...newHikes]);
  }
  return (
    <>
      {path !== '/' && <Header logged={logged} setLogged={setLogged} user={user} setUser={setUser} setDirty={setDirty} />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='hikes' element={<HikesList user={user} logged={logged} hikes={hikes} setAllHikesShow={setAllHikesShow} filtering={filtering} />} />
        <Route path='/localGuide/*' element={<LocalGuide refreshHikes={refreshHikes} updateStartEndPoint={updateStartEndPoint} hikes={user !== undefined ? hikes.filter(h => h.author === user.username) : []} user={user} newHut={newHut} />}></Route>
        <Route path='/hut' element={<Hut huts={huts} setHuts={setHuts} filteringHut={filteringHut} user={user} />} />
        <Route path='/login' element={<Login setLogged={setLogged} setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setLogged={setLogged} />} />
        <Route path='/checkemail' element={<CheckEmail />} />
        <Route path='/profile/*' element={<Profile hikes={hikes} />} />
      </Routes>
    </>
  );
}

export default App;
