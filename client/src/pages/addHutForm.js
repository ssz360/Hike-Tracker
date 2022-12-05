import { Row, Col, Form, FloatingLabel, Button, Alert, Container } from 'react-bootstrap';
import { PointMap } from '../components';
import { Upload, GeoFill } from 'react-bootstrap-icons'
import { useState } from 'react';

function AddHutForm(props) {
    const [openArea, setOpenArea] = useState(false);
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [numGuests, setNumGuests] = useState("");
    const [numBeds, setNumBeds] = useState("");
    const [coord, setCoord] = useState();
    const [message, setMessage] = useState("");
    const [err, setErr] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateInfo(name, country, numGuests, numBeds, coord, setMessage)) {
            props.newHut(name, country, numGuests, numBeds, coord);
            setDone(true);
        }
        else {
            setErr(true);
        }

    }

    return (<>
        <div style={{
            backgroundImage: "url(/images/pexels-arianna-tavaglione-5771589.jpg)",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100vh',
            overflowY: 'hidden'
            //height: "100%"
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
                        }}>Add a new hut</h3>
                </div>
                <Row>
                    <div className="d-flex align-items-center justify-content-center not-found-container mt-4"
                        style={{
                            opacity: "90%"
                        }}>
                        {/* MAP */}
                        {openArea ? (<PointMap openArea={openArea} setOpenArea={setOpenArea} setCoord={setCoord} coord={coord} />) : <></>}


                        {/* FORM */}
                        <Form className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: "40%"}}>
                            
                            {/* Hut name */}
                            <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                                <Form.Control type="text" placeholder="Name" value={name} onClick={() => setErr(false)} onChange={(event) => setName(event.target.value)} />
                            </FloatingLabel>

                            {/* Country */}
                            <FloatingLabel controlId="floatingInput" label="Country" className="mb-3">
                                <Form.Control type="text" placeholder="Country" value={country} onClick={() => setErr(false)} onChange={(event) => setCountry(event.target.value)} />
                            </FloatingLabel>
                            
                            {/* Number of guests */}
                            <FloatingLabel controlId="floatingInput" label="Number of guest" className="mb-3">
                                <Form.Control type="number" min={0} placeholder="NumOfGuest"
                                    value={numGuests} onClick={() => setErr(false)} onChange={(event) => setNumGuests(event.target.value)} />
                            </FloatingLabel>

                            {/* Number of rooms */}
                            <FloatingLabel controlId="floatingInput" label="Number of bedrooms" className="mb-3">
                                <Form.Control type="number" min={0} placeholder="NumOfRooms" value={numBeds} onClick={() => setErr(false)} onChange={(event) => setNumBeds(event.target.value)} />
                            </FloatingLabel>

                            {/* ERROR HANDLING */}
                            {err && <Alert variant="danger" onClose={() => setErr(false)} dismissible>{message}</Alert>}

                            {/* HUT SUCCESSFULLY ADDED */}
                            {done && <Alert variant="success" onClose={() => setDone(false)} dismissible>Hut successfully added!</Alert>}

                            {/* BUTTONS */}
                            <div className="d-flex flex-row-reverse">
                                <Upload role="button" className="me-3" onClick={(handleSubmit)} type="submit" size="20px" />
                                <GeoFill role="button" className="me-3 " variant="outline-dark" onClick={() => setOpenArea(true)} size="20px">Select point</GeoFill>
                            </div>
                        </Form>
                    </div>
                </Row>
            </Container>
        </div>
    </>);
}

const validateInfo = (name, country, numberOfGuests, numberOfBedrooms, coordinate, setMessage) => {
    if ([name, country, numberOfGuests, numberOfBedrooms, coordinate, setMessage].some(t => t.length === 0)) {
        setMessage("All fields should be filled");
        return false;
    }
    if (name.match(/^\s+$/)) {
        setMessage("Invalid hut name.");
        return false;
    }
    if (!country.match(/^[a-zA-Z]+[a-zA-Z]+$/)) {
        setMessage("Invalid country name.");
        return false;
    }
    /*
    if (!(coordinate.split(",").length === 2 && coordinate.split(",").every(t => t.match(/^([0-9]*[.])?[0-9]+$/)))) {
        setMessage("The coordinates should be two numbers separated by comma");
        return false;
    }*/

    return true;
};

export default AddHutForm;