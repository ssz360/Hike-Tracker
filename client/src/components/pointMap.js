import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer,Marker, useMap } from 'react-leaflet'
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

function GetPoint(props){
    const map=useMap();
    map.on("click",e=>{
        props.setCoors([e.latlng.lat,e.latlng.lng]);
    })
    return <></>
}
function PointMap(props){
    return(
        <>
            <Modal show={props.openArea} onHide={e=>props.setOpenArea(false)}>
                <Modal.Header closeButton>Select the desired area</Modal.Header>
                <Modal.Body>
                    <MapContainer whenReady={m=>m.target.locate({setView:true})} center={[0,0]} zoom={13} style={{ height: "50vh", minHeight: "100%" }} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <GetPoint setCoors={props.setCoord}/>
                        {props.coord!==undefined?
                            <Marker position={props.coord}/>
                            :
                            <></>
                        }
                    </MapContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-success" onClick={e=>{
                        e.preventDefault();
                        e.stopPropagation();
                        props.setOpenArea(false);
                        props.setCoord(props.coord);
                    }}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PointMap;