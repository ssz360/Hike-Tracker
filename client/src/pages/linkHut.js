import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import HikeMapLinkHut from "../components/hikeMapLinkHut";
import SelectLinkHut from "../components/selectLinkHut";
import api from "../lib/api";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import React from 'react';


function LinkHut(props) {
    const [selectedPoint, setSelectedPoint] = useState(-1);
    const [submit, setSubmit] = useState(false);
    const [bounds, setBounds] = useState([[0, 0], [0.1, 0.1]]);
    const [linkableHuts, setLinkableHuts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const linkableHuts = async () => {
            try {
                const newPoints = await api.getLinkableHuts(props.hike.id);
                setLinkableHuts([...newPoints]);
            } catch (error) {
                console.log("ERROR IN USEEFFECT GET POINTS IN BOUNDS", error);
            }
        }
        linkableHuts();
    }, []);
    console.log("IN LINK POINT START END WITH HIKE", props.hike, "selected point", selectedPoint, "linkable huts", linkableHuts);
    const linkHut = async linkType => {
        try {
            await api.linkHut(props.hike.id, selectedPoint, linkType);
            await props.refreshHikes();
            const newPoints = await api.getLinkableHuts(props.hike.id);
            setLinkableHuts([...newPoints]);
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
                            <h4>Link hut</h4>
                            {
                                (submit || selectedPoint === (-1)) ?
                                    <span>
                                        <i>Select a hut to link (or unlink) it to this hike</i>
                                    </span>
                                    :
                                    <SelectLinkHut linkHut={linkHut} hike={props.hike} startPoint={props.hike.startPoint} endPoint={props.hike.endPoint} point={[...linkableHuts, ...props.hike.huts].find(p => p.id === selectedPoint)} setSubmit={setSubmit} />
                            }
                        </div>
                    </Card>
                </Col>
                <Col xs={12} md={8}>
                    <HikeMapLinkHut hike={props.hike} height={"70vh"} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} setBounds={setBounds} bounds={bounds} linkableHuts={linkableHuts} />
                </Col>
            </Row>
        </Container>
    )
}

export default LinkHut;