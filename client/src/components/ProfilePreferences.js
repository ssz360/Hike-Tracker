import { useState, useEffect } from 'react';
import {Row, Col, InputGroup, Card, Button } from 'react-bootstrap';
import api from '../lib/api';
import { MultiRangeSliderHooked } from '.';

function Preferences() {
    const [lenMin, setLenMin] = useState(0);
    const [lenMax, setLenMax] = useState(40);
    const [ascMin, setAscMin] = useState(0);
    const [ascMax, setAscMax] = useState(4000);
    const [timeMin, setTimeMin] = useState(0);
    const [timeMax, setTimeMax] = useState(24);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const getPreferences = async () => {
            const prefs = await api.getPreferences();
            setLenMax(prefs.length);
            setAscMax(prefs.ascent);
            setTimeMax(prefs.time);
            setSaved(true);
            console.log(prefs)
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
                    <MultiRangeSliderHooked
                        defaultMin={0}
                        defaultMax={40}
                        min={lenMin}
                        max={lenMax}
                        setMin={setLenMin}
                        setMax={setLenMax}
                    />
                </InputGroup>
            </Row>
            <Row className="mb-3">
                <Col><strong>Preferred ascent</strong>: {ascMax}</Col>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    <MultiRangeSliderHooked
                        defaultMin={0}
                        defaultMax={4000}
                        min={ascMin}
                        max={ascMax}
                        setMin={setAscMin}
                        setMax={setAscMax}
                    />
                </InputGroup>
            </Row>
            <Row className="mb-3">
                <Col><strong>Preferred time expected</strong>: {timeMax}</Col>
            </Row>
            <Row className="mb-4">
                <InputGroup className="mb-4">
                    <MultiRangeSliderHooked
                        defaultMin={0}
                        defaultMax={24}
                        min={timeMin}
                        max={timeMax}
                        setMin={setTimeMin}
                        setMax={setTimeMax}
                    />
                </InputGroup>
            </Row>
        </Card>
        <Row>
            <Col>
                <Button data-test="save-btn" variant="success" onClick={handleSubmit} disabled={saved}>{saved ? "Saved!" : "Save"}</Button>
            </Col>
        </Row>        
    </>);
}

export default Preferences;