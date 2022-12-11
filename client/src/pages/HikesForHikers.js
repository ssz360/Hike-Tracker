
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { MapContainer, TileLayer, Polyline, useMap, useMapEvents, Marker, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';


import './HikesForHikers.css'
import { useState } from 'react';
import globalVariables from "../lib/globalVariables";

function HikesForHikers(props) {
    let position = [50.5, 30.5];
    let tmpHikes = [
        {
            id: 0,
            name: "Hike's Name",
            distance: "10KM",
            Ascent: "800M",
            Difficulty: "Entry level",
            Roundtrip: "Yes"
        },
        {
            id: 1,
            name: "Hike 2",
            distance: "10KM",
            Ascent: "800M",
            Difficulty: "Entry level",
            Roundtrip: "Yes"
        },
        {
            id: 2,
            name: "Hike 3",
            distance: "10KM",
            Ascent: "800M",
            Difficulty: "Entry level",
            Roundtrip: "Yes"
        },
    ]
    let [selectedHike, SetSelectedHike] = useState({});

    function selected(item) {
        SetSelectedHike(item);
        console.log(item);
    }
    return (
        <div className='page-container full-height'>
            <Row className='h100'>
                <Col>
                    <h3 className='list-title'>List of hikes:</h3>
                    <Accordion defaultActiveKey="0">
                        {tmpHikes.map(item => {
                            return (
                                <Card key={item.id} className='info-card'>
                                    <Card.Header  className={item.id === selectedHike.id ? 'active' : ''}>
                                        <Row>
                                            <Col xs={8}>
                                                <div className='hike-title' onClick={() => selected(item)}>
                                                    {item.name}
                                                </div>
                                            </Col>
                                            <Col className='btn-col'>
                                                <CustomToggle eventKey={item.id}>More...</CustomToggle>
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={item.id}>
                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <div><span className='more-key'>Distance:</span><span className='more-value'>{item.distance}</span></div>
                                                    <div><span className='more-key'>Ascent:</span><span className='more-value'>{item.Ascent}</span></div>
                                                </Col>
                                                <Col>
                                                    <div><span className='more-key'>Difficulty:</span><span className='more-value'>{item.distance}</span></div>
                                                    <div><span className='more-key'>Roundtrip:</span><span className='more-value'>{item.Roundtrip}</span></div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            )
                        })}
                    </Accordion>
                </Col>
                <Col>
                    <div className='map-container'>

                        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url={globalVariables.mapTiles}
                            />
                            <Marker position={position}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                        </MapContainer>


                    </div>
                </Col>
            </Row>
        </div>



    );
}


function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <button
            className='more-btn'
            type="button"
            onClick={decoratedOnClick}
        >
            {children}
        </button>
    );
}


export default HikesForHikers;