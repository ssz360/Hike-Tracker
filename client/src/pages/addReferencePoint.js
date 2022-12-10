import { Popup, Tooltip, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { divIcon } from "leaflet";
import { MapContainer, TileLayer,Marker, Polyline } from 'react-leaflet'
import { Button, Card, Col, Collapse, Container, Figure, Form, FormGroup, Image, Row, Spinner, Stack } from "react-bootstrap";
import { useState,useEffect } from "react";
import icons from "../lib/iconspoint";
import api from '../lib/api';
import getColor from '../lib/hikeColor';
import Gallery from "../components/gallery";
import { getDistance } from "geolib";
import ServerReply from "../components/serverReply";
import getMarkerForPoint from "../lib/markerPoint";
import globalVariables from "../lib/globalVariables"

function AddReferencePointMap(props){
    const [bounds,setBounds]=useState([[0,0],[0.1,0.1]]);
    const [coordinates,setCoordinates]=useState([]);
    const [center,setCenter]=useState([0.05,0.05]);
    useEffect(()=>{
        const getMapDetails=async()=>{
            try {
                //console.log("GETTIN MAP DATA FOR",props.hike.id)
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
    const customMarkerIcon = divIcon({
        html: icons.iconsvg['selectedPoint'],
        iconSize: [30,30],
        className:"map-point"
    });
    const [hover,setHover]=useState(false);
    const getStringPoint=()=>{
        if(props.pointCoord===undefined) return "";
        else return props.pointCoord[0]+","+props.pointCoord[1];
    }
    return(
        <>
            {bounds[0][0]===0?
                <Spinner animation="grow"/>
                :<MapContainer bounds={bounds} style={{ height: "60vh", width: "auto" }} scrollWheelZoom={true}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={globalVariables.mapTiles}/>
                    {props.pointCoord!==undefined?
                        <Marker icon={customMarkerIcon} eventHandlers={{
                            click: e => props.setPointCoord()
                            }} position={props.pointCoord}>
                            <Tooltip>This point has lat {props.pointCoord[0]} and longitude {props.pointCoord[1]}</Tooltip>
                        </Marker>
                        :
                        <></>
                    }
                    <Polyline eventHandlers={{
                        click: e => {
                            console.log("clicked point",e.latlng);
                            let closer=null;
                            let closerDist=-1;
                            for(const k of coordinates){
                                let dist=getDistance({latitude:k[0],longitude:k[1]},{latitude:e.latlng.lat,longitude:e.latlng.lng});
                                if (closer==null || closerDist<0 || dist<closerDist){
                                    closer=[k[0],k[1]];
                                    closerDist=dist;
                                }
                                props.setPointCoord(closer);
                            }
                        },
                        mouseover: e =>{
                            setHover(true);
                        },
                        mouseout: e =>{
                            setHover(false);
                        }
                    ,}} pathOptions={hover?{ color: "red",weight:7 }:{ color: "black",weight:5 }} positions={coordinates} />
                    {[...props.hike.referencePoints,...props.hike.huts].filter(p=>p.id!==props.hike.startPoint.id && p.id!==props.hike.endPoint.id && (p.coordinates[0]+","+p.coordinates[1])!==getStringPoint()).map(p=>getMarkerForPoint(p,p.id===props.hike.startPoint.id,p.id===props.hike.endPoint.id,props.selectedPoint===p.id,p.typeOfPoint==="referencePoint" && props.pointCoord===undefined,props.selectedPoint,props.setSelectedPoint))}
                    {getMarkerForPoint(props.hike.startPoint,true,props.hike.startPoint.id===props.hike.endPoint.id,props.selectedPoint===props.hike.startPoint.id,false,props.selectedPoint,props.setSelectedPoint)}
                    {props.hike.startPoint.id!==props.hike.endPoint.id?getMarkerForPoint(props.hike.endPoint,false,true,props.selectedPoint===props.hike.endPoint.id,false,props.selectedPoint,props.setSelectedPoint):<></>}
                </MapContainer>
            }
            <Stack direction="horizontal" gap={3}>
                <Button className="my-3" disabled={props.pointCoord===undefined} variant="outline-danger" onClick={e=>{
                e.preventDefault();
                e.stopPropagation();
                props.setPointCoord();
                }}>Clear</Button>
                <strong>{props.pointCoord===undefined && props.selectedPoint===(-1)?"Select a reference point or click on the track":props.selectedPoint===(-1)?"Hover on the marker to see the coordinates of the selected point":""}</strong>
                <strong>{props.pointCoord===undefined || props.selectedPoint===(-1)?"Click on the selected point to close its description":""}</strong>
            </Stack>
        </>
    )
}

function ReferencePoint(props){
    console.log("IN REFERENCE POINT WITH",props.point)
    useEffect(()=>{
        const getImages=async()=>{
            try {
                props.setWaiting(true);
                //console.log("GETTING IMAGES");
                const imgs=await api.getImagesPoint(props.point.id);
                //console.log("GOT IMGS",imgs);
                props.setWaiting(false);
                props.setImagesUrls([...imgs]);
            } catch (error) {
                props.setWaiting(false);
                props.setImagesUrls([]);
            }
        }
        getImages();
    },[props.point])
    return(
        <Col xs={12} md={5}>
            <div className="my-3 text-center">
                {icons.iconsvgelement[props.point.typeOfPoint]}
            </div>
            <div className="my-3 text-center">
                <strong>{props.point.name}</strong>
            </div>
            {props.waiting?
                <div className="my-3 text-center">
                    <Spinner animation="grow"/>
                </div>
                :
                <Gallery preview={false} addImage={false} imagesUrls={props.imagesUrls}/>
            }
        </Col>
    )
}

function AddNewReferencePoint(props){
    return(
        <Col xs={12} md={5}>
            <Form>
                <Form.Group className="mx-5 my-2">
                    <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Reference point name</Form.Label>
                    <Form.Control className="mx-auto text-center" style={{width:"50%"}} type="text" value={props.name} onChange={e=>{props.setName(e.target.value);props.setOpenDescription(e.target.value!=="");}}/>
                    <Collapse in={props.openDescription}>
                        <div>
                            <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Reference point description</Form.Label>
                            <Form.Control className="mx-auto text-center" style={{width:"50%"}} as="textarea" value={props.description} onChange={e=>{props.setDescription(e.target.value);props.setOpenImages(e.target.value!=="");}}/>
                            <Collapse in={props.openImages}>
                                <div>
                                    <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Reference point pictures</Form.Label>
                                    <Gallery addImage={true} preview={true} images={props.images} setImages={props.setImages} imagesUrls={props.imagesUrls} setImagesUrls={props.setImagesUrls}/>
                                    <Form.Group className="mx-5 my-5">
                                        <div className="mx-auto text-center my-3">
                                            <Button variant="outline-success" onClick={e=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                props.submitHandler();
                                            }}><strong>Submit</strong></Button>
                                            <Button variant="outline-warning" className="mx-3" onClick={e=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                props.setName('');
                                                props.setDescription('');
                                                props.setImages([]);
                                                props.imagesUrls.forEach(img=>URL.revokeObjectURL(img.url))
                                                props.setImagesUrls([]);
                                                props.setOpenDescription(false);
                                                props.setOpenImages(false);
                                            }}><strong>Cancel</strong></Button>
                                        </div>
                                    </Form.Group>
                                </div>
                            </Collapse>
                        </div>
                    </Collapse>
                </Form.Group>
                <ServerReply waiting={props.waiting} error={props.error} success={props.success} errorMessage={"Error while uploading new reference point"} successMessage={"Uploaded new reference point correctly!"}/>
            </Form>
        </Col>
    )
}


function AddReferencePoint(props){
    const [pointCoord,setPointCoord]=useState();
    const [images,setImages]=useState([]);
    const [imagesUrls,setImagesUrls]=useState([]);
    const [selectedPoint,setSelectedPoint]=useState(-1);

    // data
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [openDescription,setOpenDescription]=useState(false);
    const [openImages,setOpenImages]=useState(false);
    const [waiting,setWaiting]=useState(false);
    const [error,setError]=useState();
    const [success,setSuccess]=useState(false);
    const submitHandler=async ()=>{
        try {
            setWaiting(true);
            await api.addReferencePoint(props.hike.id,name,pointCoord,description,images);
            setWaiting(false);
            setError();
            setSuccess(true);
            setTimeout(()=>{
                setSuccess(false);
                setName('');
                setDescription('');
                setImages([]);
                imagesUrls.forEach(img=>URL.revokeObjectURL(img.url))
                setImagesUrls([]);
                setOpenDescription(false);
                setOpenImages(false);
            },3000);
            props.refreshHikes();
        } catch (error) {
            setWaiting(false);
            setError(error);
            setSuccess(false);
            setTimeout(()=>setError(),3000);
        }
    }
    useEffect(()=>{
        if(pointCoord!==undefined) setSelectedPoint(-1);
        setName('');
        setDescription('');
        setImages([]);
        imagesUrls.forEach(img=>URL.revokeObjectURL(img.url))
        setImagesUrls([]);
        setOpenDescription(false);
        setOpenImages(false);
    },[pointCoord,selectedPoint])
    return(
        <Container className="my-5">
            <Row>
        {pointCoord===undefined && selectedPoint===(-1)?
            <Col xs={12}>
                <AddReferencePointMap selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} className="my-5" hike={props.hike} pointCoord={pointCoord} setPointCoord={setPointCoord}/>
            </Col>
            :
            selectedPoint===(-1)?
                <>
                    <Col xs={12} md={7}>
                        <AddReferencePointMap selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} hike={props.hike} pointCoord={pointCoord} setPointCoord={setPointCoord}/>
                    </Col>
                    <AddNewReferencePoint waiting={waiting} setWaiting={setWaiting} error={error} setError={setError} success={success} setSuccess={setSuccess}
                    name={name} setName={setName} description={description} setDescription={setDescription} openDescription={openDescription} setOpenDescription={setOpenDescription}
                    openImages={openImages} setOpenImages={setOpenImages} submitHandler={submitHandler} images={images} setImages={setImages}
                    imagesUrls={imagesUrls} setImagesUrls={setImagesUrls}/>
                </>
                :
                <>
                    <Col xs={12} md={7}>
                        <AddReferencePointMap selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} hike={props.hike} pointCoord={pointCoord} setPointCoord={setPointCoord}/>
                    </Col>
                    <ReferencePoint waiting={waiting} setWaiting={setWaiting} imagesUrls={imagesUrls} setImagesUrls={setImagesUrls} point={props.hike.referencePoints.find(p=>p.id===selectedPoint)}/>
                </>
        }
        </Row>
            </Container>
    )
}

export default AddReferencePoint;