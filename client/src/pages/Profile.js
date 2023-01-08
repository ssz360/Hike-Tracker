import { useEffect } from 'react';
import { Row, Col, ListGroup, Container } from 'react-bootstrap';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { ProfileDashboard, ProfilePreferences } from '../components';
import ProfileHikes from '../components/profileHikes';
import React from 'react';

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
        <Container fluid>
            <Row style={{height:"100vh"}}>
                <Col sm={2} xs={12}  style={{background:"#e0e3e5"}}>
                    <Row>
                        <Col className='my-4'>
                            <h3 className="mx-auto my-2">Profile settings</h3>
                        </Col>
                    </Row>
                    <Sidebar/>
                </Col>
                <Col sm={10} xs={12} md={6} className="mx-auto mb-4">
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