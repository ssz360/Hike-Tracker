import { Col, Row, Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';

function HikesList(props){

    let displayedHikes = [];
    const [area, setArea] = useState("");
    const [len, setLen] = useState("");
    const [dif, setDif] = useState("");
    const [asc, setAsc] = useState("");
    const [time, setTime] = useState("");


    props.hikes.forEach(hike => displayedHikes.push(hike));


    const handleSubmit = (event) => {
        event.preventDefault();
        props.filtering(area, len, dif, asc, time);
    
    }

    return (
        <><Row className="mt-2">
        <div className="text-center"><h4>Search your favorite hike with the filters!</h4></div>
        </Row>
        <div className="mt-2">
        <Row className="justify-content-md-center">
            <Col xs lg="3"> <Form.Select aria-label="Area" onChange={(event) => setArea(event.target.value)}>
                    <option value="">Area</option>
                    <option value="one">One</option>
                    <option value="two">Two</option>
                    <option value="three">Three</option>
                    </Form.Select>
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
                    <option value="Tourist">Tourist</option>
                    <option value="Hiker">Hiker</option>
                    <option value="Professional hiker">Professional hiker</option>
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
                <Display displayedHikes={displayedHikes}/>
              }
        </Row>
        </>
      )

}


function Display(props){
    return props.displayedHikes.map((hike) => <HikeRow hike={hike}/>)
}


function HikeRow(props){
    return (
    <><Col xs={4} className="mt-2"><Card>
    <Card.Header as="h4">{props.hike.IDHike}</Card.Header>
    <Card.Body>
      <Card.Text>{props.hike.Description}</Card.Text>
    </Card.Body>
  </Card>
  </Col></>);
}

export default HikesList;