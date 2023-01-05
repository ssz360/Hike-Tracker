import { Route, Routes } from "react-router-dom";
import AddHikeForm from "../components/addHikeForm";
import LocalGuideHikes from "./localGuideHikes";
import ParkingLot from "./parkingLot";
import LocalGuideHikeUpdate from './localGuideHikeUpdate';
import AddHutForm from "./addHutForm";
import { AddParkingLot } from "../components";

function LocalGuide(props){
    return(
        <Routes>
            <Route path="/hikes" element={<LocalGuideHikes hikes={props.hikes} user={props.user}/>}/>
            <Route path="/hikes/:hikeid/*" element={<LocalGuideHikeUpdate hikes={props.hikes} refreshHikes={props.refreshHikes} updateStartEndPoint={props.updateStartEndPoint}/>}/>
            <Route path="/newHike" element={<AddHikeForm refreshHikes={props.refreshHikes}/>}/>
            <Route path="/newHut" element={<AddHutForm newHut={props.newHut}/>}/>
            <Route path="/newParking" element={<AddParkingLot/>}/>
            <Route path="/parking" element={<ParkingLot/>}/>
        </Routes>
    )
}

export default LocalGuide;