import { useState } from "react";
import { Col, Container, Row, Button, Card, Collapse, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HikeMap from '../components/hikeMap';
import { PinMapFill, FlagFill, HouseDoorFill, ChevronCompactDown, ChevronCompactUp, HouseAddFill } from 'react-bootstrap-icons'


function LocalGuideHikes(props) {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Container fluid className="mt-5" style={{ width: "85%" }} >
        <br></br>
        <Row className="mt-2">
          {
            props.hikes.map(hike => <LocalGuideHikeRow key={hike.id} hike={hike} />)
          }
        </Row>
        <Row className="mt-3">
        <div className="d-grid gap-2">
            <Button className="rounded-pill" style={
              {
                width: "15%",
                height: "45px",
                borderColor: "white",
                backgroundColor: !isHover ? '#009999' : '#00cccc'
              }
            }
            onMouseEnter={ () => setIsHover(true) }
            onMouseLeave={ () => setIsHover(false) }
            onClick = {() => navigate("/localGuide/newHike")}><strong>Add new hike</strong> <HouseAddFill size={"20px"}/></Button>
        </div>
        </Row>
      </Container>
    </>
  );
}

function LocalGuideHikeRow(props) {
  const navigate = useNavigate();
  const auth = props.hike.author.substring(0, props.hike.author.indexOf('@'));
  const [open, setOpen] = useState(false);
  const [isHoverPin, setHoverPin] = useState(false);
  const [isHoverFlag, setHoverFlag] = useState(false);
  const [isHoverHut, setHoverHut] = useState(false);
  return (
    <><Col xs={12} sm={6} lg={4} className="mt-2"><Card >
      <Card.Header>
        <h4>{props.hike.name}</h4>
        <div className='text-secondary fst-italic'>{auth}</div>
      </Card.Header>
      <Card.Body>
        {/* MAP */}
        <HikeMap hike={props.hike} />
        
        {/* ATTRIBUTES */}
        <Card.Text>
          <strong>Length: </strong> {Math.ceil(props.hike.len)} km<br></br>
          <strong>Difficulty: </strong>{props.hike.difficulty} <br></br>
          <strong>Ascent: </strong>{props.hike.ascent} m<br></br>
          <strong>Expected Time: </strong>{Math.ceil(props.hike.expectedTime)} h
        </Card.Text>

        <Card.Text>
          {/* DEFINE REFERENCE POINTS - PIN ON MAP */}
          <OverlayTrigger delay={{ show: 250, hide: 400 }} overlay = {<Tooltip> Define reference points</Tooltip>}>
            <PinMapFill role="button" size="20px" style={{
              color: !isHoverPin ? "black" : "#009999"}} 
              onMouseEnter={ () => setHoverPin(true) }
              onMouseLeave={ () => setHoverPin(false) }
            /> 
          </OverlayTrigger>

          {/* LINK START/END POINT - FLAG */}
          <OverlayTrigger  delay={{ show: 250, hide: 400 }} overlay = {<Tooltip> Link start/end point</Tooltip>}>
            <FlagFill role="button" size="20px" className="ms-2" style={{
              color: !isHoverFlag ? "black" : "#009999"}} 
              onMouseEnter={ () => setHoverFlag(true) }
              onMouseLeave={ () => setHoverFlag(false) }
              onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/localGuide/hikes/" + props.hike.id + "/linkstartend");
              }}
            />
          </OverlayTrigger>

          {/* LINK HUT TO HIKE - HOUSE */}
          <OverlayTrigger delay={{ show: 250, hide: 400 }} overlay = {<Tooltip> Link hut to hike</Tooltip>}>
            <HouseDoorFill role="button" size="20px" className="ms-2" style={{
              color: !isHoverHut ? "black" : "#009999"}} 
              onMouseEnter={ () => setHoverHut(true) }
              onMouseLeave={ () => setHoverHut(false) }onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/localGuide/hikes/" + props.hike.id + "/linkhut");
            }} />
          </OverlayTrigger>

          {/* OPEN/CLOSE DESCRIPTION */}
          {!open ? (
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

export default LocalGuideHikes;