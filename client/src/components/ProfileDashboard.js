import { useState, useEffect } from 'react';
import { Row, Col, Form, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const types={'localGuide':'Local guide','hiker':'Hiker','hutWorker':'Hut worker','friend':'Friend'};

function Dashboard() {
    // const [user,setUser] = useState();
    const [username,setUsername] = useState("");
    const [role,setRole] = useState("");
    const [name,setName] = useState("");
    const [surname,setSurname] = useState("");
    const [phoneNumber,setPhoneNumber] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const res = await api.isLogged();
            // setUser(res);
            setUsername(res.username.substring(0,res.username.indexOf('@')));
            setRole(types[res.type]);
            setName(res.name);
            setSurname(res.surname);
            setPhoneNumber(res.phonenumber);
        }
        getUser();
    },[]);
    
    const iconProfile = (<p>
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
    </p>);

    return(<>
        <Row>
            <Col>
                <h1 className="my-4">Dashboard</h1>
            </Col>
        </Row>
        {iconProfile}
        <Form className="my-2">
            <Form.Group className="mb-3" controlId="InputName">
                <Form.Label><b>Username</b></Form.Label>
                <Form.Control disabled type="text" value={username}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label><b>Role</b></Form.Label>
                <Form.Control disabled type="text" value={role}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label><b>First name</b></Form.Label>
                <Form.Control disabled type="text" value={name}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label><b>Surname</b></Form.Label>
                <Form.Control disabled type="text" value={surname}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="InputName">
                <Form.Label><b>Phone number</b></Form.Label>
                <Form.Control disabled type="text" value={phoneNumber}/>
            </Form.Group>
        </Form>
    </>);
}

export default Dashboard;