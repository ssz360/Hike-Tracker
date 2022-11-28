import { useEffect, useState } from "react";
import { Container, Row,Col } from "react-bootstrap";
import HikeMapLink from "../components/hikeMapLink";
import HikeMapLinkHut from "../components/hikeMapLinkHut";
import SelectLinkHut from "../components/selectLinkHut";
import SelectPointStartEnd from "../components/selectPointStartEnd";
import api from "../lib/api";
import Hike from "../lib/hike";


function LinkHut(props){
    const [selectedPoint,setSelectedPoint]=useState(-1);
    const [submit,setSubmit]=useState(false);
    const [bounds,setBounds]=useState([[0,0],[0.1,0.1]]);
    const [points,setPoints]=useState([]);
    useEffect(()=>{
        const pointsInBounds=async ()=>{
            try {
                console.log("IN POINTGETBOUNDS HOOK WITH BOUNDS",bounds);
                if(bounds[0][0]!==0){
                    console.log("NEEDS TO CALL API WITH BOUNDS",bounds);
                    const newPoints=await api.getHutsInBounds(bounds,props.hike.startPoint,props.hike.endPoint);
                    console.log("GOT POINTS",newPoints);
                    if(selectedPoint>0 && selectedPoint!==props.hike.startPoint.id && selectedPoint!==props.hike.endPoint.id){
                        if(newPoints.find(p=>p.id===selectedPoint)!==undefined) setPoints([...newPoints]);
                        else setPoints([...newPoints,points.find(p=>p.id===selectedPoint)])
                    }
                    else setPoints([...newPoints]);
                }
                else{
                    console.log("NO NEED TO CALL API");
                }
            } catch (error) {
                console.log("ERROR IN USEEFFECT GET POINTS IN BOUNDS",error);
            }
        }
        pointsInBounds();
    },[bounds]);
    console.log("IN LINK POINT START END WITH HIKE",props.hike,"selected point",selectedPoint,"points",points);
    const linkHut=async ()=>{
        try {
            await api.linkHut(props.hike.id,selectedPoint);
            await props.refreshHikes();//props.hike,points.find(p=>p.id===selectedPoint),linkType);
            const newPoints=await api.getHutsInBounds(bounds,props.hike.startPoint,props.hike.endPoint);
            console.log("GOT POINTS",newPoints);
            if(selectedPoint>0 && selectedPoint!==props.hike.startPoint.id && selectedPoint!==props.hike.endPoint.id){
                if(newPoints.find(p=>p.id===selectedPoint)!==undefined) setPoints([...newPoints]);
                else setPoints([...newPoints,points.find(p=>p.id===selectedPoint)])
            }
            else setPoints([...newPoints]);
        } catch (error) {
            console.log("Error in linkpoint",error);
        }
    }
    if(submit || selectedPoint===(-1)){
        return(
            <div className="justify-content-center my-4">
                <HikeMapLinkHut hike={props.hike} height={"70vh"} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} bounds={bounds} points={points}/>
            </div>
        )
    }
    else{
        return(
            <div className="justify-content-center my-4">
                <Container fluid>
                    <Row>
                        <Col xs={12} md={8}>
                            <HikeMapLinkHut hike={props.hike} height={"70vh"} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} bounds={bounds} points={points}/>
                        </Col>
                        <Col xs={12} md={4}>
                            <SelectLinkHut linkHut={linkHut} hike={props.hike} startPoint={props.hike.startPoint} endPoint={props.hike.endPoint} point={[...points,props.hike.startPoint,props.hike.endPoint].find(p=>p.id===selectedPoint)} setSubmit={setSubmit}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default LinkHut;