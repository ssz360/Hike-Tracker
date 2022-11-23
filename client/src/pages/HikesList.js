import { Col, Row, Form, Button, Card, Collapse, InputGroup, Container } from 'react-bootstrap';
import { useState } from 'react';
import AreaMap from '../components/areaMap';
import HikeMap from '../components/hikeMap';

function HikesList(props){
    const [center,setCenter]=useState();
    const [radius,setRadius]=useState(0);
    const [lenMin, setLenMin] = useState(null);
    const [lenMax, setLenMax] = useState(null);
    const [dif, setDif] = useState(null);
    const [ascMin, setAscMin] = useState(null);
    const [ascMax, setAscMax] = useState(null);
    const [timeMin, setTimeMin] = useState(null);
    const [timeMax, setTimeMax] = useState(null);
    const [openArea, setOpenArea] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await props.filtering(center!==undefined?{center:center,radius:radius}:undefined, 
          lenMin!==''? lenMin : null, 
          lenMax!==''? lenMax : null, 
          dif!==''? dif : null, 
          ascMin!==''? ascMin : null, 
          ascMax!==''? ascMax : null, 
          timeMin!==''? timeMin : null, 
          timeMax!==''? timeMax : null);
    
    }

    return (
        <>
        {openArea ? (<AreaMap center={center} setCenter={setCenter} radius={radius} setRadius={setRadius} drag={false} openArea={openArea} setOpenArea={setOpenArea}/>) : <></>}
        <Row className="mt-2">
        <div className="text-center"><h4>Search your favorite hike with the filters!</h4></div>
        </Row>

        <div className="mt-2">
        <Row className="justify-content-md-center">
            <Col xs={4}><div className="d-grid gap-2"> 
            <Button variant={center!==undefined?"success":"outline-dark"} onClick={() => setOpenArea(true)}>{center!==undefined?"Area selected!":"Select Area..."}</Button>
            </div>
            </Col>
            
            <Col xs={4}> <Form.Select aria-label="Difficulty" onChange={(event) => setDif(event.target.value)}>
                    <option value = "" >Difficulty</option>
                    <option value="TOURIST">Tourist</option>
                    <option value="HIKER">Hiker</option>
                    <option value="PROFESSIONAL HIKER">Professional hiker</option>
                    </Form.Select>
            </Col>

        
        </Row>
        </div>

        <div className="mt-3">
        <Row className="justify-content-md-center">
        <Col xs={4}> <div className="d-grid gap-2"><strong>Length</strong></div>
        </Col>
        <Col xs={4}> <div className="d-grid gap-2"><strong>Ascent</strong></div>
        </Col>
        </Row>
        </div>


        <div className="mt-2">
        <Row className="justify-content-md-center">

        <Col xs={4}> <InputGroup className="mb-3">
                <InputGroup.Text>Min</InputGroup.Text>
                <Form.Control type="number" min={0} aria-label="Lenght Min" onChange={(event) => setLenMin(event.target.value)}/>
                <InputGroup.Text>km</InputGroup.Text>
                 
                <InputGroup.Text>Max</InputGroup.Text>
                <Form.Control type="number" min={0} aria-label="Lenght Max" onChange={(event) => setLenMax(event.target.value)}/>
                <InputGroup.Text>km</InputGroup.Text>
              </InputGroup>
            </Col>
            
            <Col xs={4}> <InputGroup className="mb-3">
                <InputGroup.Text>Min</InputGroup.Text>
                <Form.Control type="number" min={0} step={50} aria-label="Ascent Min" onChange={(event) => setAscMin(event.target.value)}/>
                <InputGroup.Text>m</InputGroup.Text>
                <InputGroup.Text>Max</InputGroup.Text>
                <Form.Control type="number" min={0} step={50} aria-label="Ascent Max" onChange={(event) => setAscMax(event.target.value)}/>
                <InputGroup.Text>m</InputGroup.Text>
              </InputGroup>
            </Col>
            </Row>

            <div className="mb-2">
            <Row className="justify-content-md-center">
            <Col xs={8}> <div className="d-grid gap-2"><strong>Time Expected</strong></div>
            </Col>
            </Row>
            </div>

            <Row className="justify-content-md-center">
              <Col xs={4}> <InputGroup className="mb-3">
                <InputGroup.Text>Min</InputGroup.Text>
                <Form.Control type="number" min={0} step={0.5} aria-label="Time Min" onChange={(event) => setTimeMin(event.target.value)}/>
                <InputGroup.Text>h</InputGroup.Text>
                <InputGroup.Text>Max</InputGroup.Text>
                <Form.Control type="number" min={0} step={0.5} aria-label="Time Max" onChange={(event) => setTimeMax(event.target.value)}/>
                <InputGroup.Text>h</InputGroup.Text>
              </InputGroup>
            </Col>

            <Col xs={4}> 
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
                <Display logged={props.logged} displayedHikes={props.hikes}/>
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
    const auth = props.hike.author.substring(0, props.hike.author.indexOf('@'));
    const [open, setOpen] = useState(false);
    return (
    <><Col xs={12} sm={6} md={4} className="mt-2"><Card>
    <Card.Header>
    <Container><Row>
      <Col xs={8}><h4>{props.hike.name}</h4></Col>
      <Col className='text-secondary fst-italic'>{auth}</Col>
      </Row>
    </Container>
    </Card.Header>
    <Card.Body>
      {props.logged?<HikeMap hike={props.hike}/>:<></>}
      <Card.Text><strong>Length: </strong>{props.hike.len} km<br></br>
      <strong>Difficulty: </strong>{props.hike.difficulty} <br></br>
      <strong>Ascent: </strong>{props.hike.ascent} m<br></br>
      <strong>Expected Time: </strong>{props.hike.expectedTime} h
      </Card.Text>
      <Card.Text>{!open ? (
      <a className="text-decoration-none" style={{fontSize:"14px"}}
      onClick={() => setOpen(!open)}
      aria-controls="example-collapse-text"
      aria-expanded={open}>• show more</a>) 
    :
    (<a className="text-decoration-none" style={{fontSize:"14px"}}
    onClick={() => setOpen(!open)}
    aria-controls="example-collapse-text"
    aria-expanded={open}>• show less</a>)}
    <Collapse in={open}>
        <div id="example-collapse-text">
          <Card className="bg-light text-dark">
            <Card.Body><strong>Description: </strong>{props.hike.description}</Card.Body>
          </Card>
        </div>
      </Collapse>
      </Card.Text>
    </Card.Body>
  </Card>
  </Col></>);
}

export default HikesList;