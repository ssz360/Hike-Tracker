import Hike from "../lib/hike";
import 'leaflet/dist/leaflet.css';
import {divIcon} from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer,TileLayer, Polyline, Marker, useMap, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { Spinner } from "react-bootstrap";


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
    const iconsvg={
        "selectedPoint":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="red" class="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>',
        "Hut":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="red" class="bi bi-houses-fill" viewBox="0 0 16 16"><path d="M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.51 2.51 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354L7.207 1Z"/><path d="M8.793 2a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708L8.793 2Z"/></svg>',
        "HutStart":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="purple" class="bi bi-houses-fill" viewBox="0 0 16 16"><path d="M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.51 2.51 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354L7.207 1Z"/><path d="M8.793 2a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708L8.793 2Z"/></svg>',
        "HutEnd":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="green" class="bi bi-houses-fill" viewBox="0 0 16 16"><path d="M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.51 2.51 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354L7.207 1Z"/><path d="M8.793 2a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708L8.793 2Z"/></svg>',
        "Parking":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" class="bi bi-p-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM5.5 4.002V12h1.283V9.164h1.668C10.033 9.164 11 8.08 11 6.586c0-1.482-.955-2.584-2.538-2.584H5.5Zm2.77 4.072c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z"/></svg>',
        "ParkingStart":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="purple" class="bi bi-p-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM5.5 4.002V12h1.283V9.164h1.668C10.033 9.164 11 8.08 11 6.586c0-1.482-.955-2.584-2.538-2.584H5.5Zm2.77 4.072c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z"/></svg>',
        "ParkingEnd":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="green" class="bi bi-p-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM5.5 4.002V12h1.283V9.164h1.668C10.033 9.164 11 8.08 11 6.586c0-1.482-.955-2.584-2.538-2.584H5.5Zm2.77 4.072c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z"/></svg>',
        "hikePoint":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" class="bi bi-geo-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/></svg>',
        "hikePointStart":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="purple" class="bi bi-geo-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/></svg>',
        "hikePointEnd":'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="green" class="bi bi-geo-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/></svg>'
    }
    const pathopts = { color: 'black',weigth:5 }
    const onClickPoint = (e,id)=>{
        //e.preventDefault();
        //e.stopPropagation();
        console.log("clicked point",id,"e",e);
        props.setSelected(id);
    }
    const getMarkerForPoint= (point,start,end,selected) =>{
        let imgtype="";
        if(selected) imgtype+="selectedPoint";
        else{
            imgtype+=point.typeOfPoint;
            if(start)   imgtype+="Start";
            else if(end)    imgtype+="End";
        }
        console.log("url for point ",point.id,"is ",imgtype,"coordinates",point.coordinates);
        //const iconMarkup = renderToStaticMarkup(iconsvg[imgtype]);
        const customMarkerIcon = divIcon({
            html: iconsvg[imgtype],
            iconSize: [30,30],
            className:"map-point"
        });
        return <Marker key={point.id} eventHandlers={{
            click: () => {
                console.log("clicked point",point.id,"props",props);
                if(props.selectedPoint!==point.id)    props.setSelectedPoint(point.id);
                else props.setSelectedPoint(-1);
            }
        ,}} icon={customMarkerIcon} position={point.coordinates} />
        /*const icon=new L.Icon({
            iconUrl : urlImg,
            iconSize: 40
        })
        return <Marker key={point.id} eventHandlers={{
            click: () => {
                console.log("clicked point",point.id);
                props.setSelectedPoint(point.id);
            }
        ,}} icon={icon} position={point.coordinates} />*/
    }
    //{props.hike.referencePoints.filter(p=>p.id!==props.hike.startPoint.id && p.id!==props.hike.endPoint.id).map(p=>getMarkerForPoint(p,false,false,props.selectedPoint===p.id))}
    return(
        <>
            {props.bounds[0][0]===0?
                    <Spinner animation="grow" />
                :
            <MapContainer bounds={props.bounds} style={{width:"auto",height:"70vh"}} scrollWheelZoom={true}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Polyline pathOptions={pathopts} positions={coordinates} />
                <BoundsMovement setBounds={props.setBounds} bounds={props.bounds}/>
                {props.points.map(p=>getMarkerForPoint(p,p.id===props.hike.startPoint.id,p.id===props.hike.endPoint.id,props.selectedPoint===p.id))}
                {props.hike.startPoint!==undefined?getMarkerForPoint(props.hike.startPoint,true,false,props.selectedPoint===props.hike.startPoint.id):<></>}
                {props.hike.endPoint!==undefined?getMarkerForPoint(props.hike.endPoint,false,true,props.selectedPoint===props.hike.endPoint.id):<></>}
            </MapContainer>
            }
        </>
    )



}

export default HikeMapLink;