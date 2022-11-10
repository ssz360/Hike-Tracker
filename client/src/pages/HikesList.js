import { Col, Row, Form, Button, Card } from 'react-bootstrap';

function HikesList(props){

    const displayedHikes = [];

    props.hikes.forEach(hike => displayedHikes.push(hike));
    
    return (
        <><Row className="mt-2">
        <div className="text-center"><h4>Search your favorite hike with the filters!</h4></div>
        </Row>
        <div className="mt-2">
        <Row className="justify-content-md-center">
            <Col xs lg="3"> <Form.Select aria-label="Area">
                    <option>Area</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                    </Form.Select>
            </Col>
            
            <Col xs lg="3"> <Form.Select aria-label="Length">
                    <option>Length</option>
                    <option value="1">0 - 5km</option>
                    <option value="2">5 km - 10km</option>
                    <option value="3">More than 5km</option>
                    </Form.Select>
            </Col>
            <Col xs lg="3"> <Form.Select aria-label="Ascent">
                    <option>Ascent</option>
                    <option value="1">0 - 300m</option>
                    <option value="2">300m - 600m</option>
                    <option value="3">600m - 1000m</option>
                    <option value="3">More than 1000m</option>
                    </Form.Select>
            </Col>
        </Row>
        </div>
        <div className="mt-2">
        <Row className="justify-content-md-center">
            <Col xs lg="3"> <Form.Select aria-label="Difficulty">
                    <option>Difficulty</option>
                    <option value="1">Tourist</option>
                    <option value="2">Hiker</option>
                    <option value="3">Professional hiker</option>
                    </Form.Select>
            </Col>
            <Col xs lg="3"> <Form.Select aria-label="Expected Time">
                    <option>Expected Time</option>
                    <option value="1">0 - 1h</option>
                    <option value="2">1h - 3h</option>
                    <option value="3">More than 3h</option>
                    </Form.Select>
            </Col>
            <Col xs lg="3"> <div className="d-grid gap-2"><Button variant="success"><strong>Search</strong></Button></div>
            </Col>
        </Row>
        </div>
        <Row className="mt-2">
              {
                displayedHikes.map((hike) => <HikeRow hike={hike}/>)
              }
        </Row>
        </>
      )

}


function HikeRow(props){
    return (
    <><Col xs={4} className="mt-2"><Card>
    <Card.Header as="h4">{props.hike.label}</Card.Header>
    <Card.Body>
      <Card.Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id laoreet elit. 
      Vestibulum vel diam vel nunc cursus posuere. Phasellus et porttitor augue.
      </Card.Text>
    </Card.Body>
  </Card>
  </Col></>);
}

export default HikesList;