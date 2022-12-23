import { useEffect, useRef, useState } from 'react';
import {Alert, Badge, Button, Col, Collapse, Container, Form, OverlayTrigger, Row, Spinner, Tooltip} from 'react-bootstrap';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import "flatpickr/dist/themes/material_green.css";

import Flatpickr from "react-flatpickr";
import api from '../lib/api';
dayjs.extend(duration);

const DIFFICULTIES={'TOURIST':'success','HIKER':'info','PROFESSIONAL HIKER':'danger'};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
}

const describeArc=(x, y, radius, startAngle, endAngle)=>{
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    return "M "+start.x+" "+start.y+" A "+radius+" "+radius+" 0 "+arcSweep+" 0 "+end.x+" "+end.y;       
}

function StopWatch(props){
    //console.log('Rerendering stopwatch',props.stoppedAt,'secs from last stop are',props.secsFromLastStop);
    const getHours=()=>dayjs.duration(dayjs(props.stopped?props.stoppedAt:dayjs()).diff(dayjs(props.stoppedAt),'seconds'),'seconds').add(props.secsFromLastStop,'seconds').asHours();
    const getMinutes=()=>dayjs.duration(dayjs(props.stopped?props.stoppedAt:dayjs()).diff(dayjs(props.stoppedAt),'seconds'),'seconds').add(props.secsFromLastStop,'seconds').minutes();
    const getSeconds=()=>dayjs.duration(dayjs(props.stopped?props.stoppedAt:dayjs()).diff(dayjs(props.stoppedAt),'seconds'),'seconds').add(props.secsFromLastStop,'seconds').seconds();
    const getTotalSeconds=()=>dayjs.duration(dayjs(props.stopped?props.stoppedAt:dayjs()).diff(dayjs(props.stoppedAt),'seconds'),'seconds').add(props.secsFromLastStop,'seconds').asSeconds();
    return(
        <OverlayTrigger
            key="bottom"
            placement="bottom"
            overlay={
                <Tooltip id={'tooltip-bottom'}>
                    Click to <strong>{props.stopped?'resume':'stop'}</strong> the clock.
                </Tooltip>}>
            <svg onClick={e=>{
                e.preventDefault();
                e.stopPropagation();
                if(!props.stopped)
                    //props.stopResumeHike(dayjs().format('YYYY-MM-DDTHH:mm:ss'),getTotalSeconds(),!props.stopped)
                //else props.stopResumeHike(dayjs().format('YYYY-MM-DDTHH:mm:ss'),props.secsFromLastStop,!props.stopped)
                    props.setSecsFromLastStop(getTotalSeconds());
                props.setStoppedAt(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
                props.setStopped(!props.stopped);
                //props.stopResumeHike();
            }} width="150" height="auto" viewBox="0 0 300 300">
                <path stroke="#2c3e50" stroke-width="9" d={props.stopped?"M 150 15 L 150 15 150 25":"M 150 5 L 150 5 150 25"} />
                <path stroke="#2c3e50" stroke-width="9" d={describeArc(150, 150, props.stopped?135:145, 351, 9)} />
                <path fill="#85c1e9" stroke="#d35400" stroke-width="7" d={describeArc(150, 150, 125, 0, 359.99)} />
                <path fill="none" stroke="#2c3e50" stroke-width="5" d={describeArc(150, 150, 100, 0, getSeconds()*360/60)} />
                <path fill="none" stroke="#16a085" stroke-width="7" d={describeArc(150, 150, 112, 0, getMinutes()*360/60)} />
                {getHours()>=1?
                    <>
                        <text x="46%" y="47%" text-anchor="middle" fill='#d35400' fontSize={getHours()>=100?"2.7em":"3em"} style={{fontFamily:"arial black, sans serif"}}>
                            {Math.floor(getHours())+" h"}
                        </text>
                        <text x="50%" y="53%" text-anchor="middle" fill='#16a085'fontSize="2.2em" style={{fontFamily:"arial black, sans serif"}}>
                            {Math.floor(getMinutes())+" m"}
                        </text>
                        <text x="55%" y="58%" text-anchor="middle" fill='#2c3e50' fontSize="1.3em" style={{fontFamily:"arial black, sans serif"}}>
                            {Math.floor(getSeconds())+" s"}
                        </text>
                    </>
                    :
                    <>
                        <text x="46%" y="47%" text-anchor="middle" fill='#16a085' fontSize="3em" style={{fontFamily:"arial black, sans serif"}}>
                            {Math.floor(getMinutes())+" m"}
                        </text>
                        <text x="50%" y="53%" text-anchor="middle" fill='#2c3e50'fontSize="2.2em" style={{fontFamily:"arial black, sans serif"}}>
                            {Math.floor(getSeconds())+" s"}
                        </text>
                    </>
                }
            </svg>
        </OverlayTrigger>
    )
}

function HikerHike(props){
    const [hikeId,setHikeId]=useState(-1);
    const [startedAt,setStartedAt]=useState('');
    const [stoppedAt,setStoppedAt]=useState('');
    const [secsFromLastStop,setSecsFromLastStop]=useState(0);
    const [stopped,setStopped]=useState(false);
    const [refresh,setRefresh]=useState(false);
    useEffect(()=>{
        if(!stopped){
            setRefresh(false);
            setTimeout(()=>setRefresh(true),1000);
        }
    },[refresh,stopped]);
    useEffect(()=>{
        const getHike=async()=>{
            try {
                console.log('IN GET HIKE');
                const hikeDetails=await api.getUnfinishedHike(props.user.username);
                console.log("Received ",hikeDetails);
                setHikeId(hikeDetails.hikeId);
                setStartedAt(hikeDetails.start);
                setStopped(hikeDetails.stopped);
                setStoppedAt(hikeDetails.stoppedAt);
                setSecsFromLastStop(hikeDetails.secsFromLastStop);
            } catch (error) {
                setHikeId(-1);
                setStartedAt('');
                setStopped(false);
                setStoppedAt('');
                setSecsFromLastStop(0);
            }
        }
        getHike();
    },[props.hikes]);
    useEffect(()=>{
        const stopResumeHike=async ()=>{
            try {
                console.log('\tIN STOP RESUME USEEFFECT');
                const hikeDetails=await api.stopResumeHike(stoppedAt,secsFromLastStop,stopped);
                console.log('STOP RECEIVED ',hikeDetails)
                setHikeId(hikeDetails.hikeId);
                setStartedAt(hikeDetails.start);
                setStopped(hikeDetails.stopped);
                setStoppedAt(hikeDetails.stoppedAt);
                setSecsFromLastStop(hikeDetails.secsFromLastStop);
            } catch (error) {
                setHikeId(-1);
                setStartedAt('');
                setStopped(false);
                setStoppedAt('');
                setSecsFromLastStop(0);
            }
        }
        stopResumeHike();
    },[stoppedAt,secsFromLastStop,stopped])
    /*const stopResumeHike=async(stopat,oldsecs,stop)=>{
        try {
            console.log('\tIN STOP RESUME WITH',stopat,'AND SECS FROM LAST STOP',oldsecs,'STOPPED?',stop);
            const hikeDetails=await api.stopResumeHike(stopat,oldsecs,stop);
            console.log('STOP RECEIVED ',hikeDetails)
            setHikeId(hikeDetails.hikeId);
            setStartedAt(hikeDetails.start);
            setStopped(hikeDetails.stopped);
            setStoppedAt(hikeDetails.stoppedAt);
            setSecsFromLastStop(hikeDetails.secsFromLastStop);
        } catch (error) {
            setHikeId(-1);
            setStartedAt('');
            setStopped(false);
            setStoppedAt('');
            setSecsFromLastStop(0);
        }
    }*/
    const hike=hikeId!==-1?props.hikes.find(p=>p.id===hikeId):undefined;
    //console.log("RERENDEREING HIKERHIKE with stoppedAt",stoppedAt,'stopped',stopped);
    return(
        <>
            <Alert variant='info'>
                <Alert.Heading>
                    You have an unfinished hike to complete!
                </Alert.Heading>
                <Container>
                    <Row>
                        <Col xs={12} md={8}>
                            <strong>{hike?'Hike '+hike.name: <Spinner animation='grow'/>}</strong>
                            <br/>
                            <strong>{startedAt!==''?'You started this hike at '+startedAt:<></>}</strong>
                            <br/>
                            <strong>{hike?'Difficulty ':<></>}</strong><Badge bg={hike?DIFFICULTIES[hike.difficulty]:'dark'}>{hike?hike.difficulty:<></>}</Badge>
                            <br/>
                            <strong>{hike?hike.name+' on average is completed in '+Math.ceil(hike.expectedTime)+' hours':<></>}</strong>
                            <br/>
                            <strong>{hike?hike.name+' is long '+Math.ceil(hike.len)+' kms':<></>}</strong>
                            <br/>
                            <strong>{hike?hike.name+' has an ascent of '+Math.ceil(hike.ascent)+' meters':<></>}</strong>
                        </Col>
                        <Col xs={12} md={4}>
                            {stoppedAt!==''&&<StopWatch stoppedAt={stoppedAt} setStoppedAt={setStoppedAt} stopped={stopped} setStopped={setStopped} secsFromLastStop={secsFromLastStop} setSecsFromLastStop={setSecsFromLastStop}/>}
                        </Col>
                    </Row>
                </Container>
            </Alert>
        </>
    )
}

export default HikerHike;