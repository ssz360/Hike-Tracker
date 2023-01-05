import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import React from 'react';
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
    const [ , setTime] = useState(dayjs().format('YYYY-MM-DDTHH:mm:ss'));

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
    return (
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
        </Row>
    )
}

export default StopWatch;