import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import HikeMapLink from "../components/hikeMapLink";
import SelectPointStartEnd from "../components/selectPointStartEnd";
import api from "../lib/api";
import { ArrowLeft } from "react-bootstrap-icons";
import { Navigate, useNavigate } from "react-router-dom";

function LinkPointStartEnd(props) {
    console.log("IN LINKPOINTSTARTEND WITH", props.hike);
    const [selectedPoint, setSelectedPoint] = useState(-1);
    const [submit, setSubmit] = useState(false);
    const [bounds, setBounds] = useState([[0, 0], [0.1, 0.1]]);
    const [linkableStartPoints, setLinkableStartPoints] = useState([]);
    const [linkableEndPoints, setLinkableEndPoints] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const linkableHuts = async () => {
            try {
                const linkableStartPoints = await api.getLinkableStartPoints(props.hike.id);
                const linkableEndPoints = await api.getLinkableEndPoints(props.hike.id);
                console.log("Linkable start points", linkableStartPoints);
                console.log("Linkable end points", linkableEndPoints);
                setLinkableStartPoints([...linkableStartPoints]);
                setLinkableEndPoints([...linkableEndPoints]);
            } catch (error) {
                console.log("ERROR IN USEEFFECT GET POINTS IN BOUNDS", error);
            }
        }
        linkableHuts();
    }, []);
    console.log("IN LINK POINT START END WITH HIKE", props.hike, "selected point", selectedPoint, "points", [...linkableStartPoints, ...linkableEndPoints, ...props.hike.referencePoints, ...props.hike.huts, props.hike.startPoint, props.hike.endPoint]);
    const linkPoint = async linkType => {
        try {
            await api.linkStartArrival(props.hike.id, linkType === "start" ? selectedPoint : undefined, linkType === "end" ? selectedPoint : undefined);
            await props.refreshHikes();//props.hike,points.find(p=>p.id===selectedPoint),linkType);
            const linkableStartPoints = await api.getLinkableStartPoints(props.hike.id);
            const linkableEndPoints = await api.getLinkableEndPoints(props.hike.id);
            console.log("Linkable start points", linkableStartPoints);
            console.log("Linkable end points", linkableEndPoints);
            setLinkableStartPoints([...linkableStartPoints]);
            setLinkableEndPoints([...linkableEndPoints]);
        } catch (error) {
            console.log("Error in linkpoint", error);
        }
    }

    return (
        <Container fluid style={{ backgroundColor: "#e0e3e5" }}>
            <Row>
                <Col xs={12} md={4}>
                    <ArrowLeft role="button" className="me-3" onClick={() => navigate("/localGuide/hikes")} size="20px" />
                    <Card className="shadow my-4">
                        <div className="my-4 mx-4">
                            <h4>Link starting or arrival point</h4>
                            {
                                (submit || selectedPoint === (-1)) ?
                                    <span>
                                        <i>Select a hut or a parking on the map, then define it as start or end point for this hike</i>
                                    </span>
                                    :
                                    <SelectPointStartEnd hike={props.hike} linkPoint={linkPoint} startPoint={props.hike.startPoint} endPoint={props.hike.endPoint}
                                        inkableStart={[...linkableStartPoints].map(p => p.id).includes(selectedPoint)}
                                        linkableEnd={[...linkableEndPoints]
                                            .map(p => p.id)
                                            .includes(selectedPoint)}
                                        point={[...linkableStartPoints, ...linkableEndPoints, ...props.hike.referencePoints, ...props.hike.huts, props.hike.startPoint, props.hike.endPoint]
                                            .find(p => p.id === selectedPoint)}
                                        setSubmit={setSubmit} />
                            }
                        </div>
                    </Card>
                </Col>
                <Col xs={12} md={8}>
                    <HikeMapLink hike={props.hike} height={"93vh"} linkableStartPoints={linkableStartPoints} linkableEndPoints={linkableEndPoints} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} bounds={bounds} />
                </Col>
            </Row>
        </Container>
    )

}

export default LinkPointStartEnd;