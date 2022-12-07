import { useState } from "react";
import { Container, Row, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {Col } from 'react-bootstrap';
import api from "../lib/api";

function Login(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const [isHover, setIsHover] = useState(false);

    var emailValidator = require("node-email-validation");
    return (
        <div style={{ 
            backgroundImage: "url(./images/bg_login.jpg)",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100vh'
        }}>
          <Container fluid className="mt-5" style={{overflowY: "auto"}}>          
            <Row>
            <div className="d-flex align-items-center justify-content-center text-center not-found-container">
                <h3 className="mt-3" 
                style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
                fontWeight: "800",
                fontSize: "49px",
                color: "#0d0d0d",
                textShadow: "2px 2px 4px #cccccc"}}>Welcome back!</h3>
            </div>
            <div className="d-flex align-items-center justify-content-center text-center not-found-container">
                <h5 style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
                fontWeight: "750",
                fontSize: "20px",
                color: "#0d0d0d",
                textShadow: "2px 2px 4px #cccccc"}}>Please insert your username and password</h5>
            </div>
            </Row>
            <Row className="mt-3">
            <div className="d-flex align-items-center justify-content-center text-center not-found-container"
                style={{
                    opacity:"90%"
                }}>
                    <Form className="shadow-lg p-3 mb-5 bg-white rounded" style={{
                            width:"22%"
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
                                        navigate('/hikes');
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
                        <div className="d-grid gap-2">
                            <Button type="submit" className="rounded-pill"
                            style={{ 
                                justifyContent: 'right',
                                backgroundColor: !isHover ? '#006666' : '#009999',
                                borderColor: "white",
                                fontWeight: "670",
                                height: "45px"
                            }}
                            onMouseEnter={ () => setIsHover(true) }
                            onMouseLeave={ () => setIsHover(false) }>Log in</Button>
                        </div>
                        {error ? <Alert className="my-3" variant="danger">username or password wrong</Alert> : <></>}
                    </Form>
                    </div>
                    </Row>
        </Container></div>
    )
}

export default Login;