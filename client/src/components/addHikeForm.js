import { useState } from "react";
import { Alert, Button, Container, Form, Spinner, Row, FloatingLabel, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import ServerReply from "./serverReply";
import {CheckCircle, XCircle, ArrowLeft} from 'react-bootstrap-icons'
function AddHikeForm(props) {
    const [error, setError] = useState();
    const [success, setSuccess] = useState(false);
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState();
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState('');
    const [waiting, setWaiting] = useState(false);
    const navigate = useNavigate();
    const submitHandler = async () => {
        try {
            let err = "";
            if (!name) err += "No name was provided. ";
            if (!difficulty) err += "No difficulty was selected. "
            if (!file) err += "The track file was not provided. ";
            if (err !== "") throw err;
            setWaiting(true);
            //console.log("Trying to send an api call")
            await api.addHike(file, name, desc, difficulty);
            setWaiting(false);
            //console.log("Success in api call");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            await props.refreshHikes();
        } catch (error) {
            //console.log("Error in try catch",error);
            setWaiting(false);
            setSuccess(false);
            setError(error);
            setTimeout(() => setError(false), 3000);
        }
    }
    return (
        <>
            <div style={{
                //height: '100vh',
                backgroundImage: "url(/images/pexels-yaroslav-shuraev-8968134.jpg)",
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
                            }}>Add a new hike</h3>
                    </div>
                    <Row fluid>
                        <div className="d-flex align-items-center justify-content-center not-found-container mt-4"
                            style={{
                                opacity: "90%"
                            }}>

                            <Form className="shadow-lg p-3 mb-5 bg-white rounded " style={{ width: "40%" }}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingName" label="Hike Name" className="mb-3">
                                        <Form.Control placeholder="Insert Name" className="mx-auto" type="text" value={name} onChange={e => setName(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">

                                    <Form.Select className="mb-3" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                                        <option value={undefined}>Difficulty</option>
                                        <option value="TOURIST">Tourist</option>
                                        <option value="HIKER">Hiker</option>
                                        <option value="PROFESSIONAL HIKER">Professional Hiker</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" >

                                    <FloatingLabel controlId="floatingName" label="Hike Description" className="mb-3">
                                        <Form.Control style={{ height: "120px" }} placeholder="Insert description" className="mx-auto" as="textarea" value={desc} onChange={e => setDesc(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group controlId="formFile" className="mb-3" onChange={e => { setFileName(e.target.value); setFile(e.target.files[0]); }}>
                                    <Form.Label > <strong>Track file</strong></Form.Label>
                                    <Form.Control type="file" value={fileName} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <ServerReply error={error} success={success} waiting={waiting} errorMessage={"Error while adding a new hike"} successMessage={"New hike added correctly!"} />
                                    <div className="d-flex flex-row-reverse">
                                        <CheckCircle role="button" className="me-3"onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            submitHandler();
                                        }} type="submit" size="20px" />
                                        <XCircle role="button" className="me-3 "onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setName('');
                                            setDesc('');
                                            setDifficulty('');
                                            setFile();
                                            setFileName('');
                                            setError();
                                            setSuccess();
                                        }} size="20px" />
                                        <ArrowLeft role="button" className="me-3" onClick={() => navigate("/localGuide/hikes")}  size="20px" />
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                    </Row>
                </Container>
            </div>
        </>
    )
}


export default AddHikeForm;