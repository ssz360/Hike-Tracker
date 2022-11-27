import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import icons from "./iconspoint";

const getMarkerForPoint= (point,start,end,selected,selectable,selectedPoint,setSelectedPoint) =>{
    let imgtype="";
    if(selected) imgtype+="selectedPoint";
    else{
        imgtype+=point.typeOfPoint;
        if(start)   imgtype+="Start";
        else if(end)    imgtype+="End";
    }
    const customMarkerIcon = divIcon({
        html: icons.iconsvg[imgtype],
        iconSize: [30,30],
        className:""
    });
    return <Marker key={point.id} eventHandlers={{
        click: () => {
            console.log("clicked point",point.id);
            if(selectable){
                if(selectedPoint!==point.id)    setSelectedPoint(point.id);
                else setSelectedPoint(-1);
            }
        }
    ,}} icon={customMarkerIcon} position={point.coordinates} />
}

export default getMarkerForPoint;