import Hike from "../lib/hike";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, useMap, Marker,Popup } from 'react-leaflet'
function HikeMap(props){
    const limeOptions = { color: 'red' }
    return(
        <>
                    <div style={{ height: "175px" }}>
                        <MapContainer center={props.hike.center} bounds={[
  [Math.max(...props.hike.coordinates.map(c=>c[0])), Math.max(...props.hike.coordinates.map(c=>c[1]))],
  [Math.min(...props.hike.coordinates.map(c=>c[0])), Math.min(...props.hike.coordinates.map(c=>c[1]))],
]} style={{ height: "100%", minHeight: "100%" }} scrollWheelZoom={true}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Polyline athOptions={limeOptions} positions={props.hike.coordinates} />
                        </MapContainer>
                        </div>
        </>
    )
}

export default HikeMap;