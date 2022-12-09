import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { useState } from "react";
import { Button, Container, Row ,Col} from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';

function Gallery(props){
    const [scrollPercentage,setScrollPercentage]=useState(0);
    const addFile = file => {
        //console.log("Files",files,"files.len",files.length);
        props.setImages([...props.images,file]);
        const arr=[...props.imagesUrls,{name:file.name,url:URL.createObjectURL(file)}];
        props.setImagesUrls([...arr]);
    };
    const multipleUpload= files=>{
        props.setImages([...files]);
        const arr=[];
        [...files].forEach(f=>arr.push({name:f.name,url:URL.createObjectURL(f)}));;
        props.setImagesUrls([...arr]);
    }
    const removeImage=img=>{
        const imgs=props.images.filter(i=>i.name!==img.name);
        props.setImages([...imgs]);
        const arr=[];
        URL.revokeObjectURL(img.url);
        props.imagesUrls.forEach(f=>{
            if(f.name!==img.name)    arr.push(f)
        });
        props.setImagesUrls([...arr]);
    }
    const imageUpload=f=>{
        addFile(f.target.files[0]);
    }
    return(
        <Container>
            <Row>
                <Col xs={props.addImage?8:12}>
        <div className="imggallerybody" onScroll={e=>setScrollPercentage((e.target.scrollLeft/e.target.scrollWidth)*100)}>
            <div id="imggallery">
                    {
                    props.imagesUrls.map(i=>
                    <div className="cardimages">
                        <img src={i.url} style={{objectPosition:""+scrollPercentage+"% center"}} className="image" draggable="false"/>
                        {props.preview?
                            <div className="cardimagesoverlay">
                            <Button onClick={e=>{
                                e.preventDefault();
                                e.stopPropagation();
                                removeImage(i);
                            }} variant="outline-danger" size="lg" className="cardoverlayimageremove">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-eraser-fill" viewBox="0 0 16 16">
                                    <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
                                </svg>
                            </Button>
                            </div>
                            :
                            <></>
                        }
                    </div>)}
                </div>
            </div>
            </Col>
            {props.addImage?
            <Col xs={4}>
            <div className="imggallerybody">
            <div id="imggallery" style={{transform:"translate(0%,0%)"}}>
                <div className="cardimages">
                    <img src="/images/addImage.png" className="image" draggable="false"/>
                    <input className="imageuploader" type="file" accept="image/png, image/jpeg" onChange={f=>imageUpload(f)}/>
                </div>
            </div></div>
            </Col>
                :
                <></>
            }
        </Row>
        </Container>
    )
}

export default Gallery;