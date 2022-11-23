import Hike from "../lib/hike";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, useMap, Marker,Popup } from 'react-leaflet'
import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import api from "../lib/api";
function HikeMap(props){
    const [bounds,setBounds]=useState([[0,0],[0.1,0.1]]);
    const [coordinates,setCoordinates]=useState([]);
    const [center,setCenter]=useState([0.05,0.05]);
    useEffect(()=>{
        const getMapDetails=async()=>{
            try {
                console.log("GETTIN MAP DATA FOR",props.hike.id)
                const mapdets=await api.getHikeMap(props.hike.id);
                setBounds(mapdets.bounds);
                setCoordinates(mapdets.coordinates);
                setCenter(mapdets.center);
            } catch (error) {
                setBounds([[0,0],[0.1,0.1]]);
                setCenter([0.05,0.05]);
                setCoordinates([]);
            }
        }
        getMapDetails();
    },[]);
    //console.log("IN HIKE MAP WITH HIKE",props.hike);
    const limeOptions = { color: 'red' }
    const [show,setShow]=useState(false);
    //console.log("Displaying map with hike",props.hike);
    return(
        <>
            {show?
                <Modal show={show} onHide={e=>setShow(false)}>
                <Modal.Header closeButton>This is the map for hike {props.hike.name}</Modal.Header>
                <Modal.Body>
                <MapContainer bounds={bounds} style={{ height: "60vh", width: "auto" }} scrollWheelZoom={true}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Polyline pathOptions={limeOptions} positions={coordinates} />
                        </MapContainer>
                </Modal.Body>
            </Modal>
            :
            <></>
            }
            <div onDoubleClick={e=>{
                e.preventDefault();
                e.stopPropagation();
                setShow(true);
            }}>
                {bounds[0][0]===0?
                    <Spinner animation="grow" />
                :
                    <MapContainer bounds={bounds} style={{ height: "30vh", width: "auto" }} scrollWheelZoom={false} doubleClickZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Polyline pathOptions={limeOptions} positions={coordinates} />
                    </MapContainer>
                }
            </div>
        </>
    )
}

export default HikeMap;