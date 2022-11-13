import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer,Rectangle } from 'react-leaflet'
import { Button, Modal } from "react-bootstrap";
import SelectMap from "./selectMap";
import { useState } from "react";
function AreaMap(props){
    const [areaBounds,setAreaBounds]=useState();
    return(
        <>
            <Modal show={true}>
                <Modal.Header>Select the desired area</Modal.Header>
                <Modal.Body>
                    <MapContainer whenReady={m=>m.target.locate({setView:true})} center={[0,0]} zoom={13} style={{ height: "100vh", minHeight: "100%" }} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <SelectMap setAreaBounds={setAreaBounds} areaBounds={areaBounds}/>
                        {areaBounds!==undefined?
                            <Rectangle bounds={areaBounds}/>
                            :
                            <></>
                        }
                    </MapContainer>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AreaMap;