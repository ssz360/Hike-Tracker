import { useState, useEffect } from 'react';
import { Form, Row, Col, InputGroup, Card, Button } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';
import { MultiRangeSlider } from './';

function Preferences() {
    const [lenMin, setLenMin] = useState();
    const [lenMax, setLenMax] = useState();
    const [ascMin, setAscMin] = useState();
    const [ascMax, setAscMax] = useState();
    const [timeMin, setTimeMin] = useState();
    const [timeMax, setTimeMax] = useState();

    useEffect(() => {
    },[]);
    
    return(<>
        <Card className="p-3 pe-4 mb-4">
            <Row className="mb-3">
                <strong>Preferred length</strong>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    <MultiRangeSlider
                        min={0}
                        max={40}
                        onChange={({ min, max }) => {setLenMin(min); setLenMax(max);}}
                    />
                </InputGroup>
            </Row>
            <Row className="mb-3">
                <strong>Preferred ascent</strong>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    <MultiRangeSlider
                        min={0}
                        max={4000}
                        onChange={({ min, max }) => {setAscMin(min); setAscMax(max);}}
                    />
                </InputGroup>
            </Row>
            <Row className="mb-3">
                <strong>Preferred time expected</strong>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    <MultiRangeSlider
                        min={0}
                        max={15}
                        onChange={({ min, max }) => {setTimeMin(min); setTimeMax(max);}}
                    />
                </InputGroup>
            </Row>
        </Card>
        <Row>
            <Col>
                <Button variant="success">Save</Button>
            </Col>
        </Row>
                            
        <div className="mt-2">
            <Row className="justify-content-md-center">
                <Col xs={4}>
                </Col>
                <Col xs={4}>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={4}>
                </Col>
                <Col xs={4}> 
                    <Form>
                        <div className="d-grid gap-2">
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
        
    </>);
}

export default Preferences;