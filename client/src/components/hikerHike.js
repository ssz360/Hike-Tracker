import { useEffect, useState } from 'react';
import { Alert, Badge, Col, Row, Spinner } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from '../lib/api';
import StopWatch from './stopwatch';
import React from 'react';

const DIFFICULTIES = { 'TOURIST': 'success', 'HIKER': 'info', 'PROFESSIONAL HIKER': 'danger' };

function HikerHike(props) {

    const [hikeId, setHikeId] = useState(-1);
    const [startedAt, setStartedAt] = useState('');
    const [stoppedAt, setStoppedAt] = useState('');
    const [secsFromLastStop, setSecsFromLastStop] = useState(0);
    const [stopped, setStopped] = useState(false);

    useEffect(() => {
        const getHike = async () => {
            try {
                console.log('IN GET HIKE');
                const hikeDetails = await api.getUnfinishedHike();
                console.log("Received ", hikeDetails);
                if(hikeDetails){
                    setHikeId(hikeDetails.hikeId);
                    setStartedAt(hikeDetails.start);
                    setStopped(hikeDetails.stopped);
                    setStoppedAt(hikeDetails.stoppedAt);
                    setSecsFromLastStop(hikeDetails.secsFromLastStop);
                }
                else setHikeId(undefined)
            } catch (error) {
                setHikeId(-1);
                setStartedAt('');
                setStopped(false);
                setStoppedAt('');
                setSecsFromLastStop(0);
            }
        }
        getHike();
    }, [props.hikes]);

    const stopStopwatch = async (stopTime, timeOnClock) => {
        try {
            console.log('\tIN STOP STOPWATCH');
            const hikeDetails = await api.stopResumeHike(stopTime, timeOnClock, true);
            console.log('STOP STOPWATCH RECEIVED ', hikeDetails)
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

    const resumeStopwatch = async (resumeTime) => {
        try {
            console.log('\tIN RESUME STOPWATCH');
            const hikeDetails = await api.stopResumeHike(resumeTime, secsFromLastStop, false);
            console.log('RESUME RECEIVED ', hikeDetails)
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
   
    const hike = hikeId !== -1 ? props.hikes.find(p => p.id === hikeId) : undefined;
    
    console.log("RERENDEREING HIKERHIKE with stoppedAt", stoppedAt, 'stopped', stopped);
    
    return (
        <Alert variant='info'>
            <Alert.Heading>
                {hikeId?'You have an unfinished hike to complete!':"You don't have any hike to complete!"}
            </Alert.Heading>
            {hikeId &&<Row>
                <Col xs={12} md={6}>
                    <Slider className='mx-auto' {...sliderSettings} style={{ width: "85%" }}>
                        <div>
                            <div className="text-center"><Badge bg='info'><strong>Hike</strong></Badge></div>
                            <div className="text-center mt-3 mb-2"> <strong >{hike ? hike.name : <Spinner animation='grow' />}</strong> </div>
                        </div>
                        <div>
                            <div className="text-center"><Badge bg='dark'><strong>Difficulty</strong></Badge></div>
                            <div className="text-center mt-3 mb-2"><Badge bg={hike ? DIFFICULTIES[hike.difficulty] : 'dark'} pill> <strong>{hike ? hike.difficulty : <></>}</strong></Badge> </div>
                        </div>
                        <div>
                            <div className="text-center"><Badge bg='danger'><strong>Length</strong></Badge></div>
                            <div className="text-center mt-3 mb-2"> <strong>{hike ? hike.name + ' is long ' + Math.ceil(hike.len) + ' kms' : <></>}</strong> </div>
                        </div>
                        <div>
                            <div className="text-center"><Badge bg='secondary'><strong>Expected time</strong></Badge></div>
                            <div className="text-center mt-3 mb-2"> <strong>{hike ? hike.name + ' on average is completed in ' + Math.ceil(hike.expectedTime) + ' hours' : <></>}</strong> </div>
                        </div>
                        <div>
                            <div className="text-center"><Badge bg='primary'><strong>Ascent</strong></Badge></div>
                            <div className="text-center mt-3 mb-2"> <strong>{hike ? hike.name + ' has an ascent of ' + Math.ceil(hike.ascent) + ' meters' : <></>}</strong> </div>
                        </div>
                    </Slider>
                </Col>
                <Col xs={12} md={6}>
                    {stoppedAt !== '' && <StopWatch stopStopwatch={stopStopwatch} resumeStopwatch={resumeStopwatch} startedAt={startedAt} stoppedAt={stoppedAt} setStoppedAt={setStoppedAt} stopped={stopped} setStopped={setStopped} secsFromLastStop={secsFromLastStop} setSecsFromLastStop={setSecsFromLastStop} />}
                </Col>
            </Row>}
        </Alert>
    )
}

export default HikerHike;