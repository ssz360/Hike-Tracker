import { useState } from "react";
import { Col, Container, Row, Button, Card, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HikeMap from '../components/hikeMap';


function LocalGuideHikes(props){
    return (
        <>
            <Container fluid className="my-4 text-center" style={{width:"85%"}} >
                <Row className="mt-2">
                {
                    props.hikes.map(hike=> <LocalGuideHikeRow key={hike.id} hike={hike}/>)
                }
                </Row>
            </Container>
        </>
    );
}

function LocalGuideHikeRow(props){
  const navigate=useNavigate();
    const auth = props.hike.author.substring(0, props.hike.author.indexOf('@'));
    const [open, setOpen] = useState(false);
    return (
    <><Col xs={12} sm={6} lg={4} className="mt-2"><Card border="info">
    <Card.Header>
      <h4>{props.hike.name}</h4>
      <div className='text-secondary fst-italic'>{auth}</div>
    </Card.Header>
    <Card.Body>
      <HikeMap hike={props.hike}/>
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
      <Container fluid>
        <Row>
          <Col xs={12} sm={6}>
                    <Button variant="outline-info" size="sm" onClick={e=>{
                        e.preventDefault();
                        e.stopPropagation();
                        navigate("/localGuide/hikes/"+props.hike.id+"/linkstartend");
                    }}><strong>Update start/end point!</strong></Button>
          </Col>
          <Col xs={12} sm={6}>
                    <Button variant="outline-dark" className="mx-2" size="sm" onClick={e=>{
                            e.preventDefault();
                            e.stopPropagation();
                            navigate("/localGuide/hikes/"+props.hike.id+"/linkhut");
                        }}><strong>Link new hut!</strong></Button>
          </Col>
          </Row>
      </Container>
      </Card.Body>
  </Card>
  </Col></>);
}

export default LocalGuideHikes;