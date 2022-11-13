import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import { PointMap } from '../components';

import { useState } from 'react';

function Hut() {
    const [openArea, setOpenArea] = useState(false);
    return(<>{openArea ? (<PointMap openArea={openArea} setOpenArea={setOpenArea}/>) : <></>}
        <Row className="mt-4">
            <h1>Add a new hut</h1>
        </Row>
        <Row><Col xs={6}>
            <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                <Form.Control type="text" placeholder="Name"/>
            </FloatingLabel>
            </Col>
            <Col xs={6}>
            <FloatingLabel controlId="floatingInput" label="Country" className="mb-3">
                <Form.Control type="text" placeholder="Country"/>
            </FloatingLabel>
            </Col>
        </Row>    
        <Row><Col xs={4}>
            <FloatingLabel controlId="floatingInput" label="Number of guest" className="mb-3">
                <Form.Control type="number" min={0} placeholder="NumOfGuest"/>
            </FloatingLabel>
            </Col>
            <Col xs={4}>
            <FloatingLabel controlId="floatingInput" label="Number of bedrooms" className="mb-3">
            <Form.Control type="number" min={0} placeholder="NumOfRooms"/>
            </FloatingLabel>
            </Col>
            <Col xs={4}><div className="d-grid gap-2"> 
            <Button variant="outline-dark" style={{height: "58px"}} onClick={() => setOpenArea(true)}>Select point</Button>
            </div>
            </Col>
        </Row>
        <Button>Save</Button>
    </>);
}

export default Hut;