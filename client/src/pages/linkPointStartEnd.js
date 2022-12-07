import { useEffect, useState } from "react";
import { Container, Row,Col } from "react-bootstrap";
import HikeMapLink from "../components/hikeMapLink";
import SelectPointStartEnd from "../components/selectPointStartEnd";
import api from "../lib/api";
import Hike from "../lib/hike";


function LinkPointStartEnd(props){
    const [selectedPoint,setSelectedPoint]=useState(-1);
    const [submit,setSubmit]=useState(false);
    const [bounds,setBounds]=useState([[0,0],[0.1,0.1]]);
    const [linkableStartPoints,setLinkableStartPoints]=useState([]);
    const [linkableEndPoints,setLinkableEndPoints]=useState([]);
    useEffect(()=>{
        const linkableHuts=async ()=>{
            try {
                const linkableStartPoints=await api.getLinkableStartPoints(props.hike.id);
                const linkableEndPoints=await api.getLinkableEndPoints(props.hike.id);
                console.log("Linkable start points",linkableStartPoints);
                console.log("Linkable end points",linkableEndPoints);
                setLinkableStartPoints([...linkableStartPoints]);
                setLinkableEndPoints([...linkableEndPoints]);
            } catch (error) {
                console.log("ERROR IN USEEFFECT GET POINTS IN BOUNDS",error);
            }
        }
        linkableHuts();
    },[]);
    console.log("IN LINK POINT START END WITH HIKE",props.hike,"selected point",selectedPoint,"points",[...linkableStartPoints,...linkableEndPoints,...props.hike.referencePoints,...props.hike.huts,props.hike.startPoint,props.hike.endPoint]);
    const linkPoint=async linkType=>{
        try {
            await api.linkStartArrival(props.hike.id,linkType==="start"?selectedPoint:undefined,linkType==="end"?selectedPoint:undefined);
            await props.refreshHikes();//props.hike,points.find(p=>p.id===selectedPoint),linkType);
            const linkableStartPoints=await api.getLinkableStartPoints(props.hike.id);
            const linkableEndPoints=await api.getLinkableEndPoints(props.hike.id);
            console.log("Linkable start points",linkableStartPoints);
            console.log("Linkable end points",linkableEndPoints);
            setLinkableStartPoints([...linkableStartPoints]);
            setLinkableEndPoints([...linkableEndPoints]);
        } catch (error) {
            console.log("Error in linkpoint",error);
        }
    }
    if(submit || selectedPoint===(-1)){
        return(
            <div className="justify-content-center my-4">
                <HikeMapLink hike={props.hike} height={"70vh"} linkableStartPoints={linkableStartPoints} linkableEndPoints={linkableEndPoints} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} bounds={bounds}/>
            </div>
        )
    }
    else{
        return(
            <div className="justify-content-center my-4">
                <Container fluid>
                    <Row>
                        <Col xs={12} md={8}>
                            <HikeMapLink hike={props.hike} height={"70vh"} linkableStartPoints={linkableStartPoints} linkableEndPoints={linkableEndPoints} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} bounds={bounds}/>
                        </Col>
                        <Col xs={12} md={4}>
                            <SelectPointStartEnd hike={props.hike} linkPoint={linkPoint} startPoint={props.hike.startPoint} endPoint={props.hike.endPoint} linkableStart={[...linkableStartPoints,props.hike.referencePoints.find(p=>p.name==="Default start point of hike "+props.hike.name)].map(p=>p.id).includes(selectedPoint)} linkableEnd={[...linkableEndPoints,props.hike.referencePoints.find(p=>p.name==="Default arrival point of hike "+props.hike.name)].map(p=>p.id).includes(selectedPoint)} point={[...linkableStartPoints,...linkableEndPoints,...props.hike.referencePoints,...props.hike.huts,props.hike.startPoint,props.hike.endPoint].find(p=>p.id===selectedPoint)} setSubmit={setSubmit}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default LinkPointStartEnd;