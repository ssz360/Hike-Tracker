import { useState, useEffect } from 'react';
import { Row, Table, Container, Form } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';
import { AddParkingLot } from '../components';

function ParkingLotRow({ p, i }) {
    return (
        <tr>
            <td>{i + 1}</td>
            <td>{p.Name}</td>
            <td>{p.Description}</td>
            <td>{p.SlotsTot}</td>
            <td>{p.SlotsTot - p.SlotsFull}</td>
        </tr>
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
        <div style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage: "url(/images/DSC_0089.jpg)",
            minHeight: "100%"
        }}>

            <Container fluid className="mt-5">
                <div className="d-flex align-items-center justify-content-center text-center not-found-container">
                    <h3 className="mt-3"
                        style={{
                            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
                            fontWeight: "800",
                            fontSize: "49px",
                            color: "#0d0d0d",
                            textShadow: "2px 2px 4px #cccccc"
                        }}>Add a new parking lot</h3>
                </div>
                <Row>
                    <div className="d-flex align-items-center justify-content-center not-found-container mt-4"
                            style={{opacity: "90%"}}>
                        
                         <AddParkingLot setParkings={setParkings} />                        
                         {/* <Row className="mt-4">
                            <h1>Parking lots</h1>
                        </Row> */}
                        {/* <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Total slots</th>
                                    <th>Empty slots</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parkings.map((p, i) => (<ParkingLotRow p={p} i={i} key={i} />))}
                            </tbody>
                        </Table> */}
                    </div>
                </Row>
            </Container>
        </div>
    </>);
}

export default ParkingLot;