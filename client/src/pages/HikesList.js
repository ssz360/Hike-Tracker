import { Col, Row, Form, Button, Card, Collapse, InputGroup, Container, OverlayTrigger, Tooltip, Modal, Alert, Placeholder } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import AreaMap from '../components/areaMap';
import HikeMap from '../components/hikeMap';
import MultiRangeSliderHooked from '../components/MultiRangeSliderHooked'
import { ChevronCompactDown, ChevronCompactUp, BookmarkHeartFill, Search, XLg, CalendarPlus } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import ServerReply from '../components/serverReply';
import api from '../lib/api'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { GallerySlider } from '../components';
import React from 'react';

dayjs.extend(duration);

function HikesList(props) {

  const [errorStartHike, setErrorStartHike] = useState();
  const [waitingStartHike, setWaitingStartHike] = useState(false);
  const [center, setCenter] = useState();
  const [radius, setRadius] = useState(0);
  const [lenMin, setLenMin] = useState(null);
  const [lenMax, setLenMax] = useState(null);
  const [dif, setDif] = useState(null);
  const [ascMin, setAscMin] = useState(null);
  const [ascMax, setAscMax] = useState(null);
  const [timeMin, setTimeMin] = useState(null);
  const [timeMax, setTimeMax] = useState(null);
  const [openArea, setOpenArea] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [clearHover, setClearHover] = useState(false);
  const [startingHike, setStartingHike] = useState(-1);
  const [timeStartingHike, setTimeStartingHike] = useState();
  const [changeStart, setChangeStart] = useState(false);
  const [unfinishedHikeId, setUnfinishedHikeId] = useState(-1);
  const [updateCard, setUpdateCard] = useState(false);
  const navigate = useNavigate();
  let updateTimeout;
  const icon = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
  </svg>);


  const handleSubmit = async (event) => {
    event.preventDefault();
    await props.filtering(center !== undefined ? { center: center, radius: radius / 1000 } : undefined,
      lenMin !== '' ? lenMin : null,
      lenMax !== '' ? lenMax : null,
      dif !== '' ? dif : null,
      ascMin !== '' ? ascMin : null,
      ascMax !== '' ? ascMax : null,
      timeMin !== '' ? timeMin : null,
      timeMax !== '' ? timeMax : null);

  }

  const resetFields = () => {
    setCenter();
    setRadius(0);
    setLenMin(null);
    setLenMax(null);
    setDif(null);
    setAscMin(null);
    setAscMax(null);
    setTimeMin(null);
    setTimeMax(null);
    setOpenArea(false);
    setSearchHover(false);
    setClearHover(false);
    props.setAllHikesShow();
  }

  function goToTop() {
    document.getElementById('hikes-container').scrollTo({ top: 0, behavior: 'smooth' });
  }

  const updateCallback = () => setUpdateCard(!updateCard);
  const manageUpdates = () => {
    clearTimeout(updateTimeout);// setTimeout returns the numeric ID which is used by
    // clearTimeOut to reset the timer
    updateTimeout = setTimeout(updateCallback, 300);
  };

  //if we get again in this page no filter should be on and we should see again all hikes
  useEffect(() => {
    if (center === undefined && radius === 0 && lenMin === null && lenMax === null && dif === null && ascMin === null && ascMax === null && timeMin === null && timeMax === null)
      props.setAllHikesShow();
    window.addEventListener('resize', manageUpdates);
    return (() => window.removeEventListener('resize', manageUpdates));
  }, [])
  const startHike = id => setStartingHike(id);
  const submitStartHike = async () => {
    try {
      setWaitingStartHike(true);
      await api.startHike(startingHike,timeStartingHike!==''?timeStartingHike:dayjs().format('YYYY-MM-DDTHH:mm:ss'));
      setWaitingStartHike(false);
      setErrorStartHike();
      navigate('/profile/hikes');
    } catch (error) {
      setErrorStartHike(error);
      setWaitingStartHike(false);
      setTimeout(() => setErrorStartHike(), 3000);
    }
  }

  useEffect(() => {
    const getUnfinishedHike = async () => {
      try {
        if (props.logged) {
          const hikeDetails = await api.getUnfinishedHike(props.user.username);
          setUnfinishedHikeId(hikeDetails.hikeId);
        }
        else {
          setUnfinishedHikeId(-1);
        }
      } catch (error) {
        setUnfinishedHikeId(-1);
      }
    }
    getUnfinishedHike();
  }, [props.user]);
  return (
    <Container fluid style={{ height: "93vh" }}>
      {/******* START NEW HIKE MODAL  *******/}
      <Modal className='my-2' show={startingHike !== -1} onHide={e => setStartingHike(-1)}>
        <Modal.Header style={{ backgroundColor: "#e0e3e5" }} closeButton><strong><h2>Let's start!</h2> <i><h4>{startingHike !== -1 ? props.hikes.find(p => p.id === startingHike).name : ''}</h4></i></strong></Modal.Header>
        <Modal.Body>
          <Container>
            <Row className='my-3'>
              <Col sm={12}>
                <strong> Starting date and time</strong>
              </Col>
            </Row>
            <Row>
              <Col sm={5}>
                <Flatpickr className="ms-3" data-enable-time value={timeStartingHike} onChange={([date]) => setTimeStartingHike(date)} options={{ maxDate: dayjs().format('YYYY-MM-DDTHH:mm:ss') }} />
              </Col>
              <Col sm={2}>
                <OverlayTrigger overlay={<Tooltip>Reset to now</Tooltip>}>
                  <svg onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTimeStartingHike(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
                    setChangeStart(false);
                  }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-calendar2-x-fill ms-4  " viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zm9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5zm-6.6 5.146a.5.5 0 1 0-.708.708L7.293 10l-1.147 1.146a.5.5 0 0 0 .708.708L8 10.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 10l1.147-1.146a.5.5 0 0 0-.708-.708L8 9.293 6.854 8.146z" />
                  </svg>
                </OverlayTrigger>
              </Col>
            </Row>
            <Row >
              <Col className="d-flex flex-row-reverse mt-4">
                  <OverlayTrigger overlay={<Tooltip>Start!</Tooltip>}>
                <svg role="button" variant="outline-success" onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  submitStartHike();
                }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green" className=" float-right bi bi-play-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
              </svg>
                  </OverlayTrigger>
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col >
                <ServerReply error={errorStartHike} errorMessage={"Couldn't start the hike, retry!"} waiting={waitingStartHike} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* FILTERS AND HIKES LIST */}
      <Row id="first-row" style={{ height: "93vh" }}>
        <Col sm={2} style={{ height: "93vh", backgroundColor: "#e0e3e5" }}>

          {openArea && (<AreaMap center={center} setCenter={setCenter} radius={radius} setRadius={setRadius} drag={false} openArea={openArea} setOpenArea={setOpenArea} />)}
          {props.logged &&
          <div className="mt-4">
            <div className="d-grid gap-2">
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip> Your preferences</Tooltip>}
              >
                <BookmarkHeartFill className="ms-4" role="button" size={"20px"}
                  onClick={async (event) => {
                    event.preventDefault();
                    await api.getUserPerformance(props.user.username)
                      .then(usrPref => {
                        setLenMin(usrPref.MinLength);
                        setLenMax(usrPref.MaxLength);
                        setAscMin(usrPref.MinAscent);
                        setAscMax(usrPref.MaxAscent);
                        setTimeMin(usrPref.MinTime);
                        setTimeMax(usrPref.MaxTime);
                      }, err => {console.log(err)});
                  }} />
              </OverlayTrigger>
            </div>
          </div>
          }
          {/***** Area filter *****/}
          <div className="mt-4">
            <div className="d-grid gap-2">
              <Button variant={center !== undefined ? "success" : "outline-dark"} onClick={() => setOpenArea(true)}>{center !== undefined ? "Area selected!" : "Select Area..."}</Button>
            </div>
          </div>

          {/***** Difficulty filter *****/}
          <div className="mt-4">
            <div className="d-grid gap-2">
              <Form.Select className="text-center" style={{ backgroundColor: "#e0e3e5", border: '1px solid #000000' }} aria-label="Difficulty" onChange={(event) => setDif(event.target.value)}>
                <option value="" >Difficulty</option>
                <option value="TOURIST">Tourist</option>
                <option value="HIKER">Hiker</option>
                <option value="PROFESSIONAL HIKER">Professional hiker</option>
              </Form.Select>
            </div>
          </div>


          {/***** Length filter *****/}
          <Row>
            <div className="mt-4 flex" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="d-grid gap-2" style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
                <strong>Length</strong>
                <InputGroup className="mb-3">
                  <MultiRangeSliderHooked
                    defaultMin={0}
                    defaultMax={40}
                    min={lenMin}
                    max={lenMax}
                    setMin={setLenMin}
                    setMax={setLenMax} />
                </InputGroup>
              </div>
            </div>
          </Row>

          {/***** Ascent filter *****/}
          <div className="mt-4">
            <div className="d-grid gap-2">
              <strong>Ascent</strong>
              <InputGroup className="mb-3">
                <MultiRangeSliderHooked
                  defaultMin={0}
                  defaultMax={4000}
                  min={ascMin}
                  max={ascMax}
                  setMin={setAscMin}
                  setMax={setAscMax} />
              </InputGroup>
            </div>
          </div>

          {/***** Time Expected filter *****/}
          <div className="mt-4">
            <div className="d-grid gap-2">
              <strong>Time Expected</strong>
              <InputGroup className="mb-3">
                <MultiRangeSliderHooked
                  defaultMin={0}
                  defaultMax={24}
                  min={timeMin}
                  max={timeMax}
                  setMin={setTimeMin}
                  setMax={setTimeMax} />
              </InputGroup>
            </div>
          </div>

          {/***** Submit button *****/}
          <Row>
            <div className="mt-4">
              <Form>
                <div className="d-grid gap-2">
                  <Button className="rounded-pill mt-4" onClick={(handleSubmit)} type='submit'
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

          {/***** Clear filters *****/}
          <Row>
            <Form>
              <div className="d-grid gap-2">
                <Button className='rounded-pill mt-4'
                  onClick={resetFields}
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
        {/***** Hikes List *****/}
        <Col onScroll={manageUpdates} className="hikes-container" id="hikescontainer" sm={10} style={{ overflowY: 'scroll', height: '93vh' }}>
          <Row>
            {unfinishedHikeId !== -1 &&
              <Alert className='mt-4 justify-content-center mx-auto' style={{ width: '95%' }} variant='info' onClose={() => setUnfinishedHikeId(-1)} dismissible>
                <Alert.Heading>You started a hike but still have to complete it!</Alert.Heading>
                <strong>
                  You still have to complete hike <Alert.Link href={props.hikes ? '/profile/hikes' : '#'}>{props.hikes ? props.hikes.find(p => p.id === unfinishedHikeId).name : 'error'}</Alert.Link>
                </strong>
              </Alert>}
            {<Display updateCard={updateCard} startHike={startHike} setTimeStartingHike={setTimeStartingHike} unfinishedHikeId={unfinishedHikeId} logged={props.logged} displayedHikes={props.hikes.filter(h => h.show)} star />}
          </Row>
        </Col>

      </Row>
      {/***** Button to go up to carousel ******/}
      <a onClick={() => goToTop()} href="#first-row" className='go-top-btn' color='#009999'>{icon}</a>
    </Container>
  )

}


function Display(props) {
  return props.displayedHikes.map((hike) => <HikeRowContainer setTimeStartingHike={props.setTimeStartingHike} updateCard={props.updateCard} key={hike.id} unfinishedHikeId={props.unfinishedHikeId} startHike={props.startHike} logged={props.logged} hike={hike} />)
}

function HikeRowContainer(props) {
  return (
    <Col xs={12} sm={8} md={6} lg={4} className="mt-2" id={'hikecard' + props.hike.id}>
      <HikeRow setTimeStartingHike={props.setTimeStartingHike} updateCard={props.updateCard} unfinishedHikeId={props.unfinishedHikeId} startHike={props.startHike} logged={props.logged} hike={props.hike} />
    </Col>
  );
}

function isInViewport(id) {
  let rect = document.getElementById(id);
  if (rect) rect = rect.getBoundingClientRect();
  else return undefined;
  const contrect = document.getElementById('hikescontainer');
  return (
    rect.top >= -1000 && rect.top <= (window.innerHeight || contrect.clientHeight) + 1000
  );
}
function HikeRow(props) {
  const auth = props.hike.author.substring(0, props.hike.author.indexOf('@'));
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [active, setActive] = useState('images');
  const [visible, setVisible] = useState(false);
  let timeOutId;
  const updateViewability = () => {
    const v = isInViewport('hikecard' + props.hike.id);
    if (v === undefined) {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(updateViewability, 250);
    }
    setVisible(v);
  }
  const manageUpdates = () => {
    clearTimeout(timeOutId);// setTimeout returns the numeric ID which is used by
    // clearTimeOut to reset the timer
    timeOutId = setTimeout(updateViewability, 500);
  };
  /*attach updates listener and release them at unmount
  useEffect(()=>{
    window.addEventListener('resize',manageUpdates);
    return(()=>{
      window.removeEventListener('resize',manageUpdates);
    }
    )
  },[]);*/
  //get images if the active state is that and the card is visible
  useEffect(() => {
    const getImgs = async () => {
      try {
        const ret = await api.getImagesHike(props.hike.id);
        setImages([...ret]);
      } catch (error) {
        setImages([]);
      }
    }
    if (visible && active === 'images') getImgs();
    else setImages([]);
  }, [visible, active]);

  useEffect(() => {
    manageUpdates();
  }, [props.updateCard]);

  if(visible) return (
    <Card className="shadow mt-3 hikes-card">
      <Card.Header className='hikecardheader'>
        <Row className='m-3 hikecardcont'>
          <Col className='hikecardtitle' style={{ fontFamily: "monaco, arial black, sans serif" }}>{props.hike.name}</Col>
          <Col xs={2} className='hikecardnav'>
            <div className='hikecardnavsel'>
              <span onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setActive('images');
              }} className={"material-icons-round hikeselectimage" + (active === 'images' ? ' active' : '')} role="button">
                collections
              </span>
              {!props.logged ? <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip>Log in to see the map</Tooltip>}>
                <span onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (props.logged) setActive('map');
                }} className={"material-icons-round ms-1 hikeselectmap" + (active === 'map' ? ' active' : '') + ' disabled'} role="button">
                  map
                </span>
              </OverlayTrigger> :
                <span onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (props.logged) setActive('map');
                }} className={"material-icons-round ms-1 hikeselectmap" + (active === 'map' ? ' active' : '')} role="button">
                  map
                </span>
              }
            </div>
          </Col>
        </Row>
        {visible ?
          active === 'images' ?
            <GallerySlider dots={false} className='hikecardel' add={false} images={images.length > 0 ? images : [{ url: '/images/placeholder.png' }]} />
            :
            active === 'map' && props.logged ?
              <HikeMap on hike={props.hike} />
              :
              <></>
          :
          <GallerySlider className='hikecardel' add={false} images={[{ url: '/images/placeholder.png' }]} />
        }
      </Card.Header>
      <Card.Body>
        <Card.Text>

          <Row>
            <Col>
              <strong>Length: </strong><div className='hike-desc'><span className='test-length'>{Math.ceil(props.hike.len)}</span> km<br></br></div>
              <strong>Difficulty: </strong><div className='hike-desc'><span className='test-difficulty'>{props.hike.difficulty}</span> <br></br></div>
            </Col>
            <Col>
              <strong>Ascent: </strong><div className='hike-desc'><span className='test-ascent'>{Math.ceil(props.hike.ascent)}</span> m<br></br></div>
              <strong>Expected Time: </strong><div className='hike-desc'><span className='test-time'>{Math.ceil(props.hike.expectedTime)}</span> h</div>
            </Col>
          </Row>
          <Row>
            <Col md={10}>
              <div className='text-secondary fst-italic card-author'><small>Author:</small> {auth}</div>
            </Col>
            <Col md={2}>
              {!open ? (
                <div className="hike-expandable">

                  < ChevronCompactDown role="button" className="text-decoration-none" style={{ fontSize: "20px" }}
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open} />
                </div>)
                :
                (<div className="hike-expandable">
                  < ChevronCompactUp role="button" className="text-decoration-none" style={{ fontSize: "20px" }}
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open} />
                </div>)}
            </Col>
          </Row>

        </Card.Text>
        <Collapse in={open}>
          <div id="hike-desc-text">
            <strong>Description: </strong>{props.hike.description}
          </div>
        </Collapse>
        <Card.Text >
        </Card.Text>
      </Card.Body>
      {props.logged && props.unfinishedHikeId === -1 &&
        <div className="justify-content-center mx-auto mb-2" onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          props.setTimeStartingHike(dayjs().format('YYYY-MM-DDTHH:mm:ss'))
          props.startHike(props.hike.id);
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
          </svg></div>
      }
    </Card>);
    else return (
      <Card className="shadow mt-3">
        <Card.Img src='/images/placeholder.png'/>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="primary" xs={6} />
        </Card.Body>
      </Card>
    )
}

export default HikesList;