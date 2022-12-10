import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, PlusLg } from 'react-bootstrap-icons';
import { PlusCircle, XLg } from 'react-bootstrap-icons';
import api from '../lib/api';

function Hut(props) {

  const [filterName, setFilterName] = useState(null);
  const [filterCountry, setFilterCountry] = useState(null);
  const [filterGuests, setFilterGuests] = useState(null);
  const [filterBeds, setFilterBeds] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [clearHover, setClearHover] = useState(false);

  useEffect(() => {
    const getHuts = async () => {
        const huts = await api.getHutsListWithFilters(null, null, null, null, null, null);
        props.setHuts(huts);
    }
    if (filterName==null && filterCountry==null && filterGuests==null && filterBeds==null) {getHuts(); console.log(props.user)};
  }, []);

  const navigate = useNavigate();

  const filterHutSubmit = (event) => {
    event.preventDefault();
    props.filteringHut(filterName !== '' ? filterName : null,
      filterCountry !== '' ? filterCountry : null,
      filterGuests !== '' ? filterGuests : null,
      filterBeds !== '' ? filterBeds : null);
  }

  const resetFields = () => {
    setFilterName(null);
    setFilterCountry(null);
    setFilterGuests(null);
    setFilterBeds(null);
    setIsHover(false);
    setSearchHover(false);
    setClearHover(false);
  }

  return (<>
    <Container fluid style={{ height: "93vh" }}>

      <Row id="first-row" fluid style={{ height: "93vh" }}>
        <Col sm={2} style={{ height: "93vh", backgroundColor: "#e0e3e5" }}>

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
            <Row>
            <div className="mt-3">
              <Form>
                <div className="d-grid gap-2">
                  <Button className="rounded-pill mt-4" onClick={(filterHutSubmit)} type='submit'
                    style={{
                      backgroundColor: !searchHover ? '#006666' : '#009999',
                      borderColor: '#e0e3e5',
                      height: '70%',
                      // width: '80%'
                    }}
                    onMouseEnter={() => setSearchHover(true)}
                    onMouseLeave={() => setSearchHover(false)}><strong>Search</strong> <Search className='mb-1' size={"18px"} />
                  </Button>
                </div>
              </Form>
            </div>
          </Row>

          {/* Clear filters  */}
          <Row>
              <Form>
                <div className="d-grid gap-2">
                    <Button className='rounded-pill mt-4'
                      // onClick={() => window.location.reload(false)}
                      onClick={() => resetFields()}
                      style={{
                        backgroundColor: !clearHover ? '#800000' : '#cc0000',
                        borderColor: '#e0e3e5',
                        height: '70%',
                      }}
                      onMouseEnter={() => setClearHover(true)}
                      onMouseLeave={() => setClearHover(false)}><strong>Clear filters</strong> <XLg className='mb-1' size={'18px'} /></Button>
                </div>
              </Form>
          </Row>

        </Col>
        <Col sm={10} style={{ overflowY: 'scroll', height: '93vh' }}>
          {/* BUTTON */}
          {/* {console.log(props.user)} */}
          {/* {1 == 1 ? <Row className="mt-3">
            <div className="d-grid gap-2">
              <Button className="rounded-pill" style={
                {
                  width: "fit-content",
                  // width: "20%",
                  // display: "inline-block",
                  height: "45px",
                  borderColor: "white",
                  backgroundColor: !isHover ? '#006666' : '#009999'
                }
              }
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => navigate("/localGuide/newHut")}><strong><PlusCircle size={"20px"} className="mb-1" /> Add new hut</strong> </Button>
            </div>
          </Row> : <Row className="mt-3"/>} */}
          <Row>
            {<DisplayHut displayedHuts={props.huts} />}
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
