import { useState, useEffect } from 'react';
import { Form, Row, Col, InputGroup, Card, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';
import { MultiRangeSlider } from './';

function Preferences() {
    const [lenMin, setLenMin] = useState();
    const [lenMax, setLenMax] = useState(0);
    const [ascMin, setAscMin] = useState();
    const [ascMax, setAscMax] = useState(0);
    const [timeMin, setTimeMin] = useState();
    const [timeMax, setTimeMax] = useState(0);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const getPreferences = async () => {
            const prefs = await api.getPreferences();
            setLenMax(prefs.length);
            setAscMax(prefs.ascent);
            setTimeMax(prefs.time);
            setSaved(true);
        }
        getPreferences();
    },[]);

    useEffect(() => {
        setSaved(false);
    },[lenMax,ascMax,timeMax]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const prefs = {
            "length": lenMax,
            "ascent": ascMax,
            "time": timeMax
        };
        await api.addPreferences(prefs);
        setSaved(true);
    }
    
    return(<>
        <Row>
            <Col>
                <h1 className="my-4">Preferences</h1>
            </Col>
        </Row>
        <Card className="p-3 pe-4 mb-4">
            <Row className="mb-3">
                <Col><strong>Preferred length</strong>: {lenMax}</Col>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    {/* <MultiRangeSlider
                        min={0}
                        max={40}
                        onChange={({ min, max }) => {setLenMin(min); setLenMax(max);}}
                    /> */}
                    <Form.Label>0</Form.Label>
                    <Form.Label className="ms-auto">40</Form.Label>
                    {/* <OverlayTrigger placement="top" overlay={<Tooltip>{lenMax}</Tooltip>}> */}
                        <Form.Range min={0} max={40} value={lenMax} onChange={(val) => setLenMax(val.target.value)} title={lenMax}/>
                    {/* </OverlayTrigger> */}
                </InputGroup>
            </Row>
            <Row className="mb-3">
                <Col><strong>Preferred ascent</strong>: {ascMax}</Col>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    {/* <MultiRangeSlider
                        min={0}
                        max={4000}
                        onChange={({ min, max }) => {setAscMin(min); setAscMax(max);}}
                    /> */}
                    <Form.Label>0</Form.Label>
                    <Form.Label className="ms-auto">4000</Form.Label>
                    {/* <OverlayTrigger placement="top" overlay={<Tooltip>{ascMax}</Tooltip>}> */}
                        <Form.Range min={0} max={4000} step={50} value={ascMax} onChange={(val) => setAscMax(val.target.value)} title={ascMax}/>
                    {/* </OverlayTrigger> */}
                </InputGroup>
            </Row>
            <Row className="mb-3">
                <Col><strong>Preferred time expected</strong>: {timeMax}</Col>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    {/* <MultiRangeSlider
                        min={0}
                        max={15}
                        onChange={({ min, max }) => {setTimeMin(min); setTimeMax(max);}}
                    /> */}
                    <Form.Label>0</Form.Label>
                    <Form.Label className="ms-auto">15</Form.Label>
                    {/* <OverlayTrigger placement="top" overlay={<Tooltip>{timeMax}</Tooltip>}> */}
                        <Form.Range min={0} max={15} value={timeMax} onChange={(val) => setTimeMax(val.target.value)} title={timeMax}/>
                    {/* </OverlayTrigger> */}
                </InputGroup>
            </Row>
        </Card>
        <Row>
            <Col>
                <Button variant="success" onClick={handleSubmit} disabled={saved}>{saved ? "Saved!" : "Save"}</Button>
            </Col>
        </Row>        
    </>);
}

export default Preferences;