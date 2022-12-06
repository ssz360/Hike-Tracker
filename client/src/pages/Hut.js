import { Container, Row, Col, Form, FloatingLabel, Button, Card } from 'react-bootstrap';
import { PointMap } from '../components';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { Search, PlusLg } from 'react-bootstrap-icons'

function Hut(props) {

  const [filterName, setFilterName] = useState(null);
  const [filterCountry, setFilterCountry] = useState(null);
  const [filterGuests, setFilterGuests] = useState(null);
  const [filterBeds, setFilterBeds] = useState(null);
  const navigate = useNavigate();

  let displayedHuts = [];
  props.huts.forEach(hut => displayedHuts.push(hut));

  const filterHutSubmit = (event) => {
    event.preventDefault();
    props.filteringHut(filterName !== '' ? filterName : null,
      filterCountry !== '' ? filterCountry : null,
      filterGuests !== '' ? filterGuests : null,
      filterBeds !== '' ? filterBeds : null);

  }

  return (<><Container className="mt-5" fluid style={{ height: "100vh" }}>
    <Row id="first-row" style={{ height: "100vh" }}>
      <Col sm={2} className="mr-3" style={{ height: "100vh", backgroundColor: "#e0e3e5" }}>

        {/***** Name filter *****/}
        <div className="mt-4">
          <div className="d-grid gap-2">
            <Form>
              <Form.Group className="mb-3" controlId="InputName">
                <Form.Label><strong>Name</strong></Form.Label>
                <Form.Control type="text" placeholder="Name" onChange={(event) => setFilterName(event.target.value)} />
              </Form.Group>
            </Form>
          </div>
        </div>

        {/***** Country filter *****/}
        <div className="mt-2">
          <div className="d-grid gap-2">
            <Form>
              <Form.Group className="mb-3" controlId="InputCountry">
                <Form.Label><strong>Country</strong></Form.Label>
                <Form.Control type="text" placeholder="Country" onChange={(event) => setFilterCountry(event.target.value)} />
              </Form.Group>
            </Form>
          </div>
        </div>

        {/***** N° of guest filter *****/}
        <div className="mt-2">
          <div className="d-grid gap-2">
            <Form>
              <Form.Group className="mb-3" controlId="InputGuests">
                <Form.Label><strong>N° of guest</strong></Form.Label>
                <Form.Control type="number" min={0} step={1} onChange={(event) => setFilterGuests(event.target.value)} />
              </Form.Group>
            </Form>
          </div>
        </div>

        {/***** N° of bedrooms filter *****/}
        <div className="mt-2">
          <div className="d-grid gap-2">
            <Form>
              <Form.Group className="mb-3" controlId="InputBeds">
                <Form.Label><strong>N° of bedrooms</strong></Form.Label>
                <Form.Control type="number" min={0} step={1} onChange={(event) => setFilterBeds(event.target.value)} />
              </Form.Group>
            </Form>
          </div>
        </div>

        {/***** Submit button *****/}
        <div className="mt-2">
          <div className="d-grid gap-2">
            <Form>
              <div className="d-grid gap-2">
                <Col md={{ span: 3, offset: 10 }}>
                  <Search className="mt-2" onClick={(filterHutSubmit)} type='submit' size={"20px"} />
                </Col>
              </div>
            </Form>
          </div>
        </div>

      {/***** Add new hut button *****/}
      {props.user.type === "localGuide" &&
      <div className="mt-2">
          <div className="d-grid gap-2">
            <Form>
              <div className="d-grid gap-2">
                <Col md={{ span: 3, offset: 10 }}>
                  <PlusLg className="mt-2" role='button' size={"25px"} onClick={(() => navigate("/localGuide/newHut"))} />
                </Col>
              </div>
            </Form>
          </div>
        </div>
      }


      </Col>
      <Col sm={9} className="mx-2">
        <Row>
          {
            <DisplayHut displayedHuts={displayedHuts} />
          }
        </Row>
      </Col>

    </Row>
  </Container></>)
}

function DisplayHut(props) {
  return props.displayedHuts.map((hut) => <HutRow hut={hut} />)
}

function HutRow(props) {
  return (
    <><Col xs={4} className="mt-2"><Card className="shadow mt-3">
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
