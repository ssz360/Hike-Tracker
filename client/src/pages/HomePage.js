import HikesList from "./HikesList";
import { useState } from 'react';
import { Carousel, Row, Image, Container, Col } from 'react-bootstrap';
import "./rotatingBorder.css";
import { Link } from 'react-router-dom';

function HomePage(props) {

  const [isHover, setIsHover] = useState(false);
  const down_arr = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
  </svg>);

  const right_arr = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
  </svg>);

  return (<>
    <Carousel id="carousel" className="d-block w-100">
      <Carousel.Item>
        <Image
          //className="d-block w-100"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            filter: "brightness(50%)"
          }}
          src=
          "/images/pexels-eric-sanman-1365425.jpg"
        />
        <Carousel.Caption>
          <h1 style={{
            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
            fontWeight: "800",
            fontSize: "49px"
          }}><strong>HIKES TRACKER</strong></h1>

          <div class="box">
            <h5 className="v-c">
              <Link to={'/hikes'} > See all the hikes </Link>
            </h5>
          </div>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image
          className="d-block w-100"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            filter: "brightness(50%)"
          }}
          src=
          "/images/wp2392578-trekking-wallpapers.jpg"
        />

        <Carousel.Caption>
          <h1 style={{
            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
            fontWeight: "800",
            fontSize: "49px"
          }}><strong>JOIN US!</strong></h1>
          <p><a href="/signup" style={{
            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
            fontWeight: "750",
            fontSize: "18px",
            color: !isHover ? "white" : "#009999"
          }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
            {!isHover ? <>Click to sign up</> :
              <>Click to sign up {right_arr}</>
            }</a></p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image
          className="d-block w-100"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            filter: "brightness(50%)"
          }}
          src=
          "/images/toomas-tartes-Yizrl9N_eDA-unsplash.jpg"
        />

        <Carousel.Caption>
          <h1 style={{
            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
            fontWeight: "800",
            fontSize: "49px"
          }}><strong>PROVA PROVA</strong></h1>
          <p style={{
            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
            fontWeight: "750",
            fontSize: "18px"
          }}>Inventarsi qualcosa di bello</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    <Container>
      {/* <Row><Col>
        <div id="list">
        <HikesList logged={props.logged} hikes={props.hikes.filter(h=>h.show)} 
        setAllHikesShow={props.setAllHikesShow} filtering={props.filtering}/>
        </div>
        </Col></Row> */}
    </Container>

  </>)
}


export default HomePage;