import { Row, Form, FloatingLabel, Button } from 'react-bootstrap';

function ParkingLot() {
    return(<>
        <Row className="mt-4">
            <h1>Describe the parking lot</h1>
        </Row>
        <Row className="mt-2 mb-4">
            <FloatingLabel label="Title">
                <Form.Control type="text"/>
            </FloatingLabel>
        </Row>
        <Row className="mb-4">
            <FloatingLabel label="Description">
                <Form.Control as="textarea" style={{height:"160px"}}/>
            </FloatingLabel>
        </Row>
        <Button>Save</Button>
    </>);
}

export default ParkingLot;