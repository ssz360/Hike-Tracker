import { useState, useEffect } from 'react';
import { Col, Row, Card, Badge, Spinner } from "react-bootstrap";
import HikerHike from "./hikerHike";
import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from '../lib/api';

dayjs.extend(duration);

function CompletedHikesRow({trip,hike}) {
    
    const sliderSettings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        autoplay: false,
        cssEase: "linear"
    };
    const DIFFICULTIES = { 'TOURIST': 'success', 'HIKER': 'info', 'PROFESSIONAL HIKER': 'danger' };

    const getTotalHours = () => dayjs.duration(dayjs(trip.end_time).diff(dayjs(trip.last_seg_end_time), 'seconds'), 'seconds').add(trip.last_seg_duration, 'seconds').asHours();
    const getTotalMinutes = () => dayjs.duration(dayjs(trip.end_time).diff(dayjs(trip.last_seg_end_time), 'seconds'), 'seconds').add(trip.last_seg_duration, 'seconds').minutes();

    return(<Card className="my-4" style={{"background-color":"#cff4fc"}}>
        <Card.Header style={{"text-align":"center"}}><strong>{hike.name}</strong></Card.Header>
        <Row className="m-2">
            <Col xs={3}>
                <Row className="my-1"><Col><Badge bg="danger">Start time</Badge> <strong>{dayjs(trip.start_time).format('DD/MM/YYYY HH:mm')}</strong></Col></Row>
                <Row className="my-1"><Col><Badge bg="success">End time</Badge> <strong>{dayjs(trip.end_time).format('DD/MM/YYYY HH:mm')}</strong></Col></Row>
                <Row className="my-1"><Col><Badge bg="dark">Duration</Badge> <strong>{Math.floor(getTotalHours())+"h "+getTotalMinutes()+"m"}</strong></Col></Row>
            </Col>
            <Col xs={9}>
                <Slider className='mx-auto' {...sliderSettings} style={{ width: "85%" }}>
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
        </Row>
    </Card>)
}

function CompletedHikes({hikes,hikeId}) {
    const [completedHikes, setCompletedHikes] = useState([]);

    useEffect(() => {
        const getFinishedHikes = async () => {
            const res = await api.getFinishedHikes();
            setCompletedHikes(res)
        }
        getFinishedHikes();
    },[hikeId]);

    return(<>
        <h1>Completed hikes</h1>
        {/* <Table>
            <tr>
                <th>ID hike</th>
                <th>Start time</th>
                <th>End time</th>
                <th>Duration</th>
            </tr>
            {completedHikes.map((trip,i) => <CompletedHikesRow key={i} trip={trip} hike={hikes.find(h => h.id === trip.IDHike)}/>)}
        </Table> */}
        {completedHikes.map((trip,i) => <CompletedHikesRow key={i} trip={trip} hike={hikes.find(h => h.id === trip.IDHike)}/>)}
    </>)
}

function ProfileHikes(props){

    const [hikeId, setHikeId] = useState(-1);

    return(<>
        <Row className="my-3">
            <Col>
                <HikerHike hikes={props.hikes} hikeId={hikeId} setHikeId={setHikeId}/>
            </Col>
        </Row>
        <Row className="my-3" style={{height:"100%"}}>
            <Col>
                <CompletedHikes hikes={props.hikes} hikeId={hikeId}/>
            </Col>
        </Row>
    </>)
}

export default ProfileHikes;