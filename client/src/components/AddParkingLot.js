import { useState } from 'react';
import { Row, Col, Form, FloatingLabel, Button, InputGroup } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';
import { PointMap } from '../components';
import services from '../lib/services';


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

    
    const setCoordinateAndGetAddress = (coordinate) => {
        setCoord(coordinate);
        services.GetAddressFromPoint(coordinate[0], coordinate[1]).then(x => setGeographicalArea(`${x.address.city}, ${x.address.county}, ${x.address.country}`.replace('undefined,','')));
    }

    return (<>
        {openArea && <PointMap openArea={openArea} setOpenArea={setOpenArea} setCoord={setCoordinateAndGetAddress} coord={coord} />}
        <Row>
            <Col xs={6} className="mx-auto">
                <Row className="mt-4">
                    <h3>Add a parking lot</h3>
                </Row>
                <FloatingLabel className="mb-3" controlId="floatingInput" label="Name">
                    <Form.Control type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Name" />
                </FloatingLabel>
                <FloatingLabel className="mb-3" controlId="floatingTextarea" label="Description">
                    <Form.Control as="textarea" value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Description" style={{ height: "120px" }} />
                </FloatingLabel>
                <FloatingLabel className="mb-3" controlId="floatingInput" label="Total slots">
                    <Form.Control type="number" data-test="total-cost" value={totalSlots} onChange={ev => setTotalSlots(ev.target.value)} min={0} placeholder="Total slots"/>
                </FloatingLabel>
                <Button className="mb-3" variant="outline-dark" style={{ height: "58px", width:"100%"}} onClick={() => setOpenArea(true)}>
                    Select point
                </Button>
                <FloatingLabel className="mb-3" controlId="floatingInput" label="Geographical Area">
                    <Form.Control disabled='true' type="text" data-test="geo-area" value={geographicalArea} onChange={ev => setGeographicalArea(ev.target.value)} placeholder="Geographical Area" />
                </FloatingLabel>
                {/* <Row className="mb-3">
                    <Col>
                        Total slots: <Form.Control type="number" data-test="total-cost" value={totalSlots} onChange={ev => setTotalSlots(ev.target.value)} />
                    </Col>
                    <Col>
                        Geographical Area: <input type="text"  data-test="geo-area" value={geographicalArea} onChange={ev => setGeographicalArea(ev.target.value)} />
                    </Col>
                    <Col>
                        <Button variant="outline-dark" style={{ height: "58px" }} onClick={() => setOpenArea(true)}>Select point</Button>
                    </Col>
                </Row> */}
                <div className="text-center">
                    <Button onClick={handleSubmit} variant="outline-success" className="mx-2">Add</Button>
                    <Button onClick={resetFields} variant="outline-secondary">Cancel</Button>
                </div>
            </Col>
        </Row>
    </>);
}

export default AddParkingLot;