import { Row, Form, FloatingLabel, Button } from 'react-bootstrap';

function ParkingLot() {
    return(<>
        <Row className="mt-4">
            <h1>Describe the parking lot</h1>
        </Row>
            <FloatingLabel controlId="floatingInput" label="Title" className="mb-3">
                <Form.Control type="text" placeholder="Title"/>
            </FloatingLabel>
            <FloatingLabel controlId="floatingTextarea" label="Description" className="mb-3">
                <Form.Control as="textarea" placeholder="Description" style={{height:"160px"}}/>
            </FloatingLabel>
        <Button>Save</Button>
    </>);
}

export default ParkingLot;