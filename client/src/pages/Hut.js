import { Container, Row, Col, Form, Button, Card, Collapse, Placeholder } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Search } from 'react-bootstrap-icons';
import { XLg, ChevronCompactDown, ChevronCompactUp } from 'react-bootstrap-icons';
import api from '../lib/api';
import { GallerySlider } from '../components';
import React from 'react';

function Hut(props) {

  const [filterName, setFilterName] = useState(null);
  const [filterCountry, setFilterCountry] = useState(null);
  const [filterGuests , setFilterGuests] = useState(null);
  const [filterBeds, setFilterBeds] = useState(null);
  const [, setIsHover] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [clearHover, setClearHover] = useState(false);

  useEffect(() => {
    const getHuts = async () => {
      const huts = await api.getHutsListWithFilters(null, null, null, null, null, null);
      props.setHuts(huts);
    }
    if (filterName == null && filterCountry == null && filterGuests == null && filterBeds == null) { getHuts(); console.log(props.user) };
  }, []);

  const filterHutSubmit = (event) => {
    event.preventDefault();
    props.filteringHut(filterName !== '' ? filterName : null,
      filterCountry !== '' ? filterCountry : null,
      filterBeds !== '' ? filterBeds : null);
  }

  const resetFields = async () => {
    console.log("In reset fields");
    setFilterName("");
    setFilterCountry("");
    setFilterGuests("");
    setFilterBeds("");
    setIsHover(false);
    setSearchHover(false);
    setClearHover(false);
    const huts = await api.getHutsListWithFilters(null, null, null, null, null, null);
    props.setHuts(huts);
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
                  <Form.Control type="text" placeholder="Name" value={filterName} onChange={(event) => setFilterName(event.target.value)} />
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
                  <Form.Control type="text" placeholder="Country" value={filterCountry} onChange={(event) => setFilterCountry(event.target.value)} />
                </Form.Group>
              </Form>
            </div>
          </div>

          {/***** N° of bedrooms filter *****/}
          <div className="mt-2">
            <div className="d-grid gap-2">
              <Form>
                <Form.Group className="mb-3" controlId="InputBeds">
                  <Form.Label><strong>Min n° of beds</strong></Form.Label>
                  <Form.Control type="number" min={0} step={1} value={filterBeds} onChange={(event) => setFilterBeds(event.target.value)} />
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
          <Row>
            {<DisplayHut displayedHuts={props.huts} />}
          </Row>
        </Col>

      </Row>
    </Container></>)
}

function DisplayHut(props) {
  return props.displayedHuts.map((hut) => <HutRow key={hut.coordinate} hut={hut} />)
}

function HutRow(props) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  useEffect(() => {
    const getImgs = async () => {
      try {
        const ret = await api.getImagesPoint(props.hut.id);
        setImages([...ret]);
      } catch (error) {
        setImages([]);
      }
    }
    getImgs();
  }, [])
  return (
    <><Col xs={12} sm={6} md={4} className="mt-2"><Card className="shadow mt-3">
      <Card.Header><h4>{props.hut.name}</h4>
      </Card.Header>
      <Card.Body>
        {images.length > 0 ?
          <GallerySlider add={false} images={images} />
          :
          <GallerySlider add={false} images={[{ url: '/images/placeholder.png' }]} />
        }
        <Card.Text className='mt-2'><strong>Country: </strong>{props.hut.country}<br></br>
          <strong>Number of Bedrooms: </strong>{props.hut.numberOfBedrooms}<br></br>
          <strong>Phone: </strong>{props.hut.phone}<br></br>
          <strong>Email: </strong>{props.hut.email}<br></br>
          <strong>Website: </strong><a href={props.hut.website}>{props.hut.website}</a>

        </Card.Text>
        <Card.Text >{!open ? (
          <div className="d-flex flex-row-reverse">
            < ChevronCompactDown role="button" className="text-decoration-none" style={{ fontSize: "20px" }}
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open} />
          </div>)
          :
          (<div className="d-flex flex-row-reverse">
            < ChevronCompactUp role="button" className="text-decoration-none" style={{ fontSize: "20px" }}
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open} />
          </div>)}
          {/* Text in expanded selection */}
          <Collapse in={open}>
            <div id="example-collapse-text">
              <Card className="bg-light text-dark">
                <Card.Body><strong>Description: </strong>{props.hut.description}</Card.Body>
              </Card>
            </div>
          </Collapse>
        </Card.Text>
      </Card.Body>
    </Card>
    </Col></>);
}

export default Hut;
