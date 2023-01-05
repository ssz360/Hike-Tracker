import { useState, useEffect } from 'react';
import { Row, Col, Form, ListGroup, Container } from 'react-bootstrap';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { ProfileDashboard, ProfilePreferences } from '../components';
import ProfileHikes from '../components/profileHikes';

function Sidebar() {

    const location = useLocation();
    const path = location.pathname;

    return(
        <ListGroup variant="flush">
            <ListGroup.Item action as={Link} to="/profile/dashboard" style={path==="/profile/dashboard" ? {"fontWeight":"bold"} : null}>Dashboard</ListGroup.Item>
            <ListGroup.Item action as={Link} to="/profile/preferences" style={path==="/profile/preferences" ? {"fontWeight":"bold"} : null}>Preferences</ListGroup.Item>
            <ListGroup.Item action as={Link} to="/profile/hikes" style={path==="/profile/hikes" ? {"fontWeight":"bold"} : null}>My hikes</ListGroup.Item>
        </ListGroup>
    );
}

function Profile(props) {

    useEffect(() => {
    },[]);

    return(<>
        {/* <Row className="px-0 mx-0 ">
            <Col>
                <h1 className="mx-4 my-4">Profile settings</h1>
            </Col>
        </Row> */}
        <Container fluid>
            <Row style={{height:"100vh"}}>
                <Col xs={12} sm={2} style={{background:"#e0e3e5"}}>
                    <Row>
                        <Col>
                            <h3 className="mx-auto my-2">Profile settings</h3>
                        </Col>
                    </Row>
                    <Sidebar/>
                </Col>
                <Col xs={12} sm={10} className="mx-auto mb-4">
                    <Routes>
                        <Route path="/dashboard" element={<ProfileDashboard/>}/>
                        <Route path="/preferences" element={<ProfilePreferences/>}/>
                        <Route path='/hikes' element={<ProfileHikes hikes={props.hikes}/>}/>
                    </Routes>
                </Col>
            </Row>
        </Container>
    </>);
}

export default Profile;