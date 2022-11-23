import { useEffect, useState } from "react";
import { Container, Row,Col } from "react-bootstrap";
import HikeMapLink from "../components/hikeMapLink";
import SelectPointStartEnd from "../components/selectPointStartEnd";
import Hike from "../lib/hike";


function LinkPointStartEnd(props){
    console.log("IN LINK POINT START END WITH HIKE",props.hike);
    const hike=new Hike(1,"Rocciamelone","jon@localguide.com",1000,400,"HIKER",2,
    {
        id:4,
        type:"hikePoint",
        coordinates: [45.177786,7.083372]
    },{
        id:5,
        type:"hikePoint",
        coordinates: [45.203531,7.07734]
    },[],"Rocciamelone description");
    const [selectedPoint,setSelectedPoint]=useState(-1);
    const [submit,setSubmit]=useState(false);
    const [bounds,setBounds]=useState(hike.bounds);
    const [points,setPoints]=useState([
        {
            id:1,
            type:"parking",
            coordinates:[45.1906579, 7.07908]
        },
        {
            id:2,
            type:"parking",
            coordinates:[45.197786, 7.083372]
        },
        {
            id:3,
            type:"hut",
            coordinates:[45.1806564, 7.0792]
        },{
            id:4,
            type:"hikePoint",
            coordinates: [45.177786,7.083372]
        },{
            id:5,
            type:"hikePoint",
            coordinates: [45.203531,7.07734]
        }
    ]);
    /*useEffect(()=>{
        const pointsInBoundsNotLinkedAlready=async()=>{
            try {
                const points=await api.getPointsInBoundsNotHike(props.hike.id,bounds);
                setPointsInBounds(points);
            } catch (error) {
                setPointsInBounds([]);
            }
        }
        pointsInBoundsNotLinkedAlready();
    },[bounds]);*/
    if(submit || selectedPoint===(-1)){
        return(
            <div className="justify-content-center my-4">
                <HikeMapLink hike={hike} height={"70vh"} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} points={points}/>
            </div>
        )
    }
    else{
        return(
            <div className="justify-content-center my-4">
                <Container fluid>
                    <Row>
                        <Col xs={12} md={8}>
                            <HikeMapLink hike={hike} height={"70vh"} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} points={points}/>
                        </Col>
                        <Col xs={12} md={4}>
                            <SelectPointStartEnd startPoint={hike.startPoint} endPoint={hike.endPoint} point={points.find(p=>p.id===selectedPoint)} setSubmit={setSubmit}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default LinkPointStartEnd;