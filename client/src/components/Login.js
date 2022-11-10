import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import API from "../lib/api";

function Login(props){
    const navigate=useNavigate();
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
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
                try {
                    const emp=await API.login(username,password);
                    props.setLogged(true);
                    navigate('/'+emp.type+'/'+emp.username);
                } catch (error) {
                    setError(true);
                }
            }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{fontWeight:"bolder"}}>Username : </Form.Label>
                    <Form.Control type="text" placeholder="insert username" name="username" required value={username} onChange={e=>setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{fontWeight:"bolder"}}>Password : </Form.Label>
                    <Form.Control type="password" placeholder="insert password" name="password" required onChange={p=>setPassword(p.target.value)}/>
                </Form.Group>
                <Button variant="success" type="submit">Submit</Button>
                {error?<Alert className="my-3" variant="danger">username or password wrong</Alert>:<></>}
            </Form>
        </>

    )
}

export default Login;