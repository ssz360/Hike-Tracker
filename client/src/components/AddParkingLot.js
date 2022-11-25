import { useState } from 'react';
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';
import { PointMap } from '../components';


function AddParkingLot({ setParkings }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [totalSlots, setTotalSlots] = useState(0);
    const [geographicalArea, setGeographicalArea] = useState('');


    const [openArea, setOpenArea] = useState(false);
    const [coord, setCoord] = useState();

    const resetFields = () => {
        setName("");
        setDescription("");
        setTotalSlots(0);
        setCoord("");
        setGeographicalArea("");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const pk = {
            "name": name,
            "desc": description,
            "slots": totalSlots,
            "coordinates": coord,
            "geographicalArea": geographicalArea
        };
        await api.addParking(pk);
        const pks = await api.getParkings();
        setParkings(pks);
        resetFields();
    }

    return (<>
        {openArea ? (<PointMap openArea={openArea} setOpenArea={setOpenArea} setCoord={setCoord} coord={coord} />) : <></>}
        <Row className="mt-4">
            <h3>Add a parking lot</h3>
        </Row>
        <FloatingLabel className="mb-3" controlId="floatingInput" label="Name">
            <Form.Control type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Name" />
        </FloatingLabel>
        <FloatingLabel className="mb-3" controlId="floatingTextarea" label="Description">
            <Form.Control as="textarea" value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Description" style={{ height: "160px" }} />
        </FloatingLabel>
        <Row className="mb-3">
            <Col>
                Total slots: <input type="number" value={totalSlots} onChange={ev => setTotalSlots(ev.target.value)} />
            </Col>
            <Col>
                Geographical Area: <input type="text" value={geographicalArea} onChange={ev => setGeographicalArea(ev.target.value)} />
            </Col>
            <Col>
                <Button variant="outline-dark" style={{ height: "58px" }} onClick={() => setOpenArea(true)}>Select point</Button>
            </Col>
        </Row>
        <Button onClick={handleSubmit} className="mx-2">Save</Button>
        <Button onClick={resetFields} variant="secondary">Cancel</Button>
    </>);
}

export default AddParkingLot;