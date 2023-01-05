import { useState } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import "./rotatingBorder.css";


function HomePage() {

  const [isHover, setIsHover] = useState(false);

  const right_arr = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
  </svg>);

  return (<>
    <Carousel id="carousel" className="d-block w-100">
      <Carousel.Item>
        <Image
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

          <p><a href="/hikes" style={{
            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
            fontWeight: "750",
            fontSize: "18px",
            color: !isHover ? "white" : "#009999"
          }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
            {!isHover ? <div class="box"><h5 className="v-c">See all the hikes</h5></div> :
              <div class="box"><h5 className="v-c">See all the hikes {right_arr}</h5></div>
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
            {!isHover ? <div class="box"><h5 className="v-c">Click to sign up</h5></div> :
              <div class="box"><h5 className="v-c">Click to sign up {right_arr}</h5></div>
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
          }}><strong>ALREADY REGISTERED?</strong></h1>
          <p><a href="/login" style={{
            fontFamily: "Montserrat,Helvetica,Arial,Lucida,sans-serif",
            fontWeight: "750",
            fontSize: "18px",
            color: !isHover ? "white" : "#009999"
          }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
            {!isHover ? <div class="box"><h5 className="v-c">Click to login!</h5></div> :
              <div class="box"><h5 className="v-c">Click to login! {right_arr}</h5></div>
            }</a></p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </>)
}


export default HomePage;