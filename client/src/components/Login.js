import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import API from "../lib/api";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col } from 'react-bootstrap';

function Login(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    var emailValidator = require("node-email-validation");

    return (
        <Col>
            <Row>
                <br></br><br></br>
            </Row>
            <h3>Welcome back!</h3>
            <h5>Please insert your username and password</h5>
            <Row>
                <Col>
                    <Form style={
                        {
                            "margin": 0,
                            "position": "absolute",
                            "top": "50%",
                            "left": "50%",
                            "msTransform": "translate(-50%, -50%)",
                            "transform": "translate(-50%, -50%)"
                        }
                    } onSubmit={async e => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!emailValidator.is_email_valid(username)) {
                            setError('Email has a wrong format')
                        }
                        else {
                            try {
                                const usr = await API.login(username, password);
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
                </Col>
            </Row>
        </Col>
    )
}

export default Login;