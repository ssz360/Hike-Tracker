import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import API from "../lib/api";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Row } from 'react-bootstrap';

function SignUp(props){

    const navigate=useNavigate();
    const [name,setName]=useState('');
    const [surname,setSurname]=useState('');
    const [phoneNumber,setPhoneNumber]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [password2, setPassword2]=useState('');
    const [error,setError]=useState('');
    
    return(
        <> 
            <Row> Sign Up</Row>
            <Form style={
                {
                    "margin": 0,
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "msTransform": "translate(-50%, -50%)",
                    "transform": "translate(-50%, -50%)"
                }
            } onSubmit={async e=>{
                e.preventDefault();
                e.stopPropagation();
                if (password != password2){
                    console.log(password + " " + password2)
                    setError('Passwords are different');
                }
                else {
                    try {
                        //TODO: right order and fields in API
                        const usr=await API.signup(name, surname, phoneNumber, email, password);
                        props.setLogged(true);
                        navigate('/'+usr.type+'/'+usr.username);
                    } catch (error) {
                        setError("Missing backend");
                    }
                }
            }}>
                <Form.Group className="mb-3 ">
                    <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
                        <Form.Control type="text" placeholder="Insert name" name="name" required onChange={e=>setName(e.target.value)} />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FloatingLabel controlId="floatingInput" label="Surname" className="mb-3">
                        <Form.Control type="text" placeholder="Insert surname" name="surname" required onChange={p=>setSurname(p.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <FloatingLabel controlId="floatingInput" label="Phone number" className="mb-3">
                        <Form.Control type="text" placeholder="Insert phone number" name="phonenumber" required onChange={p=>setPhoneNumber(p.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicEmail">                    
                    <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                        <Form.Control type="text" placeholder="Insert email" name="email" required onChange={p=>setEmail(p.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                        <Form.Control type="text" placeholder="Insert password" name="password" required onChange={p=>setPassword(p.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FloatingLabel controlId="floatingPassword" label="Repeat password" className="mb-3">
                        <Form.Control type="text" placeholder="Repeat password" name="password2" required onClick={p=>{setError(false)}} onChange={p=>{setPassword2(p.target.value);}}/>
                    </FloatingLabel>                    
                </Form.Group>

                {error!=''?<Alert className="my-3" variant="danger">{error}</Alert>:<></>}
                <Button variant="secondary" type="submit">Submit</Button>
            </Form>
        </>

    );
}

export default SignUp;