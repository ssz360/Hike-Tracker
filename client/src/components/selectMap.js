import { useEffect } from "react";
import { useMap } from "react-leaflet";
import SelectArea from 'leaflet-area-select';
import { useState } from "react";
import { Button } from "react-bootstrap";

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}
function SelectMap(props) {
  const map = useMap();
  const [selecting,setSelecting]=useState(false);
  useEffect(() => {
    if (!selecting){
        map.selectArea.disable();
        return;
    };
    map.selectArea.enable();
    map.selectArea.setControlKey(false);
    map.on("areaselected", (e) => {
      console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
      props.setAreaBounds(e.bounds);
    });

    // You can restrict selection area like this:
    const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
    // check restricted area on start and move
    map.selectArea.setValidate((layerPoint) => {
      return bounds.contains(this._map.layerPointToLatLng(layerPoint));
    });

    // now switch it off
    map.selectArea.setValidate();
  }, [selecting]);
  return(
    <>
        <div className={POSITION_CLASSES.topright}>
            <div className="leaflet-control">
                {selecting?
                    <Button variant="outline-info" onClick={()=>{console.log("Clicked to set false");setSelecting(false)}}>Move</Button>
                :
                    <Button variant="outline-danger" onClick={()=>{console.log("Clicked to set TRUEEE");setSelecting(true)}}>Select</Button>
                }
                {props.areaBounds!==undefined?
                  <Button variant="outline-danger" onClick={()=>{console.log("Clicked to set false");props.setAreaBounds(undefined)}}>Clear</Button>
                :
                  <></>
                }
          </div>
        </div>
    </>
  )
}

export default SelectMap;