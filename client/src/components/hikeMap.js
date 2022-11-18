import Hike from "../lib/hike";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, useMap, Marker,Popup } from 'react-leaflet'
import { useState } from "react";
import { Modal } from "react-bootstrap";
function HikeMap(props){
    const limeOptions = { color: 'red' }
    const [show,setShow]=useState(false);
    //console.log("Displaying map with hike",props.hike);
    return(
        <>
            {show?
                <Modal show={show} onHide={e=>setShow(false)}>
                <Modal.Header closeButton>Select the desired area</Modal.Header>
                <Modal.Body>
                <MapContainer bounds={props.hike.bounds} style={{ height: "50vh", minHeight: "100%" }} scrollWheelZoom={true}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Polyline pathOptions={limeOptions} positions={props.hike.coordinates} />
                        </MapContainer>
                </Modal.Body>
            </Modal>
            :
                    <div style={{ height: "175px" }} onDoubleClick={e=>{
                        e.preventDefault();
                        e.stopPropagation();
                        setShow(true);
                    }}>
                        <MapContainer bounds={props.hike.bounds} style={{ height: "100%", minHeight: "100%" }} scrollWheelZoom={false}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Polyline pathOptions={limeOptions} positions={props.hike.coordinates} />
                        </MapContainer>
                    </div>
            }
        </>
    )
}

export default HikeMap;