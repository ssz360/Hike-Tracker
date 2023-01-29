import { useState } from "react";
import { Container, Row, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import api from "../lib/api";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [success, ] = useState('');

    const [isHover, setIsHover] = useState(false);

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
    <div style={{ 
        backgroundImage: "url(./images/bg_signup.jpg)",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        minHeight: '100vh'
    }}>
      <Container fluid style={{overflowY:"auto"}}>          
            <Row>
            <div className="d-flex align-items-center justify-content-center text-center not-found-container">
            <h3 className="mt-3" 
                style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
                fontWeight: "800",
                fontSize: "49px",
                color: "#0d0d0d",
                textShadow: "2px 2px 4px #cccccc"}}>Welcome on board!</h3>
            </div>
            <div className="d-flex align-items-center justify-content-center text-center not-found-container">
            <h5 style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
                fontWeight: "750",
                fontSize: "20px",
                color: "#0d0d0d",
                textShadow: "2px 2px 4px #cccccc"}}>Please fill the form to get the best experience from our app</h5>
            </div>
            </Row>
            <Row className="mt-3">
            <div className="d-flex align-items-center justify-content-center text-center not-found-container"
                style={{
                    opacity:"90%"
                }}>
                    <Form className="shadow-lg p-3 mb-5 bg-white rounded" 
                        style={{
                            width:"22%"
                        }}
                        onSubmit={async e => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (password !== password2) {
                            //console.log(password + " " + password2)
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
                                await api.register(email, password, name, surname, phoneNumber);
                                navigate('/CheckEmail');
                            } catch (error) {
                                if (error.toString().includes("SyntaxError"))
                                    setError("This email is already registered");
                                else 
                                    setError("Internal server error. Please try again later")
                            }
                        }
                    }}>
                        <Form.Group className="mb-3 ">
                            <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
                                <Form.Control type="text" placeholder="Insert name" name="name" required onClick={p => { setError(false) }} onChange={e => setName(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingSurname" label="Surname" className="mb-3">
                                <Form.Control type="text" placeholder="Insert surname" name="surname" required onClick={p => { setError(false) }} onChange={p => setSurname(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingPhone" label="Phone number" className="mb-3">
                                <Form.Control type="text" placeholder="Insert phone number" name="phonenumber" required onClick={p => { setError(false) }} onChange={p => setPhoneNumber(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                                <Form.Control type="text" placeholder="Insert email" name="email" required onClick={p => { setError(false) }} onChange={p => setEmail(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                <Form.Control type="password" placeholder="Insert password" name="password" required onClick={p => { setError(false) }} onChange={p => setPassword(p.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                            <FloatingLabel controlId="floatingPassword2" label="Repeat password" className="mb-3">
                                <Form.Control type="password" placeholder="Repeat password" name="password2" required onClick={p => { setError(false) }} onChange={p => { setPassword2(p.target.value); }} />
                            </FloatingLabel>
                        </Form.Group>

                        
                        {success !== '' && <Alert className="my-3" variant="success">{error}</Alert>}
                        <div className="d-grid gap-2">
                            <Button type="submit"  className="rounded-pill"
                                style={{ 
                                    justifyContent: 'right',
                                    backgroundColor: !isHover ? '#006666' : '#009999',
                                    borderColor: "white",
                                    fontWeight: "670",
                                    height: "45px"
                                }}
                                onMouseEnter={ () => setIsHover(true) }
                                onMouseLeave={ () => setIsHover(false) }>Sign up</Button>
                        </div>
                        <div className="mt-3">Already have an account? <a href="/login">Log in</a></div>
                    </Form>
                    </div>
                    </Row>
        </Container></div>
    );
}

export default SignUp;