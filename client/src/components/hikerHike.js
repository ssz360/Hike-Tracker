import { useEffect, useState } from 'react';
import {Alert, Badge, Col, Container, Row, Spinner} from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from '../lib/api';
import StopWatch from './stopwatch';

const DIFFICULTIES={'TOURIST':'success','HIKER':'info','PROFESSIONAL HIKER':'danger'};

function HikerHike(props){
    //const [historyRuns,setHistoryRuns]=useState(false);
    const [hikeId,setHikeId]=useState(-1);
    const [startedAt,setStartedAt]=useState('');
    const [stoppedAt,setStoppedAt]=useState('');
    const [secsFromLastStop,setSecsFromLastStop]=useState(0);
    const [stopped,setStopped]=useState(false);
    useEffect(()=>{
        const getHike=async()=>{
            try {
                console.log('IN GET HIKE');
                const hikeDetails=await api.getUnfinishedHike();
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
    const stopStopwatch=async (stopTime,timeOnClock)=>{
        try {
            console.log('\tIN STOP STOPWATCH');
            const hikeDetails=await api.stopResumeHike(stopTime,timeOnClock,true);
            console.log('STOP STOPWATCH RECEIVED ',hikeDetails)
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
    const resumeStopwatch=async (resumeTime)=>{
        try {
            console.log('\tIN RESUME STOPWATCH');
            const hikeDetails=await api.stopResumeHike(resumeTime,secsFromLastStop,false);
            console.log('RESUME RECEIVED ',hikeDetails)
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
    const sliderSettings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear"
    };
    const hike=hikeId!==-1?props.hikes.find(p=>p.id===hikeId):undefined;
    console.log("RERENDEREING HIKERHIKE with stoppedAt",stoppedAt,'stopped',stopped);
    return(
            <Alert variant='info'>
                <Alert.Heading>
                    You have an unfinished hike to complete!
                </Alert.Heading>
                <Row>
                        <Col xs={12} md={6}>
                            <Slider className='mx-auto' {...sliderSettings} style={{width:"85%"}}>
                                <div>
                                    <div className="text-center"><Badge bg='info'><strong>Hike</strong></Badge></div>
                                    <div className="text-center mt-3 mb-2"> <strong >{hike?hike.name: <Spinner animation='grow'/>}</strong> </div>
                                </div>
                                <div>
                                    <div className="text-center"><Badge bg='dark'><strong>Difficulty</strong></Badge></div>
                                    <div className="text-center mt-3 mb-2"><Badge bg={hike?DIFFICULTIES[hike.difficulty]:'dark'} pill> <strong>{hike?hike.difficulty:<></>}</strong></Badge> </div>
                                </div>
                                <div>
                                    <div className="text-center"><Badge bg='danger'><strong>Length</strong></Badge></div>
                                    <div className="text-center mt-3 mb-2"> <strong>{hike?hike.name+' is long '+Math.ceil(hike.len)+' kms':<></>}</strong> </div>
                                </div>
                                <div>
                                    <div className="text-center"><Badge bg='secondary'><strong>Expected time</strong></Badge></div>
                                    <div className="text-center mt-3 mb-2"> <strong>{hike?hike.name+' on average is completed in '+Math.ceil(hike.expectedTime)+' hours':<></>}</strong> </div>
                                </div>
                                <div>
                                    <div className="text-center"><Badge bg='primary'><strong>Ascent</strong></Badge></div>
                                    <div className="text-center mt-3 mb-2"> <strong>{hike?hike.name+' has an ascent of '+Math.ceil(hike.ascent)+' meters':<></>}</strong> </div>
                                </div>
                            </Slider>
                        </Col>
                        <Col xs={12} md={6}>
                            {stoppedAt!==''&&<StopWatch stopStopwatch={stopStopwatch} resumeStopwatch={resumeStopwatch} startedAt={startedAt} stoppedAt={stoppedAt} setStoppedAt={setStoppedAt} stopped={stopped} setStopped={setStopped} secsFromLastStop={secsFromLastStop} setSecsFromLastStop={setSecsFromLastStop}/>}
                        </Col>
                    </Row>
                    {/*Runs table
                    <Row>
                        <Col xs={6}>
                            <strong>History</strong>
                        </Col>
                        <Col xs={6}>
                            <svg className='mx-3 justify-content-center mx-auto text-left' onClick={e=>{
                                e.preventDefault();
                                e.stopPropagation();
                                setHistoryRuns(!historyRuns);
                                }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={historyRuns?"red":"green"}S class="bi bi-chevron-double-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </Col>
                    </Row>
                    {historyRuns && 
                        <Row className="my-2">
                            <Col xs={12}>
                                <Stack gap={0.5}>
                                    <div className="border">
                                        Run from x to y
                                    </div>
                                    <hr/>
                                    <div style={{border:'solid red',borderRadius:'0.4rem'}}>
                                        Run from y to z
                                    </div>
                                </Stack>
                            </Col>    
                        </Row>
                    }*/}
            </Alert>
    )
}

export default HikerHike;