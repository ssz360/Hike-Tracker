import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, useMap, Marker,Popup } from 'react-leaflet'
import { Container, Row, Col, Card, Alert, Button, OverlayTrigger, Modal, Form ,Table} from 'react-bootstrap';
import { useEffect,useState } from 'react';
function HikeRow(props){
    const limeOptions = { color: 'red' }
    const [map,setMap] = useState(false);
    const showModal= e=>{
        e.preventDefault();
        e.stopPropagation();
        setMap(true);
    }
    return(
    <>
        <tr>
            <td>{props.hike.name}</td>
            <td>{props.hike.len}</td>
            <td>{props.hike.expectedTime}</td>
            <td>{props.hike.ascent}</td>
            <td>{props.hike.difficulty}</td>
            <td>{props.hike.startPoint}</td>
            <td>{props.hike.endPoint}</td>
            <td>{props.hike.referencePoints}</td>
            <td>{props.hike.description}</td>
            <td>
                <Button variant='outline-info' onClick={e=>showModal(e)}>See the map</Button>
            </td>
        </tr>
        <Modal
            show={map}
            onHide={()=>setMap(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Map for hike {props.hike.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <MapContainer center={props.hike.center} bounds={[
  [Math.max(...props.hike.coordinates.map(c=>c[0])), Math.max(...props.hike.coordinates.map(c=>c[1]))],
  [Math.min(...props.hike.coordinates.map(c=>c[0])), Math.min(...props.hike.coordinates.map(c=>c[1]))],
]} style={{ height: '50vh'}} scrollWheelZoom={true}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Polyline pathOptions={limeOptions} positions={props.hike.coordinates} />
                </MapContainer>
            </Modal.Body>
        </Modal>
    </>
    )
}

export default HikeRow;