import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function GallerySlider(props){
    
    const sliderSettings = {
        infinite: true,
        dots:true,
        lazyLoad:true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear"
    };
    return(
        <>
            <Slider className='mx-auto' {...sliderSettings} style={{width:"85%"}}>
            {
                props.imagesUrls.map(i=>
                    <div>
                        <img src={i.url} className='img-fluid'/>
                    </div>)
            }
            </Slider>
        </>
    )
}

export default GallerySlider;