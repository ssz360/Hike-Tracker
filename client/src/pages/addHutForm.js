import { Row, Col, Form, FloatingLabel, Button, Alert, Container } from 'react-bootstrap';
import { PointMap } from '../components';
import services from '../lib/services';
import { CheckCircle, GeoFill, XCircle } from 'react-bootstrap-icons'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServerReply from "../components/serverReply";

function AddHutForm(props) {
    const [openArea, setOpenArea] = useState(false);
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [numBeds, setNumBeds] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [coord, setCoord] = useState();
    const [message, setMessage] = useState("");
    const [err, setErr] = useState();
    const [done, setDone] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const navigate = useNavigate();
    var emailValidator = require("node-email-validation");

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            if (validateInfo(name, numBeds, coord, phone, email, website, setErr, emailValidator)) {
                setWaiting(true);
                props.newHut(name, description, country, numBeds, coord, phone, email, website);
                setWaiting(false);
                setDone(true);
                setTimeout(() => setDone(false), 3000);
                resetFields();
            }
            else {
                //setErr(err);
                setTimeout(() => setErr(false), 3000);
            }
        } catch(err) {
            console.log(err);
            setWaiting(false);
            setDone(false);
            setErr(err);
            setTimeout(() => setErr(false), 3000);
        }

    }
    
    const resetFields = () => {
        setName("");
        setDescription("");
        setCountry("");
        setNumBeds("");
        setCoord();
        setPhone("");
        setEmail("");
        setWebsite("");
    }

    const setCoordinateAndGetCountry = (coordinate) => {
        setCoord(coordinate);
        services.GetAddressFromPoint(coordinate[0], coordinate[1]).then(x => setCountry(`${x.address.country}`.replace('undefined','')));
    }

    return (<>
        <div style={{
            backgroundImage: "url(/images/pexels-arianna-tavaglione-5771589.jpg)",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: "100%"
        }}>
            <Container fluid >
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
                        {openArea ? (<PointMap openArea={openArea} setOpenArea={setOpenArea} setCoord={setCoordinateAndGetCountry} coord={coord} />) : <></>}


                        {/* FORM */}
                        <Form className="shadow-lg p-3 mb-5 bg-white rounded" style={{ width: "40%" }}>

                            {/* Hut name */}
                            <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                                <Form.Control type="text" placeholder="Name" value={name} onClick={() => setErr(false)} onChange={(event) => setName(event.target.value)} />
                            </FloatingLabel>
                            
                            {/* Hut name */}
                            <FloatingLabel controlId="floatingInput" label="Description" className="mb-3">
                                <Form.Control as="textarea" placeholder="Name" value={description} onClick={() => setErr(false)} onChange={(event) => setDescription(event.target.value)} style={{ height: "120px" }} />
                            </FloatingLabel>

                            {/* Number of rooms */}
                            <FloatingLabel controlId="floatingInput" label="Number of bedrooms" className="mb-3">
                                <Form.Control type="number" min={0} placeholder="NumOfRooms" value={numBeds} onClick={() => setErr(false)} onChange={(event) => setNumBeds(event.target.value)} />
                            </FloatingLabel>
                            
                            {/* Phone*/}
                            <FloatingLabel controlId="floatingInput" label="Phone number" className="mb-3">
                                <Form.Control type="text" placeholder="phone" value={phone} onClick={() => setErr(false)} onChange={(event) => setPhone(event.target.value)} />
                            </FloatingLabel>
                            
                            {/* Email */}
                            <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                                <Form.Control type="text" placeholder="email" value={email} onClick={() => setErr(false)} onChange={(event) => setEmail(event.target.value)} />
                            </FloatingLabel>
                            
                            {/* Number of rooms */}
                            <FloatingLabel controlId="floatingInput" label="Website" className="mb-3">
                                <Form.Control type="text" placeholder="website" value={website} onClick={() => setErr(false)} onChange={(event) => setWebsite(event.target.value)} />
                            </FloatingLabel>


                            <Alert role="button" variant="light" 
                                style={
                                    { backgroundColor: "#FFFFFF", 
                                    border: "1px solid #ced4da", 
                                    color: "#000000" 
                                    }
                                } onClick={() => setOpenArea(true)}>
                                <GeoFill className="me-3 mb-1" />
                                {coord !== undefined ? "Position selected!" : "Position"}
                            </Alert>

                            


                            {/* ERROR HANDLING */}
                            <ServerReply error={err} success={done} waiting={waiting} errorMessage={"Error while adding a new hut"} successMessage={"New hut added correctly!"} />

                            
                            {/* BUTTONS */}
                            <div className="d-flex flex-row-reverse">
                                <CheckCircle role="button" className="me-3" onClick={(handleSubmit)} type="submit" size="20px" />
                                <XCircle role="button" className="me-3 " onClick={resetFields} variant="outline-secondary" size="20px" />
                                {/* <ArrowLeft role="button" className="me-3" onClick={() => navigate("/hut")}  size="20px" /> */}
                            </div>
                        </Form>
                    </div>
                </Row>
            </Container>
        </div>
    </>);
}

function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

const validateInfo = (name, numberOfBedrooms, coordinate, phone, email, website, setErr, emailValidator) => {

    if ([name, numberOfBedrooms, coordinate, phone, email].some(t => t === "" || t === undefined)) {
        setErr("All fields should be filled");
        return false;
    }
    if (name.match(/^\s+$/)) {
        console.log("Hut name")
        setErr("Invalid hut name.");
        return false;
    }
    
    if (!emailValidator.is_email_valid(email)) {
        console.log("Email")
        setErr('Email is incorrect.')
        return false;

    }

    if(!isValidUrl(website) && website!==""){
        console.log("Website")
        setErr("Invalid website.")
        return false;

    }
    
    if (!phone.match(/^[0-9]+$/)) {
        console.log("Phone")
        setErr('Phone number is incorrect')
        return false;

    }
    /*
    if (!(coordinate.split(",").length === 2 && coordinate.split(",").every(t => t.match(/^([0-9]*[.])?[0-9]+$/)))) {
        setErr("The coordinates should be two numbers separated by comma");
        return false;
    }*/

    return true;
};

export default AddHutForm;