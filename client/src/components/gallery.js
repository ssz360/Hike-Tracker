import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { useState } from "react";
import { Button, Container, Row ,Col} from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';

function Gallery(props){
    const [translate,setTranslate]=useState(25);

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
    const scrollEnd=()=>{
        if(translate>(-125)){
            setTranslate(translate-2);
            setTimeout(()=>scrollEnd(),50);
        }
    }
    const scrollStart=()=>{
        if(translate<25){
            setTranslate(translate+2);
            setTimeout(()=>scrollStart(),50);
        }
    }
    const imageUpload=f=>{
        addFile(f.target.files[0]);
    }
    return(
        <Container>
            <Row>
                <Col xs={props.addImage?8:12}>
        <div className="imggallerybody">
            <div id="imggallery" style={{transform:"translate("+translate+"%,0%)"}} onMouseMove={e=>{
                    if(props.imagesUrls.length>1 && translate-e.movementX<25 && translate-e.movementX>(-125))    setTranslate(translate-e.movementX);
                }}>
                    {
                    props.imagesUrls.map(i=>
                    <div className="cardimages">
                        <img src={i.url} className="image" draggable="false"/>
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
            {props.imagesUrls.length>0?
                <RangeSlider
                    variant="info"
                    size="sm"
                    value={-translate+25}
                    onChange={changeEvent => setTranslate(-changeEvent.target.value+25)}
                    min={0} max={150}
                />
                :
                <></>
            }
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