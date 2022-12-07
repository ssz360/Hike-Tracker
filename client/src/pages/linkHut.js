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
    const [linkableHuts,setLinkableHuts]=useState([]);
    useEffect(()=>{
        const linkableHuts=async ()=>{
            try {
                const newPoints=await api.getLinkableHuts(props.hike.id);
                setLinkableHuts([...newPoints]);
            } catch (error) {
                console.log("ERROR IN USEEFFECT GET POINTS IN BOUNDS",error);
            }
        }
        linkableHuts();
    },[]);
    console.log("IN LINK POINT START END WITH HIKE",props.hike,"selected point",selectedPoint,"linkable huts",linkableHuts);
    const linkHut=async linkType=>{
        try {
            await api.linkHut(props.hike.id,selectedPoint,linkType);
            await props.refreshHikes();//props.hike,points.find(p=>p.id===selectedPoint),linkType);
            const newPoints=await api.getLinkableHuts(props.hike.id);
            setLinkableHuts([...newPoints]);
        } catch (error) {
            console.log("Error in linkpoint",error);
        }
    }
    if(submit || selectedPoint===(-1)){
        return(
            <div className="justify-content-center my-4">
                <HikeMapLinkHut setBounds={setBounds} bounds={bounds} hike={props.hike} height={"70vh"} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} linkableHuts={linkableHuts}/>
            </div>
        )
    }
    else{
        return(
            <div className="justify-content-center my-4">
                <Container fluid>
                    <Row>
                        <Col xs={12} md={8}>
                            <HikeMapLinkHut hike={props.hike} height={"70vh"} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} bounds={bounds} linkableHuts={linkableHuts}/>
                        </Col>
                        <Col xs={12} md={4}>
                            <SelectLinkHut linkHut={linkHut} hike={props.hike} startPoint={props.hike.startPoint} endPoint={props.hike.endPoint} point={[...linkableHuts,...props.hike.huts].find(p=>p.id===selectedPoint)} setSubmit={setSubmit}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default LinkHut;