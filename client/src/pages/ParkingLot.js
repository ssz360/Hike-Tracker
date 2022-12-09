import { useState, useEffect } from 'react';
import { Row, Card, Container, Collapse, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AddParkingLot } from '../components';
import { PlusCircle, ChevronCompactDown, ChevronCompactUp } from 'react-bootstrap-icons'

function ParkingLotRow({ p, i }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Col xs={12} sm={6} md={3} className="mt-2"><Card className="shadow mt-3">
                <Card.Header>
                    <h4>{p.Name}</h4>
                </Card.Header>
                <Card.Body>
                    <Card.Text><strong>Total slots: </strong><span className='test-length'>{p.SlotsTot}</span><br></br>
                        <strong>Free slots: </strong><span className='test-difficulty'>{p.SlotsTot - p.SlotsFull}</span> <br></br>
                    </Card.Text>
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
    const navigate = useNavigate();
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        const getParkings = async () => {
            const pks = await api.getParkings();
            setParkings(pks);
        }
        getParkings();
    }, []);

    return (<>
        <Container fluid style={{ width: "85%", height: "93vh" }} >
            <br></br>
            <Row className="mt-3">
                <div className="d-grid gap-2 ">
                    <Button className="rounded-pill" style={
                        {
                            width: "fit-content",
                            height: "45px",
                            borderColor: "white",
                            backgroundColor: !isHover ? '#006666' : '#009999'
                        }
                    }
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        onClick={() => navigate("/localGuide/newParking")}><strong><PlusCircle size={"20px"} className="mb-1" /> Add new parking lot</strong> </Button>
                </div>
            </Row>


            <Row>
                {parkings.map((p, i) => (<ParkingLotRow p={p} i={i} key={i} />))}
            </Row>
        </Container>
    </>);
}

//parkings.map((p, i) => (<ParkingLotRow p={p} i={i} key={i} />))

export default ParkingLot;