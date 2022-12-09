import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../lib/api';

function Header(props) {
    const location = useLocation();
    const path = location.pathname;
    const iconLogo = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5l-4.777-3.947z" />
        </svg>
    );
    const iconProfile = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 2 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>);
    const navigate = useNavigate();
    return (<>
        
        {/* <Navbar bg="black" variant="dark" fixed="top"> */}
        <Navbar bg="black" variant="dark" >
            {props.logged ? <> <Navbar.Brand as={Link} to="/hikes" className="px-4">
                <Image className="mb-1" fluid roundedCircle src={process.env.PUBLIC_URL + "/favicon.ico"} style={{"width":"20%"}}/>
                {" HikeTracker"}
            </Navbar.Brand>
                <Nav>
                    {props.user.type === "localGuide" && <>
                        <Nav.Link as={Link} to="/localGuide/hikes" style={path==="/localGuide/hikes" ? {"fontWeight":"bold"} : null}>My hikes</Nav.Link>
                        <Nav.Link as={Link} to="/localGuide/parking" style={path==="/localGuide/parking" ? {"fontWeight":"bold"} : null}>Parking</Nav.Link>
                    </>}
                    <Nav.Link as={Link} to="/hut" style={path==="/hut" ? {"fontWeight":"bold"} : null} onClick={() => props.setDirty(true)}>Huts</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                    <NavDropdown title={<>Hi, {"username! "} {iconProfile}</>} className="px-4" align="end">
                        <NavDropdown.Item as={Link} to="/profile/dashboard">Profile</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item as={Link} to="/" onClick={async e => {
                            try {
                                await api.logout();
                                props.setLogged(false);
                                props.setUser();
                            } catch (error) {
                                navigate('/');
                            }
                        }}>Log out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </> : <Nav>
             <Navbar.Brand as={Link} to="/" className="px-4">
             <Image className="mb-1" fluid roundedCircle src={process.env.PUBLIC_URL + "/favicon.ico"} style={{"width":"20%"}}/>
             {" HikeTracker"}
         </Navbar.Brand>
            
                <Nav.Link as={Link} to="/login" className="px-4">Sign in</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="px-4">Sign up</Nav.Link>
            </Nav>}
        </Navbar>
    </>);
}

export default Header;