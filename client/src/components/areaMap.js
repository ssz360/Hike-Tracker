import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer,Rectangle } from 'react-leaflet'
import { Button, Modal, ModalFooter } from "react-bootstrap";
import SelectMap from "./selectMap";
import { useState } from "react";
function AreaMap(props){
    return(
        <>
            <Modal show={props.openArea} onHide={e=>props.setOpenArea(false)}>
                <Modal.Header closeButton>Select the desired area</Modal.Header>
                <Modal.Body>
                    <MapContainer whenReady={m=>m.target.locate({setView:true})} center={[0,0]} zoom={13} style={{ height: "50vh", minHeight: "100%" }} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <SelectMap setAreaBounds={props.setArea} areaBounds={props.area}/>
                        {props.area!==undefined?
                            <Rectangle bounds={props.area}/>
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
                    }}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AreaMap;