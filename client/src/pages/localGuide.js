import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import AddHikeForm from "../components/addHikeForm";
import Hut from "./Hut";
import ParkingLot from "./ParkingLot";


function LocalGuide(props){
    const [newHike,setNewHike]=useState(false);
    const [newHut,setNewHut]=useState(false);
    const [newParking,setNewParking]=useState(false);
    const [hutOpenArea,setHutOpenArea]=useState(false);
    const [hutName,setHutName]=useState('');
    const [hutCountry,setHutCountry]=useState('');
    const [hutNumBeds,setHutNumBeds]=useState('');
    const [hutNumGuests,setHutNumGuests]=useState('');
    const [hutCoords,setHutCoords]=useState();
    const [hikeName,setHikeName]=useState('');
    const [hikeDifficulty,setHikeDifficulty]=useState();
    const [hikeDesc,setHikeDesc]=useState('');
    const [hikeFile,setHikeFile]=useState();
    const [hikeFileName,setHikeFileName]=useState('');
    return(
    <>
        <div className="text-center mt-5 mx-auto justify-content-center" style={{width:"85%"}}>
            <Alert variant="primary">
                <Alert.Heading>Hey local guide, nice to see you</Alert.Heading>
                <h5>
                    Select what you want to do!
                </h5>
            </Alert>
        </div>
        <div className="mx-auto text-center my-3">
            {newHike?
            <>
                <Button variant="outline-info" size="lg" onClick={e=>{
                    e.preventDefault();
                    e.stopPropagation();
                    setNewHike(false);
                }}>
                Adding a new hike...
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-up" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
    <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
    </svg>
            </Button>
                <AddHikeForm name={hikeName} setName={setHikeName} difficulty={hikeDifficulty} setDifficulty={setHikeDifficulty} desc={hikeDesc} setDesc={setHikeDesc} file={hikeFile} setFile={setHikeFile} fileName={hikeFileName} setFileName={setHikeFileName}></AddHikeForm>
            </>
            :<Button variant="outline-primary" size="lg" onClick={e=>{
                e.preventDefault();
                e.stopPropagation();
                setNewHike(true);
            }}>
                Add a new hike
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-down" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
  <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
</svg>
            </Button>}
            {newHut?
            <>
                <Button variant="outline-info" className="mx-2" size="lg" onClick={e=>{
                    e.preventDefault();
                    e.stopPropagation();
                    setNewHut(false);
                }}>
                Adding a new hut...
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-up" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
    <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
    </svg>
            </Button>
                <Hut openArea={hutOpenArea} setOpenArea={setHutOpenArea} name={hutName} setName={setHutName} country={hutCountry} setCountry={setHutCountry} numBeds={hutNumBeds} setNumBeds={setHutNumBeds} numGuests={hutNumGuests} setNumGuests={setHutNumGuests} coords={hutCoords} setCoords={setHutCoords}></Hut>
            </>
            :<Button variant="outline-primary" className="mx-2" size="lg" onClick={e=>{
                e.preventDefault();
                e.stopPropagation();
                setNewHut(true);
            }}>
                Add a new hut
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-down" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
  <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
</svg>
            </Button>}
            {newParking?
            <>
                <Button variant="outline-info" className="mx-2" size="lg" onClick={e=>{
                    e.preventDefault();
                    e.stopPropagation();
                    setNewParking(false);
                }}>
                Adding a new parking lot...
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-up" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
    <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
    </svg>
            </Button>
                <ParkingLot></ParkingLot>
            </>
            :<Button variant="outline-primary" className="mx-2" size="lg" onClick={e=>{
                e.preventDefault();
                e.stopPropagation();
                setNewParking(true);
            }}>
                Add a new parking lot
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-down" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
  <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
</svg>
            </Button>}

        </div>
    </>)
}

export default LocalGuide;