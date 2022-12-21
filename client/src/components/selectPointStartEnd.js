import { useEffect, useState } from "react";
import { Button, Stack, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import icons from "../lib/iconspoint";
import ServerReply from "./serverReply";


function SelectPointStartEnd(props) {
    console.log("IN SELECTPOINTSTARTEND WITH ", props.point);
    const euclidianDistance = (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    const iconsvg = {
        "Hut": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" className="bi bi-houses-fill" viewBox="0 0 16 16"><path d="M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.51 2.51 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354L7.207 1Z" /><path d="M8.793 2a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708L8.793 2Z" /></svg>,
        "Parking": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" className="bi bi-p-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM5.5 4.002V12h1.283V9.164h1.668C10.033 9.164 11 8.08 11 6.586c0-1.482-.955-2.584-2.538-2.584H5.5Zm2.77 4.072c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z" /></svg>,
        "hikePoint": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" className="bi bi-geo-fill" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z" /></svg>
    }
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

            {/* <Button
                variant={isStart || !props.linkableStart? "outline-secondary":"outline-primary"}
                disabled={isStart || !props.linkableStart}
                onClick={e=>submitHandler(e,true)}
                className="my-3"
            > */}
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
                    <p style={{width: "150px"}} className="me-3">
                        <Button
                            variant={isEnd || !props.linkableEnd ? "outline-secondary" : "outline-primary"}
                            disabled={isStart || !props.linkableStart}
                            onClick={e => submitHandler(e, true)}
                            style={{width: "150px"}}>
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
                    <span style={{width: "150px"}}>
                        <Button
                            variant={isEnd || !props.linkableEnd ? "outline-secondary" : "outline-primary"}
                            disabled={isEnd || !props.linkableEnd}
                            onClick={e => submitHandler(e, false)}
                            style={{width: "150px"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="auto" fill="green" class="bi bi-flag-fill" viewBox="0 0 16 16">
                                <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                            </svg>
                            {/* {isEnd?
                    props.point.name+" is already the arrival point for "+props.hike.name
                    :
                    props.linkableEnd?
                    "Link "+props.point.name+" as the new arrival point for "+props.hike.name
                    :
                    props.point.typeOfPoint!=='referencePoint'?
                    props.point.name+" is too far from the current arrival point of "+props.hike.name+" to be set as the new one"
                    :
                    props.point.name+" is not selectable as the arrival point for "+props.hike.name
                } */} Arrival point 
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