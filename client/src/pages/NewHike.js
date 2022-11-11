import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';

function NewHike() {
    return(<>
        <Row className="mt-4">
            <h1>Add a new hike</h1>
        </Row>
        <Row className="mt-2 mb-4">
            <FloatingLabel label="Name">
                <Form.Control type="text"/>
            </FloatingLabel>
        </Row>
        <Row className="mb-4">
            <FloatingLabel label="Description">
                <Form.Control as="textarea" style={{height:"160px"}}/>
            </FloatingLabel>
        </Row>
        <Row className="mt-4 mb-4">
        <Col xs={8}>    
            <FloatingLabel label="Area">
                <Form.Control type="text"/>
            </FloatingLabel>
        </Col>
        <Col xs={4}>    
            <FloatingLabel label="Difficulty">
            <Form.Select aria-label="Default select example">
                <option value="Tourist">Tourist</option>
                <option value="Hiker">Hiker</option>
                <option value="Professional Hiker">Professional Hiker</option>
            </Form.Select>
            </FloatingLabel>
        </Col>
        </Row>
        <Row className="mt-4 mb-4">
        <Col xs={4}>    
            <FloatingLabel label="Length (kilometers)">
                <Form.Control type="text"/>
            </FloatingLabel>
        </Col>
        <Col xs={4}>    
            <FloatingLabel label="Ascent (meters)">
                <Form.Control type="text"/>
            </FloatingLabel>
        </Col>
        <Col xs={4}>    
            <FloatingLabel label="Expected time (hours)">
                <Form.Control type="text"/>
            </FloatingLabel>
        </Col>
        </Row>
        <Button>Save</Button>
    </>);
}

export default NewHike;