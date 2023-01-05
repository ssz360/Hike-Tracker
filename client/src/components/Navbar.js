import React from 'react';
import { Navbar, Nav, NavDropdown, Image, Container } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';
import api from '../lib/api';

function Header(props) {
    const location = useLocation();
    const path = location.pathname;
    const iconProfile = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 2 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
        </svg>);
    const navigate = useNavigate();
    return (<>

        {/* <Navbar bg="black" variant="dark" fixed="top"> */}
        <Navbar sticky='top' collapseOnSelect bg="black" expand='md' variant="dark" >
            <Container fluid>
                {props.logged ? <>
                    <Navbar.Brand as={Link} to="/hikes">
                        <Image className="mb-1" fluid roundedCircle src={process.env.PUBLIC_URL + "/favicon.ico"} style={{ "width": "20%" }} />
                        {" HikeTracker"}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav>
                            {props.user.type === "localGuide" ? <>
                                <NavDropdown title={"Hikes"} className="px-4" style={path === "/localGuide/hikes" || path === "/hikes" || path === "/localGuide/newHike" ? { "fontWeight": "bold" } : null}>
                                    <NavDropdown.Item as={Link} to="/hikes">All hikes</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/localGuide/hikes">My hikes</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/localGuide/newHike">Add new hike</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title={"Parkings"} className="px-4" style={path === "/localGuide/parking" || path === "/localGuide/newParking" ? { "fontWeight": "bold" } : null}>
                                    <NavDropdown.Item as={Link} to="/localGuide/parking">All parking lots</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/localGuide/newParking">Add new parking lot</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title={"Huts"} className="px-4" style={path === "/hut" || path === "/localGuide/newHut" ? { "fontWeight": "bold" } : null}>
                                    <NavDropdown.Item as={Link} to="/hut" onClick={() => props.setDirty(true)}>All huts</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/localGuide/newHut">Add new hut</NavDropdown.Item>
                                </NavDropdown>
                                {/* <Nav.Link as={Link} to="/hut" style={path==="/hut" ? {"fontWeight":"bold"} : null} onClick={() => props.setDirty(true)}>Huts</Nav.Link> */}
                            </>
                                :
                                <Nav.Link as={Link} style={path === "/hut" ? { "fontWeight": "bold" } : null} to="/hut" className="px-4" onClick={() => props.setDirty(true)}>Huts</Nav.Link>
                            }
                        </Nav>
                        <Nav className="ms-auto">
                            <NavDropdown title={<>Hi, {props.user.username.substring(0, props.user.username.indexOf('@'))}! {iconProfile}</>} className="px-4" align="end">
                                <NavDropdown.Item as={Link} to="/profile/dashboard">Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/" onClick={async e => {
                                    try {
                                        await api.logout();
                                        props.setLogged(false);
                                        props.setUser();
                                    } catch (error) {
                                        navigate('/');
                                    }
                                }}>
                                    <BoxArrowRight />{" Log out"}
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </> : <>
                    <Navbar.Brand as={Link} to="/">
                        <Image className="mb-1" fluid roundedCircle src={process.env.PUBLIC_URL + "/favicon.ico"} style={{ "width": "20%" }} />
                        {" HikeTracker"}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/login" className="px-4">Sign in</Nav.Link>
                            <Nav.Link as={Link} to="/signup" className="px-4">Sign up</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </>}
            </Container>
        </Navbar>
    </>);
}

export default Header;