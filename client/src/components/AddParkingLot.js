import { useState } from 'react';
import { Row, Col, Form, FloatingLabel, Alert, InputGroup, Container, Button } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';
import { PointMap } from '../components';
import { GeoFill, Upload, XCircle } from 'react-bootstrap-icons'

function AddParkingLot({ setParkings }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [totalSlots, setTotalSlots] = useState("");
    const [geographicalArea, setGeographicalArea] = useState('');
    const [err, setErr] = useState("");
    const [message, setMessage] = useState("");
    const [done, setDone] = useState(false);
    const [openArea, setOpenArea] = useState(false);
    const [coord, setCoord] = useState();

    const resetFields = () => {
        setName("");
        setDescription("");
        setTotalSlots("");
        setCoord("");
        setGeographicalArea("");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateInfo(name, description, totalSlots, geographicalArea, coord, setMessage)) {
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
            setDone(true);
        } else {
            setErr(true);
        }
    }

    return (<>
        {openArea && <PointMap openArea={openArea} setOpenArea={setOpenArea} setCoord={setCoord} coord={coord} />}
        <Form className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: "40%" }}>
            <FloatingLabel className="mb-3" controlId="floatingInput" label="Parking name">
                <Form.Control type="text" value={name} onClick={() => setErr(false)} onChange={ev => setName(ev.target.value)} placeholder="Name" />
            </FloatingLabel>
            <FloatingLabel className="mb-3" controlId="floatingTextarea" label="Parking description">
                <Form.Control as="textarea" value={description} onClick={() => setErr(false)} onChange={ev => setDescription(ev.target.value)} placeholder="Description" style={{ height: "120px" }} />
            </FloatingLabel>
            <FloatingLabel className="mb-3" controlId="floatingInput" label="Total slots">
                <Form.Control type="number" data-test="total-cost" value={totalSlots} onClick={() => setErr(false)} onChange={ev => setTotalSlots(ev.target.value)} min={0} placeholder="Total slots" />
            </FloatingLabel>
            <FloatingLabel className="mb-3" controlId="floatingInput" label="Geographical area">
                <Form.Control type="text" data-test="geo-area" value={geographicalArea} onClick={() => setErr(false)} onChange={ev => setGeographicalArea(ev.target.value)} placeholder="Geographical Area" />
            </FloatingLabel>
          
            {/* <FloatingLabel className="mb-3" controlId="floatingInput" label={"Position"}> */}
                {/* <Form.Control type="button" value={<GeoFill>Position</GeoFill>} onClick={() => setOpenArea(true)} /> */}
            {/* </FloatingLabel> */}
            <Alert role="button" variant="light" style={{backgroundColor:"#FFFFFF", border:"1px solid #ced4da", color:"#000000"}} onClick={() => setOpenArea(true)}>
                {/* <Button variant="l ight" syle={{backgroundColor:"#FFFFFF"}} fluid> */}
                    <GeoFill className="me-3"/>
                     Position
            </Alert>
            {/* <GeoFill role="button" className="me-3 " variant="outline-dark" onClick={() => setOpenArea(true)} size="20px">Select point</GeoFill> */}
          


            {/* ERROR HANDLING */}
            {err && <Alert variant="danger" onClose={() => setErr(false)} dismissible>{message}</Alert>}
            {/* HUT SUCCESSFULLY ADDED */}
            {done && <Alert variant="success" onClose={() => setDone(false)} dismissible>Parking lot successfully added!</Alert>}
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
            <div className="d-flex flex-row-reverse">
                <Upload role="button" className="me-3" onClick={(handleSubmit)} type="submit" size="20px" />
                <XCircle role="button" className="me-3 " onClick={resetFields} variant="outline-secondary" size="20px" />
            </div>
        </Form>
    </>);
}

const validateInfo = (name, description, totalSlots, geographicalArea, coord, setMessage) => {
    if ([name, description, totalSlots, geographicalArea, coord, setMessage].some(t => t.length === 0)) {
        setMessage("All fields should be filled");
        return false;
    }

    if (name.match(/^\s+$/)) {
        setMessage("Invalid parking name.");
        return false;
    }

    if (!geographicalArea.match(/^[a-zA-Z]+[a-zA-Z]+$/)) {
        setMessage("Invalid geographical area name.");
        return false;
    }
    /*
    if (!(coordinate.split(",").length === 2 && coordinate.split(",").every(t => t.match(/^([0-9]*[.])?[0-9]+$/)))) {
        setMessage("The coordinates should be two numbers separated by comma");
        return false;
    }*/

    return true;
};

export default AddParkingLot;