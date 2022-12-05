import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Container } from 'react-bootstrap';
import api from "../lib/api";

function Login(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    var emailValidator = require("node-email-validation");
    return (
        <div style={{
            height: '100vh',
            backgroundImage: "url(./images/bg_signup.jpg)",
            //backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        }}>
            <Container fluid>
                <Row>
                    <div className="d-flex align-items-center justify-content-center text-center not-found-container">
                        <h3 className="mt-3"
                            style={{
                                fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
                                fontWeight: "800",
                                fontSize: "49px",
                                color: "#0d0d0d",
                                textShadow: "2px 2px 4px #cccccc"
                            }}>Welcome back!</h3>
                    </div>
                    <div className="d-flex align-items-center justify-content-center text-center not-found-container">
                        <h5 style={{
                            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
                            fontWeight: "750",
                            fontSize: "20px",
                            color: "#0d0d0d",
                            textShadow: "2px 2px 4px #cccccc"
                        }}>Please fill the form with your username and password to log in</h5>
                    </div>
                </Row>
                <Row className="mt-3">
                    <div className="d-flex align-items-center justify-content-center text-center not-found-container"
                        style={{
                            opacity: "90%"
                        }}>
                        <Form className="shadow-lg p-3 mb-5 bg-white rounded"
                            style={{
                                width: "22%"
                            }}
                            onSubmit={async e => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (!emailValidator.is_email_valid(username)) {
                                    setError('Email has a wrong format')
                                }
                                else {
                                    try {
                                        const emp = await api.login(username, password);
                                        //console.log("emp is",emp);
                                        props.setUser(emp);
                                        props.setLogged(true);
                                        navigate('/');
                                    } catch (error) {
                                        setError("Error during login");
                                    }
                                }
                            }}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                                    <Form.Control type="text" placeholder="insert username" name="username" required value={username} onChange={e => setUsername(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">

                                    <Form.Control type="password" placeholder="insert password" name="password" required onChange={p => setPassword(p.target.value)} />
                                </FloatingLabel>
                            </Form.Group>
                            <Button variant="secondary" type="submit">Submit</Button>
                            {error ? <Alert className="my-3" variant="danger">username or password wrong</Alert> : <></>}

                        </Form>
                    </div>
                </Row>
            </Container></div>
    );
    // return (
    //     <Col>
    //         <Row>
    //             <br></br><br></br>
    //         </Row>
    //         <h3>Welcome back!</h3>
    //         <h5>Please insert your username and password</h5>
    //         <Row>
    //             <Col>
    //                 <Form style={
    //                     {
    //                         "margin": 0,
    //                         "position": "absolute",
    //                         "top": "50%",
    //                         "left": "50%",
    //                         "msTransform": "translate(-50%, -50%)",
    //                         "transform": "translate(-50%, -50%)"
    //                     }
    //                 } onSubmit={async e => {
    //                     e.preventDefault();
    //                     e.stopPropagation();

    //                     if (!emailValidator.is_email_valid(username)) {
    //                         setError('Email has a wrong format')
    //                     }
    //                     else {
    //                         try {
    //                             const emp = await api.login(username, password);
    //                             //console.log("emp is",emp);
    //                             props.setUser(emp);
    //                             props.setLogged(true);
    //                             navigate('/');
    //                         } catch (error) {
    //                             setError("Error during login");
    //                         }
    //                     }
    //                 }}>
    //                     <Form.Group className="mb-3" controlId="formBasicEmail">
    //                         <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
    //                             <Form.Control type="text" placeholder="insert username" name="username" required value={username} onChange={e => setUsername(e.target.value)} />
    //                         </FloatingLabel>
    //                     </Form.Group>
    //                     <Form.Group className="mb-3" controlId="formBasicPassword">
    //                         <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">

    //                             <Form.Control type="password" placeholder="insert password" name="password" required onChange={p => setPassword(p.target.value)} />
    //                         </FloatingLabel>
    //                     </Form.Group>
    //                     <Button variant="secondary" type="submit">Submit</Button>
    //                     {error ? <Alert className="my-3" variant="danger">username or password wrong</Alert> : <></>}
    //                 </Form>
    //             </Col>
    //         </Row>
    //     </Col>
    // )
}

export default Login;