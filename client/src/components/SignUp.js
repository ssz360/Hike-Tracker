import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import API from "../lib/api";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row, Col } from 'react-bootstrap';


function SignUp(props) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [type, setType] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');

    var emailValidator = require("node-email-validation");

    var passwordValidator = require('password-validator');
    var schema = new passwordValidator();
    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits(1)                                // Must have at least 2 digits
        .has().symbols(1)
        .has().not().spaces();                          // Should not have spaces


    return (
        <Col>
            <Row>
                <br></br><br></br>
            </Row>
            <h3>Welcome on board!</h3>
            <h5>Please fill the form to get the best experience from our app</h5>
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

                        if (password !== password2) {
                            console.log(password + " " + password2)
                            setError('Passwords are different');
                        }

                        else if (!phoneNumber.match(/^[0-9]+$/)) {
                            setError('Phone number is incorrect')
                        }

                        else if (!emailValidator.is_email_valid(email)) {
                            setError('Email is incorrect')
                        }

                        else if (!name.match(/^[a-zA-Z]+[a-zA-Z]+$/)) {
                            setError('Name is incorrect')
                        }

                        else if (!surname.match(/^[a-zA-Z]+[a-zA-Z]+$/)) {
                            setError('Surname is incorrect')
                        }

                        else if (!schema.validate(password)) {
                            setError('The minimum password length is 8 characters and must contain al least 1 capital letter, 1 lowercase letter, 1 special character and 1 number')
                        }

                        else {
                            try {
                                const usr = await API.signup(email, password, name, surname, phoneNumber);
                                props.setLogged(true);
                                navigate('/' + usr.type + '/' + usr.username);
                            } catch (error) {
                                setError("Missing backend");
                            }
                        }
                    }}>
                        <Form.Group className="mb-3 ">
                            <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
                                <Form.Control type="text" placeholder="Insert name" name="name" required onClick={p => { setError(false) }} onChange={e => setName(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Surname" className="mb-3">
                                <Form.Control type="text" placeholder="Insert surname" name="surname" required onClick={p => { setError(false) }} onChange={p => setSurname(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Phone number" className="mb-3">
                                <Form.Control type="text" placeholder="Insert phone number" name="phonenumber" required onClick={p => { setError(false) }} onChange={p => setPhoneNumber(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                                <Form.Control type="text" placeholder="Insert email" name="email" required onClick={p => { setError(false) }} onChange={p => setEmail(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                <Form.Control type="password" placeholder="Insert password" name="password" required onClick={p => { setError(false) }} onChange={p => setPassword(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <FloatingLabel controlId="floatingPassword" label="Repeat password" className="mb-3">
                                <Form.Control type="password" placeholder="Repeat password" name="password2" required onClick={p => { setError(false) }} onChange={p => { setPassword2(p.target.value); }} />
                            </FloatingLabel>
                        </Form.Group>

                        {error != '' ? <Alert className="my-3" variant="danger">{error}</Alert> : <></>}
                            <Button style={{ justifyContent: 'right'}} variant="secondary" type="submit">Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Col>
    );
}

export default SignUp;