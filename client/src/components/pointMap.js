import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer,Marker, useMap, Polyline } from 'react-leaflet'
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import api from '../lib/api';
import globalVariables from "../lib/globalVariables";

function GetPointAndNewHikes(props){
    const map=useMap();
    map.on("click",e=>{
        props.setCoors([e.latlng.lat,e.latlng.lng]);
    });
    map.on('moveend', async event=> {   
        const bounds = event.target.getBounds();
        try {
            const newHikes=await api.getHikesInBounds([[bounds._northEast.lat,bounds._northEast.lng],[bounds._southWest.lat,bounds._southWest.lng]]);
            //console.log("NEWHIKES!",newHikes);
            props.setHikes([...newHikes]);
        } catch (error) {
            props.setHikes([]);
        }
    });
    return <></>
}
function PointMap(props){

    const myIcon = new L.Icon({
        iconUrl: "/images/marker.webp",
        iconRetinaUrl: "/images/marker.webp",
        popupAnchor:  [-0, -0],
        iconSize: [32,32],     
    });
    const opts = { color: 'red' }
    const [hikes,setHikes]=useState([]);
    //console.log("Rerendering with",hikes);
    return(
        <>
            <Modal show={props.openArea} onHide={e=>props.setOpenArea(false)}>
                <Modal.Header closeButton>Select the desired area</Modal.Header>
                <Modal.Body>
                    <MapContainer whenReady={m=>m.target.locate({setView:true})} center={[0,0]} zoom={13} style={{ height: "50vh", minHeight: "100%" }} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={globalVariables.mapTiles}/>
                        <GetPointAndNewHikes setCoors={props.setCoord} setHikes={setHikes}/>
                        {props.coord!==undefined?
                            <Marker icon={myIcon} position={props.coord}/>
                            :
                            <></>
                        }
                        {
                            hikes.map(h=><Polyline key={h.id} pathOptions={opts} positions={h.coordinates} />)
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