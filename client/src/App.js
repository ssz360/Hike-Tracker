import { useState } from 'react';
import './App.css';

function App() {
  const [logged,setLogged]=useState(false);

  return (
    <>
      <Routes>
        <Route path='/' element={<h1>Hike Tracker!</h1>} />
      </Routes>
    </>
  );
}

export default App;
