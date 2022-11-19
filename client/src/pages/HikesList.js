import { Col, Row, Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';
import AreaMap from '../components/areaMap';
import HikeMap from '../components/hikeMap';

function HikesList(props){

    let displayedHikes = [];
    const [center,setCenter]=useState();
    const [radius,setRadius]=useState(0);
    const [len, setLen] = useState("");
    const [dif, setDif] = useState("");
    const [asc, setAsc] = useState("");
    const [time, setTime] = useState("");
    const [openArea, setOpenArea] = useState(false);
    //console.log("Displaying with logged?",props.logged);

    props.hikes.forEach(hike => displayedHikes.push(hike));


    const handleSubmit = (event) => {
        event.preventDefault();
        props.filtering(center!==undefined?{center:center,radius:radius}:undefined, len, dif, asc, time);
    
    }

    return (
        <>{openArea ? (<AreaMap center={center} setCenter={setCenter} radius={radius} setRadius={setRadius} drag={false} openArea={openArea} setOpenArea={setOpenArea}/>) : <></>}
        <Row className="mt-2">
        <div className="text-center"><h4>Search your favorite hike with the filters!</h4></div>
        </Row>
        <div className="mt-2">
        <Row className="justify-content-md-center">
            <Col xs lg="3"><div className="d-grid gap-2"> 
            <Button variant={center!==undefined?"success":"outline-dark"} onClick={() => setOpenArea(true)}>{center!==undefined?"Area selected!":"Select Area..."}</Button>
            </div>
            </Col>
            
            <Col xs lg="3"> <Form.Select aria-label="Length" onChange={(event) => setLen(event.target.value)}>
                    <option value ="">Length</option>
                    <option value="1">0 - 5km</option>
                    <option value="2">5 km - 10km</option>
                    <option value="3">More than 10km</option>
                    </Form.Select>
            </Col>
            <Col xs lg="3"> <Form.Select aria-label="Ascent" onChange={(event) => setAsc(event.target.value)}>
                    <option value ="">Ascent</option>
                    <option value="1">0 - 300m</option>
                    <option value="2">300m - 600m</option>
                    <option value="3">600m - 1000m</option>
                    <option value="4">More than 1000m</option>
                    </Form.Select>
            </Col>
        </Row>
        </div>
        <div className="mt-2">
        <Row className="justify-content-md-center">
            <Col xs lg="3"> <Form.Select aria-label="Difficulty" onChange={(event) => setDif(event.target.value)}>
                    <option value ="">Difficulty</option>
                    <option value="TOURIST">Tourist</option>
                    <option value="HIKER">Hiker</option>
                    <option value="PROFESSIONAL HIKER">Professional hiker</option>
                    </Form.Select>
            </Col>
            <Col xs lg="3"> <Form.Select aria-label="Expected Time" onChange={(event) => setTime(event.target.value)}>
                    <option value ="">Expected Time</option>
                    <option value="1">0 - 1h</option>
                    <option value="2">1h - 3h</option>
                    <option value="3">More than 3h</option>
                    </Form.Select>
            </Col>
            <Col xs lg="3"> 
            <Form onSubmit={(handleSubmit)}>
            <div className="d-grid gap-2">
                <Button variant="success" type='submit'><strong>Search</strong></Button>
            </div>
            </Form>
            </Col>
        </Row>
        </div>
        <Row className="mt-2">
              {
                <Display logged={props.logged} displayedHikes={displayedHikes}/>
              }
        </Row>
        <div className="mb-5"> </div>
        </>
      )

}


function Display(props){
    return props.displayedHikes.map((hike) => <HikeRow logged={props.logged} key={hike.id} hike={hike}/>)
}


function HikeRow(props){
    return (
    <><Col xs={4} className="mt-2"><Card>
    <Card.Header as="h4">
      {props.hike.name}
    </Card.Header>
    <Card.Body>
      {props.logged?<HikeMap hike={props.hike}/>:<></>}
      <Card.Text>{props.hike.description}</Card.Text>
    </Card.Body>
  </Card>
  </Col></>);
}

export default HikesList;