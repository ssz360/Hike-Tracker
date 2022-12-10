import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, useMap,useMapEvents , Marker,Popup,Tooltip } from 'react-leaflet'
import { Container, Row, Col, Card, Alert, Button, OverlayTrigger, Modal, Form ,Table, Popover} from 'react-bootstrap';
import { useEffect,useState } from 'react';
import Hike from '../lib/hike';
import globalVariables from "../lib/globalVariables";

function GlobalMap(props){
    const [hikes,setHikes]=useState([]);
    const limeOptions = { color: 'red' }
    useEffect(()=>{
        const getTracks=async()=>{
            const res=await fetch('http://localhost:3001/api/hikes');
            const ret=await res.json();
            if(res.ok){
                const arr=[];ret.forEach(h=>arr.push(new Hike(h.id,h.name,h.length,h.ascent,h.difficulty,h.expectedTime,h.startPoint,h.endPoint,h.referencePoints,h.description,h.coordinates,h.center)));
                setHikes(arr);
            }
            else throw res.status;
        }
        getTracks();
    },[]);
    return(
        <>
            <Container>
                <Row>
                    <Col>
                        <MapContainer center={[ 44.601004142314196, 7.139863958582282 ]} zoom={10} style={{ height: '50vh', width: '200wh' }} scrollWheelZoom={true}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={globalVariables.mapTiles}/>
                            { hikes.map(h=>
                                <Polyline key={h.id} pathOptions={limeOptions} positions={h.coordinates}>
                                    <Popup>Hike {h.name}</Popup>
                                </Polyline>)}
                        </MapContainer>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default GlobalMap;