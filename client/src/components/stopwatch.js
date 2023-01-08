import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
import { Button, Col, OverlayTrigger, Row, Tooltip, Modal, Container } from 'react-bootstrap';
import Flatpickr from "react-flatpickr";
import React from 'react';
import api from "../lib/api";
import ServerReply from '../components/serverReply';

dayjs.extend(duration);

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    return "M " + start.x + " " + start.y + " A " + radius + " " + radius + " 0 " + arcSweep + " 0 " + end.x + " " + end.y;
}


function StopWatch(props) {
    const [, setTime] = useState(dayjs().format('YYYY-MM-DDTHH:mm:ss'));

    useEffect(() => {
        const interval = setInterval(() => setTime(dayjs().format('YYYY-MM-DDTHH:mm:ss')), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    const getBreakHours = () => dayjs.duration(dayjs(props.stopped ? dayjs() : props.stoppedAt).diff(dayjs(props.startedAt), 'seconds'), 'seconds').subtract(props.secsFromLastStop, 'seconds').asHours();
    const getBreakMinutes = () => dayjs.duration(dayjs(props.stopped ? dayjs() : props.stoppedAt).diff(dayjs(props.startedAt), 'seconds'), 'seconds').subtract(props.secsFromLastStop, 'seconds').minutes();
    const getBreakSeconds = () => dayjs.duration(dayjs(props.stopped ? dayjs() : props.stoppedAt).diff(dayjs(props.startedAt), 'seconds'), 'seconds').subtract(props.secsFromLastStop, 'seconds').seconds();
    const getHours = () => dayjs.duration(dayjs(props.stopped ? props.stoppedAt : dayjs()).diff(dayjs(props.stoppedAt), 'seconds'), 'seconds').add(props.secsFromLastStop, 'seconds').asHours();
    const getMinutes = () => dayjs.duration(dayjs(props.stopped ? props.stoppedAt : dayjs()).diff(dayjs(props.stoppedAt), 'seconds'), 'seconds').add(props.secsFromLastStop, 'seconds').minutes();
    const getSeconds = () => dayjs.duration(dayjs(props.stopped ? props.stoppedAt : dayjs()).diff(dayjs(props.stoppedAt), 'seconds'), 'seconds').add(props.secsFromLastStop, 'seconds').seconds();
    const getTotalSeconds = () => dayjs.duration(dayjs(props.stopped ? props.stoppedAt : dayjs()).diff(dayjs(props.stoppedAt), 'seconds'), 'seconds').add(props.secsFromLastStop, 'seconds').asSeconds();

    const [showModal, setShowModal] = useState(-1);
    const [hikeFinishTime, setHikeFinishTime] = useState(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
    const [errorStartHike, setErrorStartHike] = useState();
    const [waitingStartHike, setWaitingStartHike] = useState(false);

    async function finishHike(e) {
        try {
            setShowModal(false);
            setWaitingStartHike(true);
            setErrorStartHike();
            e.preventDefault();
            e.stopPropagation();
            if (!props.stopped) {
                const timeOnClock = getTotalSeconds();
                props.submitFinish(dayjs().format('YYYY-MM-DDTHH:mm:ss'), timeOnClock, hikeFinishTime);
            }
            setWaitingStartHike(false);
        } catch (error) {
            setWaitingStartHike(false);
            setErrorStartHike(error);
            setTimeout(() => setErrorStartHike(), 3000);
        }
    }


    return (
        <>

            <Row>
                <Col>
                    <OverlayTrigger
                        popperConfig={{ modifiers: { preventOverflow: { boundariesElement: 'viewport' } } }}
                        key="stopwatch"
                        placement="bottom"
                        trigger="hover"
                        overlay={
                            <Tooltip id={'tooltip-bottom'}>
                                Click to <strong>{props.stopped ? 'resume' : 'stop'}</strong> the clock.
                            </Tooltip>}>
                        <svg onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            const time = dayjs().format('YYYY-MM-DDTHH:mm:ss');
                            if (!props.stopped) {
                                const timeOnClock = getTotalSeconds();
                                props.stopStopwatch(time, timeOnClock);
                            }
                            else props.resumeStopwatch(time);
                        }} width="150" height="150" viewBox="0 0 300 300">
                            <path stroke="#2c3e50" strokeWidth="9" d={props.stopped ? "M 150 15 L 150 15 150 25" : "M 150 5 L 150 5 150 25"} />
                            <path stroke="#2c3e50" strokeWidth="9" d={describeArc(150, 150, props.stopped ? 135 : 145, 351, 9)} />
                            <path fill="#85c1e9" stroke="#d35400" strokeWidth="7" d={describeArc(150, 150, 125, 0, 359.99)} />
                            <path fill="none" stroke="#2c3e50" strokeWidth="5" d={describeArc(150, 150, 100, 0, getSeconds() * 360 / 60)} />
                            <path fill="none" stroke="#16a085" strokeWidth="7" d={describeArc(150, 150, 112, 0, getMinutes() * 360 / 60)} />
                            {getHours() >= 1 ?
                                <>
                                    <text x="46%" y="47%" textAnchor="middle" fill='#d35400' fontSize={getHours() >= 100 ? "2.7em" : "3em"} style={{ fontFamily: "arial black, sans serif" }}>
                                        {Math.floor(getHours()) + " h"}
                                    </text>
                                    <text x="50%" y="53%" textAnchor="middle" fill='#16a085' fontSize="2.2em" style={{ fontFamily: "arial black, sans serif" }}>
                                        {Math.floor(getMinutes()) + " m"}
                                    </text>
                                    <text x="55%" y="58%" textAnchor="middle" fill='#2c3e50' fontSize="1.3em" style={{ fontFamily: "arial black, sans serif" }}>
                                        {Math.floor(getSeconds()) + " s"}
                                    </text>
                                </>
                                :
                                <>
                                    <text x="46%" y="47%" textAnchor="middle" fill='#16a085' fontSize="3em" style={{ fontFamily: "arial black, sans serif" }}>
                                        {Math.floor(getMinutes()) + " m"}
                                    </text>
                                    <text x="50%" y="53%" textAnchor="middle" fill='#2c3e50' fontSize="2.2em" style={{ fontFamily: "arial black, sans serif" }}>
                                        {Math.floor(getSeconds()) + " s"}
                                    </text>
                                </>
                            }
                        </svg>
                    </OverlayTrigger>
                </Col>
                <Col>
                    <div className='text-center'><strong>Time spent on breaks:</strong></div>
                    <div className='text-center mt-2'><svg width="100" height="100" viewBox="0 0 300 300">
                        <path stroke="#2c3e50" strokeWidth="9" d={!props.stopped ? "M 150 15 L 150 15 150 25" : "M 150 5 L 150 5 150 25"} />
                        <path stroke="#2c3e50" strokeWidth="9" d={describeArc(150, 150, !props.stopped ? 135 : 145, 351, 9)} />
                        <path fill="#85c1e9" stroke="#d35400" strokeWidth="7" d={describeArc(150, 150, 125, 0, 359.99)} />
                        <path fill="none" stroke="#2c3e50" strokeWidth="5" d={describeArc(150, 150, 100, 0, getBreakSeconds() * 360 / 60)} />
                        <path fill="none" stroke="#16a085" strokeWidth="7" d={describeArc(150, 150, 112, 0, getBreakMinutes() * 360 / 60)} />
                        {getBreakHours() >= 1 ?
                            <>
                                <text x="46%" y="47%" textAnchor="middle" fill='#d35400' fontSize={getBreakHours() >= 100 ? "2.7em" : "3em"} style={{ fontFamily: "arial black, sans serif" }}>
                                    {Math.floor(getBreakHours()) + " h"}
                                </text>
                                <text x="50%" y="53%" textAnchor="middle" fill='#16a085' fontSize="2.2em" style={{ fontFamily: "arial black, sans serif" }}>
                                    {Math.floor(getBreakMinutes()) + " m"}
                                </text>
                                <text x="55%" y="58%" textAnchor="middle" fill='#2c3e50' fontSize="1.3em" style={{ fontFamily: "arial black, sans serif" }}>
                                    {Math.floor(getBreakSeconds()) + " s"}
                                </text>
                            </>
                            :
                            <>
                                <text x="46%" y="47%" textAnchor="middle" fill='#16a085' fontSize="3em" style={{ fontFamily: "arial black, sans serif" }}>
                                    {Math.floor(getBreakMinutes()) + " m"}
                                </text>
                                <text x="50%" y="53%" textAnchor="middle" fill='#2c3e50' fontSize="2.2em" style={{ fontFamily: "arial black, sans serif" }}>
                                    {Math.floor(getBreakSeconds()) + " s"}
                                </text>
                            </>
                        }
                    </svg></div>
                </Col>
                <Col>
                    <Button variant="warning" className='btn-finish' size="lg" onClick={() => setShowModal(true)}>
                        Finish
                    </Button>
                </Col>
            </Row>

            <Modal className='my-2' show={showModal !== -1} onHide={e => setShowModal(-1)}>
                <Modal.Header style={{ backgroundColor: "#e0e3e5" }} closeButton><strong><h2>Finish The Hike!</h2></strong></Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className='my-3'>
                            <Col sm={12}>
                                <strong>Set Finish Time Manually:</strong>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <Flatpickr className="ms-3" data-enable-time value={hikeFinishTime} onChange={([date]) => setHikeFinishTime(date)} options={{ minDate: dayjs().format('YYYY-MM-DDTHH:mm:ss') }} />
                            </Col>
                            <Col sm={2}>
                                <OverlayTrigger overlay={<Tooltip>Reset to now</Tooltip>}>
                                    <svg onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setHikeFinishTime(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
                                    }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-calendar2-x-fill ms-4  " viewBox="0 0 16 16">
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zm9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5zm-6.6 5.146a.5.5 0 1 0-.708.708L7.293 10l-1.147 1.146a.5.5 0 0 0 .708.708L8 10.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 10l1.147-1.146a.5.5 0 0 0-.708-.708L8 9.293 6.854 8.146z" />
                                    </svg>
                                </OverlayTrigger>
                            </Col>
                            <Col className="d-flex flex-row-reverse">
                                <OverlayTrigger overlay={<Tooltip>End the hike!</Tooltip>}>
                                    <Button variant="outline-success" onClick={finishHike}>finish</Button>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col >
                                <ServerReply error={errorStartHike} errorMessage={"Couldn't start the hike, retry!"} waiting={waitingStartHike} />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default StopWatch;