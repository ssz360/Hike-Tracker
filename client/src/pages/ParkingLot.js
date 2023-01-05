import { useState, useEffect } from 'react';
import { Row, Card, Container, Collapse, Col } from 'react-bootstrap';
import api from '../lib/api';
import { ChevronCompactDown, ChevronCompactUp } from 'react-bootstrap-icons'

function ParkingLotRow({ p, i }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Col xs={12} sm={6} md={3} className="mt-2"><Card className="shadow mt-3">
                <Card.Header>
                    <h4>{p.Name}</h4>
                </Card.Header>
                <Card.Body>
                    {/* Attributes */}
                    <Card.Text><strong>Total slots: </strong><span className='test-length'>{p.SlotsTot}</span><br></br>
                        <strong>Free slots: </strong><span className='test-difficulty'>{p.SlotsTot - p.SlotsFull}</span> <br></br>
                    </Card.Text>
                    {/* Icon to expand */}
                    <Card.Text >{!open ? (
                        <div className="d-flex flex-row-reverse">

                            < ChevronCompactDown role="button" className="text-decoration-none" style={{ fontSize: "20px" }}
                                onClick={() => setOpen(!open)}
                                aria-controls="example-collapse-text"
                                aria-expanded={open} />
                        </div>)
                        :
                        (<div className="d-flex flex-row-reverse">
                            < ChevronCompactUp role="button" className="text-decoration-none" style={{ fontSize: "20px" }}
                                onClick={() => setOpen(!open)}
                                aria-controls="example-collapse-text"
                                aria-expanded={open} />
                        </div>)}
                        {/* Text in expanded selection */}
                        <Collapse in={open}>
                            <div id="example-collapse-text">
                                <Card className="bg-light text-dark">
                                    <Card.Body><strong>Description: </strong>{p.Description}</Card.Body>
                                </Card>
                            </div>
                        </Collapse>
                    </Card.Text>
                </Card.Body>
            </Card>
            </Col>
        </>
    );
}

function ParkingLot() {

    const [parkings, setParkings] = useState([]);

    useEffect(() => {
        const getParkings = async () => {
            const pks = await api.getParkings();
            setParkings(pks);
        }
        getParkings();
    }, []);

    return (<>
        <Container fluid style={{ height: "93vh"}} >
        <Row id="first-row" fluid style={{ height: "93vh" }}>
            <Col sm={2} style={{ height: "93vh", backgroundColor: "#e0e3e5" }}></Col>
            <Col  sm={10} style={{overflowY:'scroll', height:'93vh'}} >
                <Row >
                    {parkings.map((p, i) => (<ParkingLotRow p={p} i={i} key={i} />))}
                </Row>
            </Col>
            </Row>
        </Container>
    </>);
}

export default ParkingLot;