import { useState } from 'react';
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import api from '../lib/api';

function AddParkingLot() {
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [totalSlots,setTotalSlots] = useState(0);
    const [compiling,setCompiling] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const pk = {
            "name":name,
            "desc":description,
            "slots":totalSlots
        };
        await api.addParking(pk);
        setCompiling(false);
    }

    return(<>
        <Row className="mt-4">
            <h1>Add a parking lot</h1>
        </Row>
        <FloatingLabel className="mb-3" controlId="floatingInput" label="Name">
            <Form.Control type="text" onChange={ev => setName(ev.target.value)} placeholder="Name"/>
        </FloatingLabel>
        <FloatingLabel className="mb-3" controlId="floatingTextarea" label="Description">
            <Form.Control as="textarea" onChange={ev => setDescription(ev.target.value)} placeholder="Description" style={{height:"160px"}}/>
        </FloatingLabel>
        <Row className="mb-3">
            <Col>
                Total slots: <input type="number" onChange={ev => setTotalSlots(ev.target.value)}/>
            </Col>
        </Row>
        <Button onClick={handleSubmit}>{compiling ? "Save" : <Navigate to="/parking"/>}</Button>
        <Link to="/parking" className="mx-2">
            <Button variant="secondary">Cancel</Button>
        </Link>
    </>);
}

export default AddParkingLot;