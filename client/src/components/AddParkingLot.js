import { useState } from 'react';
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';

function AddParkingLot({setParkings}) {
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [totalSlots,setTotalSlots] = useState(0);
    
    const resetFields = () => {
        setName("");
        setDescription("");
        setTotalSlots(0);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const pk = {
            "name":name,
            "desc":description,
            "slots":totalSlots
        };
        await api.addParking(pk);
        const pks = await api.getParkings();
        setParkings(pks);
        resetFields();
    }

    return(<>
        <Row className="mt-4">
            <h3>Add a parking lot</h3>
        </Row>
        <FloatingLabel className="mb-3" controlId="floatingInput" label="Name">
            <Form.Control type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Name"/>
        </FloatingLabel>
        <FloatingLabel className="mb-3" controlId="floatingTextarea" label="Description">
            <Form.Control as="textarea" value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Description" style={{height:"160px"}}/>
        </FloatingLabel>
        <Row className="mb-3">
            <Col>
                Total slots: <input type="number" value={totalSlots} onChange={ev => setTotalSlots(ev.target.value)}/>
            </Col>
        </Row>
        <Button onClick={handleSubmit} className="mx-2">Save</Button>
        <Button onClick={resetFields} variant="secondary">Cancel</Button>
    </>);
}

export default AddParkingLot;