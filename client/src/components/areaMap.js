import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap,useMapEvents,Circle } from 'react-leaflet'
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { getDistance } from 'geolib';
import globalVariables from "../lib/globalVariables";

const KMFROLAT=110574;

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

function CenterMapDrag(props){
    const [edit,setEdit]=useState(false);
    const [control,setControl]=useState(false);
    const map=useMap();
    if(edit)    map.dragging.disable();
    else    map.dragging.enable();
    const [selecting,setSelecting]=useState(false);
    const mapev=useMapEvents({
        mousedown: e =>{
            if(edit && !control){
                if(props.center!==undefined && !selecting){
                    props.setRadius(0);
                    props.setCenter(e.latlng);
                    setSelecting(true);
                }
                else if(props.center===undefined && !selecting){
                    props.setCenter(e.latlng);
                    setSelecting(true);
                }
            }
        },
        mousemove: e =>{
            if(edit && props.center!==undefined && selecting){
                props.setRadius(Math.abs(e.latlng.lat-props.center.lat)*KMFROLAT);
            }
        },
        mouseup: e=>{
            if(edit) setSelecting(false);
        },
        mouseout: e=>{
            if(edit) setSelecting(false);
        }
    });
    return (<>
        <div className={POSITION_CLASSES.topleft}>
            <div className="leaflet-control">
                {edit?
                    selecting? <Button variant="outline-info" disabled ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-move" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
                  </svg></Button>
                    : <Button variant="outline-info" onMouseEnter={e=>{e.preventDefault();e.stopPropagation();setControl(true);}} onMouseLeave={e=>{e.preventDefault();e.stopPropagation();setControl(false);}} onClick={e=>{e.preventDefault();e.stopPropagation();setEdit(false)}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-move" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
                  </svg></Button>
                :
                    selecting? <Button variant="outline-danger" disabled onClick={()=>setEdit(true)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
                  </svg></Button>
                    : <Button variant="outline-danger" onClick={()=>setEdit(true)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
                  </svg></Button>
                }
                {props.center!==undefined?
                  <Button className="mx-2" variant="outline-danger" onMouseEnter={e=>{e.preventDefault();e.stopPropagation();setControl(true);}} onMouseLeave={e=>{e.preventDefault();e.stopPropagation();setControl(false);}}onClick={e=>{props.setCenter(undefined);props.setRadius(0);props.setRadiusMap(0)}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg></Button>
                :
                  <></>
                }
            </div>
        </div>
    </>)
}


function CenterMapClick(props){
    const [edit,setEdit]=useState(false);
    const [control,setControl]=useState(false);
    const map=useMap();
    if(edit)    map.dragging.disable();
    else    map.dragging.enable();
    const [selecting,setSelecting]=useState(false);
    const mapev=useMapEvents({
        mousedown: e =>{
            if(edit && !control){
                if(props.center!==undefined && !selecting){
                    props.setRadius(0);
                    props.setCenter(e.latlng);
                }
                else if(props.center===undefined && !selecting){
                    props.setCenter(e.latlng);
                }
                else if(selecting){
                    setSelecting(false);
                    setEdit(false);
                }
            }
        },
        mousemove: e =>{
            if(edit && props.center!==undefined && selecting){
                props.setRadius(getDistance({latitude:e.latlng.lat,longitude:e.latlng.lng},{latitude:props.center.lat,longitude:props.center.lng}));
            }
        },
        mouseup: e=>{
            if(edit && !selecting) setSelecting(true);
        },
        mouseout: e=>{
            if(edit && selecting){
                setSelecting(false);
                setEdit(false);
            }
        }
    });
    return (<>
        <div className={POSITION_CLASSES.topright}>
            <div className="leaflet-control">
                {edit?
                    selecting? <Button variant="outline-info" disabled ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-move" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
                  </svg></Button>
                    : <Button variant="outline-info" onMouseEnter={e=>{e.preventDefault();e.stopPropagation();setControl(true);}} onMouseLeave={e=>{e.preventDefault();e.stopPropagation();setControl(false);}} onClick={e=>{e.preventDefault();e.stopPropagation();setEdit(false)}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-move" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
                  </svg></Button>
                :
                    selecting? <Button variant="outline-danger" disabled onClick={()=>setEdit(true)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
                  </svg></Button>
                    : <Button variant="outline-danger" onClick={()=>setEdit(true)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
                  </svg></Button>
                }
                {props.center!==undefined?
                  <Button className="mx-2" variant="outline-danger" onMouseEnter={e=>{e.preventDefault();e.stopPropagation();setControl(true);}} onMouseLeave={e=>{e.preventDefault();e.stopPropagation();setControl(false);}} onClick={e=>{props.setCenter(undefined);props.setRadius(0);props.setRadiusMap(0)}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg></Button>
                :
                  <></>
                }
          </div>
        </div>
    </>)
}

function AreaMap(props){
    return(
        <>
            <Modal show={props.openArea} onHide={e=>props.setOpenArea(false)}>
                <Modal.Header closeButton>Select the desired area</Modal.Header>
                <Modal.Body>
                    <MapContainer whenReady={m=>props.center===undefined?m.target.locate({setView:true}):m} center={props.center!==undefined?props.center:[0,0]} zoom={13} style={{ height: "50vh", width:"auto" }} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={globalVariables.mapTiles}/>
                        {props.drag?
                            <CenterMapDrag center={props.center} radius={props.radius} setCenter={props.setCenter} setRadius={props.setRadius} />
                        :
                            <CenterMapClick center={props.center} radius={props.radius} setCenter={props.setCenter} setRadius={props.setRadius}/>
                        }
                        {props.center!==undefined?
                            <Circle center={props.center} setCenter={props.setCenter} radius={props.radius} setRadius={props.setRadius}/>
                            :
                            <></>
                        }
                    </MapContainer>
                </Modal.Body>
                <Modal.Footer>
                    <div className='text-left'>To select an area click a point and move around until you are out of the map or you click again!</div>
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