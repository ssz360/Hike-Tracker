import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBSelect, MDBRadio} from 'mdb-react-ui-kit';
import API from "../lib/api";

function SignUp(props){
    const navigate=useNavigate();
    const [name,setName]=useState('');
    const [surname,setSurname]=useState('');
    const [phoneNumber,setPhoneNumber]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [password2, setPassword2]=useState('');
    const [error,setError]=useState(false);
    return(
        <>
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
                //TODO: list of possible errors
                if (password2!=password) setError(true); 
                try {
                    //TODO: right order and fields in API
                    const usr=await API.signup(name, surname, phoneNumber, email, password);
                    props.setLogged(true);
                    navigate('/'+usr.type+'/'+usr.username);
                } catch (error) {
                    setError(true);
                }
            }}>
                <Form.Group  className="mb-3 ">
                    <Form.Label style={{fontWeight:"bolder"}}>Name </Form.Label>
                    <Form.Control type="text" placeholder="Insert name" name="name" required onChange={e=>setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight:"bolder"}}>Surname </Form.Label>
                    <Form.Control type="password" placeholder="Insert surname" name="surname" required onChange={p=>setSurname(p.target.value)}/>
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight:"bolder"}}>Phone number </Form.Label>
                    <Form.Control type="password" placeholder="Insert phone number" name="phonenumber" required onChange={p=>setPhoneNumber(p.target.value)}/>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{fontWeight:"bolder"}}>Email </Form.Label>
                    <Form.Control type="password" placeholder="Insert email" name="email" value={email} required onChange={p=>setEmail(p.target.value)}/>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{fontWeight:"bolder"}}>Password </Form.Label>
                    <Form.Control type="password" placeholder="Insert password" name="password" required onChange={p=>setPassword(p.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{fontWeight:"bolder"}}>Repeat password </Form.Label>
                    <Form.Control type="password" placeholder="Repeat password" name="password2" required onChange={p=>setPassword2(p.target.value)}/>
                </Form.Group>

                <Button variant="secondary" type="submit">Submit</Button>
                {error?<Alert className="my-3" variant="danger">username or password wrong</Alert>:<></>}
            </Form>
        </>

    )
}

export default SignUp;