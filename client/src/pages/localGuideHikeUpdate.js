import { Route, Routes, useParams } from "react-router-dom";
import LinkPointStartEnd from "./linkPointStartEnd";



function LocalGuideHikeUpdate(props){
    const hikeid=parseInt(useParams().hikeid);
    const hike=props.hikes.find(h=>h.id===hikeid);

    return(
        <Routes>
            <Route path="linkstartend" element={<LinkPointStartEnd hike={hike}/>}/>
            <Route path="linkhut" element={<></>}/>
        </Routes>
    )
}

export default LocalGuideHikeUpdate;