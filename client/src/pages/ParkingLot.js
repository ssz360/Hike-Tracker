import { Row, Form, Button } from 'react-bootstrap';

function ParkingLot() {
    return(<>
        <Row className="mt-4">
            <h1>Describe the parking lot</h1>
        </Row>
        <Row className="mt-2 mb-4">
            <Form.Control as="textarea"/>
        </Row>
        <Button>Save</Button>
    </>);
}

export default ParkingLot;