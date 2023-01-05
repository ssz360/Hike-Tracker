import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, } from 'react-leaflet'
import { useEffect, useState } from "react";
import { Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import api from "../lib/api";
import SelectedPoint from "./selectedPoint";
import getMarkerForPoint from "../lib/markerPoint";
import globalVariables from "../lib/globalVariables";
import Glossary from "./glossary";
import React from 'react';

function HikeMap(props) {
    const [bounds, setBounds] = useState([[0, 0], [0.1, 0.1]]);
    const [coordinates, setCoordinates] = useState([]);
    const [ , setCenter] = useState([0.05, 0.05]);

    useEffect((props) => {
        const getMapDetails = async () => {
            try {
                const mapdets = await api.getHikeMap(props.hike.id);
                setBounds(mapdets.bounds);
                setCoordinates(mapdets.coordinates);
                setCenter(mapdets.center);
            } catch (error) {
                setBounds([[0, 0], [0.1, 0.1]]);
                setCenter([0.05, 0.05]);
                setCoordinates([]);
            }
        }
        getMapDetails();
    }, []);
    const opts = { color: 'red' }
    const [show, setShow] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(-1);
    return (
        <>
            {show ?
                <Modal show={show} size="lg" className="my-1" onHide={e => setShow(false)}>
                    <Modal.Body className="custom-modal-body">
                        {/* Glossary */}
                        <Glossary></Glossary>

                        {selectedPoint > 0 ?
                            <Container fluid>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <MapContainer bounds={bounds} style={{ height: "60vh", width: "auto" }} scrollWheelZoom={true}>
                                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={globalVariables.mapTiles} />
                                            <Polyline pathOptions={opts} positions={coordinates} />
                                            {[...props.hike.referencePoints, ...props.hike.huts].filter(p => p.id !== props.hike.startPoint.id && p.id !== props.hike.endPoint.id).map(p => getMarkerForPoint(p, p.id === props.hike.startPoint.id, p.id === props.hike.endPoint.id, selectedPoint === p.id, true, selectedPoint, setSelectedPoint))}
                                            {getMarkerForPoint(props.hike.startPoint, true, props.hike.startPoint.id === props.hike.endPoint.id, selectedPoint === props.hike.startPoint.id, true, selectedPoint, setSelectedPoint)}
                                            {props.hike.startPoint.id !== props.hike.endPoint.id ? getMarkerForPoint(props.hike.endPoint, false, true, selectedPoint === props.hike.endPoint.id, true, selectedPoint, setSelectedPoint) : <></>}
                                        </MapContainer>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <SelectedPoint startPoint={props.hike.startPoint} endPoint={props.hike.endPoint} point={[...props.hike.referencePoints, ...props.hike.huts, props.hike.startPoint, props.hike.endPoint].find(p => p.id === selectedPoint)} />
                                    </Col>
                                </Row>
                            </Container>
                            :
                            <MapContainer bounds={bounds} style={{ height: "60vh", width: "auto" }} scrollWheelZoom={true}>
                                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={globalVariables.mapTiles} />
                                <Polyline pathOptions={opts} positions={coordinates} />
                                {[...props.hike.referencePoints, ...props.hike.huts].filter(p => p.id !== props.hike.startPoint.id && p.id !== props.hike.endPoint.id).map(p => getMarkerForPoint(p, p.id === props.hike.startPoint.id, p.id === props.hike.endPoint.id, selectedPoint === p.id, true, selectedPoint, setSelectedPoint))}
                                {getMarkerForPoint(props.hike.startPoint, true, props.hike.startPoint.id === props.hike.endPoint.id, selectedPoint === props.hike.startPoint.id, true, selectedPoint, setSelectedPoint)}
                                {props.hike.startPoint.id !== props.hike.endPoint.id ? getMarkerForPoint(props.hike.endPoint, false, true, selectedPoint === props.hike.endPoint.id, true, selectedPoint, setSelectedPoint) : <></>}
                            </MapContainer>
                        }
                    </Modal.Body>
                    <Modal.Header closeButton><strong>This is the map for hike {props.hike.name}</strong></Modal.Header>
                    <Modal.Body>
                        <h5>Description:</h5>
                        {props.hike.description}
                    </Modal.Body>
                </Modal>
                :
                <></>
            }
            <div onDoubleClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setShow(true);
            }}>
                {bounds[0][0] === 0 ?
                    <Spinner animation="grow" />
                    :
                    <MapContainer bounds={bounds} style={{ height: "35vh", width: "auto" }} scrollWheelZoom={false} doubleClickZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={globalVariables.mapTiles} />
                        <Polyline pathOptions={opts} positions={coordinates} />
                    </MapContainer>
                }
            </div>
        </>
    )
}

export default HikeMap;