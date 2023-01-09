import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import React from 'react';

function openFileUpload() {
  document.getElementById('addimageupload').click();
}

function GallerySlider(props){
    useEffect(()=>{
        if(props.add)   return ()=>{
            props.images.forEach(i=>URL.revokeObjectURL(i.url));
        }
    });
    const addImage = file => {
        console.log("Adding file",file.target.files[0]);
        props.setImages([...props.images,{image:file.target.files[0],
            filename:file.target.files[0].name,
            url:URL.createObjectURL(file.target.files[0])}]);
    };
    const removeImage = url => {
        props.setImages([...props.images.filter(i=>i.url!==url)]);
        URL.revokeObjectURL(url);
    }
    const setFullScreenUrl=id=>{
        const element=document.getElementById(id); 
        if(element.requestFullscreen) 
            element.requestFullscreen();
        else if(element.mozRequestFullScreen)   /* Firefox */
            element.mozRequestFullScreen();
        else if(element.webkitRequestFullscreen)   /* Chrome, Safari & Opera */
            element.webkitRequestFullscreen();
        else if(element.msRequestFullscreen)   /* IE/Edge */
            element.msRequestFullscreen();
    }
    const sliderSettings = {
        arrows: true,
        infinite: true,
        dots:props.dots===undefined? true: props.dots,
        lazyLoad:true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        autoplay: props.autoplay===false ? false : true,
        autoplaySpeed: 2000,
        cssEase: "linear",
        adaptiveHeight: true
    };

    console.log("autoplay: ", props.autoplay);

    return(
        <Row>
            {props.add &&
                <Col xs={6} sm={4} className='justify-content-center mx-auto my-2'>
                    <div className="addimagecontainer">
                        <img src="/images/brown.png" alt="alt" className="img-fluid addimageimg"/>
                        <span className="material-icons-round md-36 addimagelogo" onClick={e=>{
                            e.preventDefault();
                            e.stopPropagation();
                            openFileUpload();
                        }}>
                            add_a_photo
                        </span>
                        <input id="addimageupload" type="file" accept="image/png, image/jpeg" hidden onChange={f=>addImage(f)}/>
                    </div>
                </Col>
            }
            <Col xs={12} sm={props.add?8:12} className='justify-content-center mx-auto my-2'>
                <Slider className='mx-auto' {...sliderSettings} style={{width:"85%"}}>
                {
                    props.images.map(i=>
                        <div key={i.url} className="slidecont">
                            <img alt="alt" src={i.url} id={i.url} className='img-fluid slideimg'/>
                            <div className="slideoverlay">
                                <span className="material-icons-round md-36 slidefullscreen" onClick={e=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setFullScreenUrl(i.url)
                                    }}>
                                    open_in_full
                                </span>
                                {props.add && 
                                    <span className="material-icons-round md-36 slidedelete" onClick={e=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeImage(i.url)
                                    }}>
                                        delete_forever
                                    </span>
                                }
                            </div>
                        </div>)
                }
                </Slider>
            </Col>
        </Row>
    )
}

export default GallerySlider;