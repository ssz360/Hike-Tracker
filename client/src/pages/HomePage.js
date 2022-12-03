import HikesList from "./HikesList";



import { Carousel, Row, Image, Container, Col } from 'react-bootstrap';

function HomePage(props){
    return (<>
        <Carousel className="d-block w-100">
        <Carousel.Item>
        <Image
        className="d-block w-100"
        style={{width: "100%",
            height: "auto",
            objectFit: "cover",
            maxHeight: "95vh",
            filter: "brightness(50%)"}}
        src=
        "/images/wp2392578-trekking-wallpapers.jpg"
        />
          <Carousel.Caption>
            <h1 style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
            fontWeight: "800",
            fontSize: "49px"}}><strong>HIKES TRACKER</strong></h1>
            <p style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
            fontWeight: "750",
            fontSize: "18px"}}>See all the hikes below</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
        <Image
        className="d-block w-100"
        style={{width: "100%",
            height: "auto",
            objectFit: "cover",
            maxHeight: "92.2vh",
            filter: "brightness(50%)"}}
        src=
        "/images/pexels-eric-sanman-1365425.jpg"
      />
  
          <Carousel.Caption>
          <h1 style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
            fontWeight: "800",
            fontSize: "49px"}}><strong>Join us</strong></h1>
            <p style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
            fontWeight: "750",
            fontSize: "18px"}}>Click to sing up</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
        <Image
        className="d-block w-100"
        style={{width: "100%",
            height: "auto",
            objectFit: "cover",
            maxHeight: "92.2vh",
            filter: "brightness(50%)"}}
        src=
        "/images/toomas-tartes-Yizrl9N_eDA-unsplash.jpg"
      />
  
          <Carousel.Caption>
            <h1 style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
            fontWeight: "800",
            fontSize: "49px"}}><strong>PROVA PROVA</strong></h1>
            <p style={{fontFamily:"Montserrat,Helvetica,Arial,Lucida,sans-serif", 
            fontWeight: "750",
            fontSize: "18px"}}>Inventarsi qualcosa di bello</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container>
        <Row><Col>
        <HikesList logged={props.logged} hikes={props.hikes.filter(h=>h.show)} 
        setAllHikesShow={props.setAllHikesShow} filtering={props.filtering}/>
        </Col></Row>
    </Container>
    
    </>)
}


export default HomePage;