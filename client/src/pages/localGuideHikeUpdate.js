import { Route, Routes, useParams } from "react-router-dom";
import LinkHut from "./linkHut";
import LinkPointStartEnd from "./linkPointStartEnd";



function LocalGuideHikeUpdate(props){
    const hikeid=parseInt(useParams().hikeid);
    const hike=props.hikes.find(h=>h.id===hikeid);

    return(
        <Routes>
            <Route path="linkstartend" element={<LinkPointStartEnd hike={hike} refreshHikes={props.refreshHikes} updateStartEndPoint={props.updateStartEndPoint}/>}/>
            <Route path="linkhut" element={<LinkHut hike={hike} refreshHikes={props.refreshHikes} updateStartEndPoint={props.updateStartEndPoint}/>}/>
        </Routes>
    )
}

export default LocalGuideHikeUpdate;