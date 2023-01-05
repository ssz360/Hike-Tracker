import { useEffect, useState } from "react";
import { Alert, Button, Form, Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import icons from "../lib/iconspoint";
import ServerReply from "./serverReply";

function SelectLinkHut(props) {
    //console.log("IN selectlinkhut WITH ",props.point,"and hike",props.hike);
    const isStart = props.point.id === props.startPoint.id;
    const isEnd = props.point.id === props.endPoint.id;
    const [link, setLink] = useState(props.hike.huts.map(p => p.id).includes(props.point.id));
    const [error, setError] = useState();
    const [success, setSuccess] = useState(false);
    const [waiting, setWaiting] = useState(false);
    useEffect(() => {
        setLink(props.hike.huts.map(p => p.id).includes(props.point.id))
    }, [props.point])
    const submitHandler = async () => {
        try {
            setWaiting(true);
            await props.linkHut(!link);
            setWaiting(false);
            setSuccess(true);
            setError();
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            setWaiting(false);
            console.log("Error in link submit", error);
            setSuccess(false);
            setError(error);
            setTimeout(() => setError(false), 3000);
        }
    }
    return (
        // <>
        //     <Form>
        //         <Form.Group className="my-3 text-center">
        //             {icons.iconsvgelement[props.point.typeOfPoint]}
        //             <Form.Label style={{width:"100%",fontWeight:"bolder"}}><p className="mt-3">{props.point.name}</p></Form.Label>
        //         </Form.Group>
        //         <Form.Group className="mx-5 my-3">
        //             <div className="mx-auto text-center my-3">
        //                 <Button variant={link?"outline-danger":"outline-success"} onClick={e=>{
        //                     e.preventDefault();
        //                     e.stopPropagation();
        //                     submitHandler();
        //                 }}>{link?"Unlink this point from this hike":"Link this point to this hike"}</Button>
        //             </div>
        //         </Form.Group>
        //     </Form>
        //     <ServerReply error={error} success={success} waiting={waiting} errorMessage={"Error while updating link of "+props.point.name+" to "+props.hike.name} successMessage={"Updated link of "+props.point.name+" to "+props.hike.name+" correctly!"} />
        // </>
        <div>
            <p className="my-3">
                {icons.iconsvgelement[props.point.typeOfPoint]}
                <b>{props.point.name}</b>
                <i>{" (" + parseFloat(props.point.coordinates[0]).toFixed(4) + ", " +
                    parseFloat(props.point.coordinates[1]).toFixed(4) + ")"}</i>
            </p>
            <p>{props.point.description}</p>
            <Col className="float-end">
                <Row className="mx-2">
                    <OverlayTrigger delay={{ show: 250, hide: 400 }} overlay={
                        <Tooltip> {link ?
                            "Unlink this point to this hike"
                            :
                            "Link this point to this hike"
                        }</Tooltip>}>
                            <Button  variant={link ? "outline-danger" : "outline-success"} onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                submitHandler();
                            }}>{link ? "Unlink" : "Link"}</Button>
                    </OverlayTrigger>
                </Row>
            </Col>
            <ServerReply error={error} success={success} waiting={waiting} errorMessage={"Error while updating link of " + props.point.name + " to " + props.hike.name} successMessage={"Updated link of " + props.point.name + " to " + props.hike.name + " correctly!"} />
        </div>
    )
}

export default SelectLinkHut;