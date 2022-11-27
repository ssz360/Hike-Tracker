import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import icons from "../lib/iconspoint";


function SelectedPoint(props){
    const isStart=props.point.id===props.startPoint.id;
    const isEnd=props.point.id===props.endPoint.id;
    return(
        <>
            <div className="my-3 text-center">
                {icons.iconsvgelement[props.point.typeOfPoint]}
            </div>
            <div className="my-3 text-center">
                {props.point.name}
            </div>
            <div className="my-3 text-center">
                {props.point.geographicalArea}
            </div>
            {isStart || isEnd?
                <div className="my-3 text-center">
                    {isStart?"This point is the starting point for this hike!":"This point is the arrival point for this hike!"}
                </div>
                :
                <></>
            }
        </>
    )
}

export default SelectedPoint;