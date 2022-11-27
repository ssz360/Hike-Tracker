import Hike from "../lib/hike";
import 'leaflet/dist/leaflet.css';
import {divIcon} from 'leaflet';
import { MapContainer,TileLayer, Polyline, Marker, useMap, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { Spinner } from "react-bootstrap";
import iconsvg from "../lib/iconspoint";
import getMarkerForPoint from "../lib/markerPoint";


function BoundsMovement(props){
    const map=useMap();
    map.on('moveend', e =>{
        console.log("Bounds have changed into ",map.getBounds());
        const b=map.getBounds();
        if(props.bounds[0][0]!==0)    props.setBounds([[b._northEast.lat,b._northEast.lng],[b._southWest.lat,b._southWest.lng]]);
     });
    return <></>
}


function HikeMapLink(props){
    console.log("RENDERING LINK FOR HIKE",props.hike);
    const [coordinates,setCoordinates]=useState([]);
    const [center,setCenter]=useState([0.05,0.05]);
    useEffect(()=>{
        const getMapDetails=async()=>{
            try {
                console.log("GETTIN MAP DATA FOR",props.hike.id)
                const mapdets=await api.getHikeMap(props.hike.id);
                props.setBounds(mapdets.bounds);
                setCoordinates(mapdets.coordinates);
                setCenter(mapdets.center);
            } catch (error) {
                props.setBounds([[0,0],[0.1,0.1]]);
                setCenter([0.05,0.05]);
                setCoordinates([]);
            }
        }
        getMapDetails();
    },[]);
    const pathopts = { color: 'black',weigth:5 }
    return(
        <>
            {props.bounds[0][0]===0?
                    <Spinner animation="grow" />
                :
            <MapContainer bounds={props.bounds} style={{width:"auto",height:"70vh"}} scrollWheelZoom={true}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Polyline pathOptions={pathopts} positions={coordinates} />
                <BoundsMovement setBounds={props.setBounds} bounds={props.bounds}/>
                {props.points.map(p=>getMarkerForPoint(p,p.id===props.hike.startPoint.id,p.id===props.hike.endPoint.id,props.selectedPoint===p.id,true,props.selectedPoint,props.setSelectedPoint))}
                {props.hike.startPoint!==undefined?getMarkerForPoint(props.hike.startPoint,true,false,props.selectedPoint===props.hike.startPoint.id,true,props.selectedPoint,props.setSelectedPoint):<></>}
                {props.hike.endPoint!==undefined?getMarkerForPoint(props.hike.endPoint,false,true,props.selectedPoint===props.hike.endPoint.id,true,props.selectedPoint,props.setSelectedPoint):<></>}
            </MapContainer>
            }
        </>
    )



}

export default HikeMapLink;