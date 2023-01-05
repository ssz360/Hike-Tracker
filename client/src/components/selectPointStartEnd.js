import { useState } from "react";
import { Button, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import icons from "../lib/iconspoint";
import ServerReply from "./serverReply";
import React from 'react';


function SelectPointStartEnd(props) {
    const isStart = props.point.id === props.startPoint.id;
    const isEnd = props.point.id === props.endPoint.id;
    console.log("IN SELECTPOINTSTARTEND WITH ", props.point, "linkable start?", props.linkableStart, "linkable end?", props.linkableEnd, "is start?", isStart, "is end?", isEnd);
    const [error, setError] = useState();
    const [success, setSuccess] = useState(false);
    const [waiting, setWaiting] = useState(false);

    const submitHandler = async (e, start) => {
        try {
            e.preventDefault();
            e.stopPropagation();
            setWaiting(true);
            await props.linkPoint(start ? "start" : "end");
            setWaiting(false);
            setSuccess(true);
            setError()
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            setWaiting(false);
            setSuccess(false);
            setError(error);
            setTimeout(() => setError(false), 3000);
        }
    }

    return (
        <div className="justify-content-center my-4">

            <p className="my-3">
                {icons.iconsvgelement[props.point.typeOfPoint]}
                <b>{props.point.name}</b>
                <i>{" (" + parseFloat(props.point.coordinates[0]).toFixed(4) + ", " +
                    parseFloat(props.point.coordinates[1]).toFixed(4) + ")"}</i>
            </p>
            <p>{props.point.description}</p>
            <Col className="float-end">
                <Row >
                    <OverlayTrigger delay={{ show: 250, hide: 400 }} overlay={
                        <Tooltip> {isStart ?
                            "This point is already the starting point"
                            :
                            props.linkableStart ?
                                "Set this point as the new starting point"
                                :
                                props.point.typeOfPoint !== 'referencePoint' ?
                                    "This point is too far from the current starting point to be set as the new one"
                                    :
                                    "This point is not selectable as a new starting point"
                        }</Tooltip>}>
                        <p style={{ width: "150px" }} className="me-3">
                            <Button
                                variant={isEnd || !props.linkableEnd ? "outline-secondary" : "outline-primary"}
                                disabled={isStart || !props.linkableStart}
                                onClick={e => submitHandler(e, true)}
                                style={{ width: "150px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="purple" class="bi bi-flag-fill" viewBox="0 0 16 16">
                                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                                </svg>
                                {" "}Starting point
                            </Button>
                        </p>
                    </OverlayTrigger>
                </Row>
                <Row >
                    <OverlayTrigger delay={{ show: 250, hide: 400 }} overlay={<Tooltip> {
                        isEnd ?
                            "This point is already the arrival point"
                            :
                            props.linkableEnd ?
                                "Set this point as the new arrival point"
                                :
                                props.point.typeOfPoint !== 'referencePoint' ?
                                    "This point is too far from the current arrival point to be set as the new one"
                                    :
                                    "This point is not selectable as a new arrival point"
                    }</Tooltip>}>
                        <span style={{ width: "150px" }}>
                            <Button
                                variant={isEnd || !props.linkableEnd ? "outline-secondary" : "outline-primary"}
                                disabled={isEnd || !props.linkableEnd}
                                onClick={e => submitHandler(e, false)}
                                style={{ width: "150px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="auto" fill="green" class="bi bi-flag-fill" viewBox="0 0 16 16">
                                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                                </svg>
                                Arrival point
                            </Button>
                        </span>
                    </OverlayTrigger>
                </Row>
            </Col>
            <ServerReply className="justify-content-center" error={error} success={success} waiting={waiting} errorMessage={"Error while trying to link " + props.point.name + " with " + props.hike.name} successMessage={"Linked " + props.point.name + " with " + props.hike.name + " correctly!"} />
        </div>
    )
}

export default SelectPointStartEnd;