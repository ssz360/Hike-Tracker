import React from 'react';
import { Spinner } from "react-bootstrap";
import { Route, Routes, useParams } from "react-router-dom";
import AddReferencePoint from "./addReferencePoint";
import LinkHut from "./linkHut";
import LinkPointStartEnd from "./linkPointStartEnd";

function LocalGuideHikeUpdate(props) {
    const hikeid = parseInt(useParams().hikeid);
    const hike = props.hikes.find(h => h.id === hikeid);
    return (
        <>
            <Routes>
                <Route path="linkstartend" element={hike === undefined ? <Spinner animation="grow" /> : <LinkPointStartEnd hike={hike} refreshHikes={props.refreshHikes} updateStartEndPoint={props.updateStartEndPoint} />} />
                <Route path="linkhut" element={hike === undefined ? <Spinner animation="grow" /> : <LinkHut hike={hike} refreshHikes={props.refreshHikes} updateStartEndPoint={props.updateStartEndPoint} />} />
                <Route path="addReferencePoint" element={hike === undefined ? <Spinner animation="grow" /> : <AddReferencePoint hike={hike} refreshHikes={props.refreshHikes} />} />
            </Routes>
        </>
    )
}

export default LocalGuideHikeUpdate;