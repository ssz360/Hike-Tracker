import { Row, Col, Form, FloatingLabel, Button, Card } from 'react-bootstrap';
import { PointMap } from '../components';

import { useState } from 'react';

function Hut(props) {

    const [filterName, setFilterName] = useState(null);
    const [filterCountry, setFilterCountry] = useState(null);
    const [filterGuests, setFilterGuests] = useState(null);
    const [filterBeds, setFilterBeds] = useState(null);

    let displayedHuts = [];
    props.huts.forEach(hut => displayedHuts.push(hut));

    const filterHutSubmit = (event) => {
      event.preventDefault();
      props.filteringHut(filterName!==''? filterName : null, 
        filterCountry!==''? filterCountry : null, 
        filterGuests!==''? filterGuests : null, 
        filterBeds!==''? filterBeds : null);
  
  }
    
    return(<>
    <Row className="mt-2">
      <div className="text-center"><h4>Search an hut with the filters!</h4></div>
    </Row>

    <Row className="justify-content-md-center mt-4 mb-2">
    <Col xs={4}>
    <Form>
      <Form.Group className="mb-3" controlId="InputName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Name" onChange={(event) => setFilterName(event.target.value)}/>
      </Form.Group>
    </Form>
    </Col>

    
    <Col xs={4}>
    <Form>
      <Form.Group className="mb-3" controlId="InputCountry">
        <Form.Label>Country</Form.Label>
        <Form.Control type="text" placeholder="Country" onChange={(event) => setFilterCountry(event.target.value)}/>
      </Form.Group>
    </Form>
    </Col>

    </Row>

    <Row className="justify-content-md-center">
    <Col xs={4}>
    <Form>
      <Form.Group className="mb-3" controlId="InputGuests">
        <Form.Label>N° of guest</Form.Label>
        <Form.Control type="number" min={0} step={1} onChange={(event) => setFilterGuests(event.target.value)}/>
      </Form.Group>
    </Form>
    </Col>

    <Col xs={4}>
    <Form>
      <Form.Group className="mb-3" controlId="InputBeds">
        <Form.Label>N° of bedrooms</Form.Label>
        <Form.Control type="number" min={0} step={1} onChange={(event) => setFilterBeds(event.target.value)}/>
      </Form.Group>
    </Form>
    </Col>
    </Row>

    <Row className="justify-content-md-center">
        <Col xs={8}>
        <Form onSubmit={(filterHutSubmit)}>
            <Button variant="success" type='submit'>Search</Button>
        </Form>
        </Col>
    </Row>

    <Row className="mt-2 mb-3">
        {
        <DisplayHut displayedHuts={displayedHuts}/>
        }
    </Row>
    <div className="mb-5"> </div></>)
}

function DisplayHut(props){
    return props.displayedHuts.map((hut) => <HutRow hut={hut}/>)
}

function HutRow(props){
    return (
        <><Col xs={4} className="mt-2"><Card>
        <Card.Header><h4>{props.hut.name}</h4>
        </Card.Header>
        <Card.Body>
          <Card.Text><strong>Country: </strong>{props.hut.country}<br></br>
          <strong>Number of Guests: </strong>{props.hut.numberOfGuests} <br></br>
          <strong>Number of Bedrooms: </strong>{props.hut.numberOfBedrooms}
          </Card.Text>
        </Card.Body>
      </Card>
      </Col></>);
}

const validateInfo = (name, country, numberOfGuests, numberOfBedrooms, coordinate, setMessage) => {
	if ([name, country, numberOfGuests, numberOfBedrooms, coordinate, setMessage].some(t => t.length === 0)) {
		setMessage("All fields should to be filled");
		return false;
	}
	if (name.match(/^\s+$/)) {
		setMessage("Invalid hut name.");
		return false;
	}
	if (!country.match(/^[a-zA-Z]+[a-zA-Z]+$/)) {
		setMessage("Invalid country name.");
		return false;
	}
	if (!(coordinate.split(",").length === 2 && coordinate.split(",").every(t => t.match(/^([0-9]*[.])?[0-9]+$/)))) {
		setMessage("The coordinates should be two numbers separated by comma");
		return false;
	}
	return true;
};


export default Hut;
