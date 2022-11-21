import Hike from "../lib/hike";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer,TileLayer, Polyline, Marker } from "react-leaflet";

function HikeMapLink(props){

    const limeOptions = { color: 'red' }
    const onClickPoint = (e,id)=>{
        //e.preventDefault();
        //e.stopPropagation();
        console.log("clicked point",id,"e",e);
        props.setSelected(id);
    }
    const getMarkerForPoint= (point,start,end,selected) =>{
        let urlImg="/";
        if(selected) urlImg+="selectedPoint";
        else{
            urlImg+=point.type;
            if(start)   urlImg+="Start";
            else if(end)    urlImg+="End";
        }
        urlImg+=".png";
        console.log("url for point ",point.id,"is ",urlImg,"coordinates",point.coordinates);
        /*const iconMarkup = renderToStaticMarkup(<i className=" fa fa-map-marker-alt fa-3x" />);
        const customMarkerIcon = divIcon({
            html: iconMarkup,
        });
        return <Marker key={point.id} onClick={e=>onClickPoint(e,point.id)} icon={customMarkerIcon} position={point.coordinates} />*/
        const icon=new L.Icon({
            iconUrl : urlImg,
            iconSize: 40
        })
        return <Marker key={point.id} eventHandlers={{
            click: () => {
                console.log("clicked point",point.id);
                props.setSelectedPoint(point.id);
            }
        ,}} icon={icon} position={point.coordinates} />
    }
    //{props.hike.referencePoints.filter(p=>p.id!==props.hike.startPoint.id && p.id!==props.hike.endPoint.id).map(p=>getMarkerForPoint(p,false,false,props.selectedPoint===p.id))}
    return(
        <>
            <MapContainer bounds={props.hike.bounds} style={{width:"100%",height:"70vh"}} scrollWheelZoom={true}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Polyline pathOptions={limeOptions} positions={props.hike.coordinates} />
                {getMarkerForPoint(props.hike.startPoint,true,false,props.selectedPoint===props.hike.startPoint.id)}
                {getMarkerForPoint(props.hike.endPoint,false,true,props.selectedPoint===props.hike.endPoint.id)}
                {props.pointsInBounds.filter(p=>p.id!==props.hike.startPoint.id && p.id!==props.hike.endPoint.id).map(p=>getMarkerForPoint(p,false,false,props.selectedPoint===p.id))}
            </MapContainer>
        </>
    )



}

export default HikeMapLink;