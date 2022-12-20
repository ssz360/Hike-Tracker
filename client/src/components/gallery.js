import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { useState } from "react";
import { Button, Container, Row, Col, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trash3Fill } from 'react-bootstrap-icons';

function Gallery(props) {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [fullScreenUrl, setFullScreenUrl] = useState("");
    const addFile = file => {
        //console.log("Files",files,"files.len",files.length);
        props.setImages([...props.images, file]);
        const arr = [...props.imagesUrls, { name: file.name, url: URL.createObjectURL(file) }];
        props.setImagesUrls([...arr]);
    };
    const multipleUpload = files => {
        props.setImages([...files]);
        const arr = [];
        [...files].forEach(f => arr.push({ name: f.name, url: URL.createObjectURL(f) }));;
        props.setImagesUrls([...arr]);
    }
    const removeImage = img => {
        const imgs = props.images.filter(i => i.name !== img.name);
        props.setImages([...imgs]);
        const arr = [];
        URL.revokeObjectURL(img.url);
        props.imagesUrls.forEach(f => {
            if (f.name !== img.name) arr.push(f)
        });
        props.setImagesUrls([...arr]);
    }
    const imageUpload = f => {
        addFile(f.target.files[0]);
    }
    return (
        <Container>
            {
                fullScreenUrl !== "" &&
                    <Modal show={fullScreenUrl !== ""} size="lg" className="my-1" onHide={e => setFullScreenUrl("")}>
                        <Modal.Body className="custom-modal-body" style={{borderRadius: "10px"}}>
                            <img src={fullScreenUrl} style={{ height: "100%", width: "100%" }} draggable="false"  />
                        </Modal.Body>
                    </Modal>
            }
            <Row>
                <Col xs={12}>
                    <div className="imggallerybody" onScroll={e => setScrollPercentage((e.target.scrollLeft / e.target.scrollWidth) * 100)}>
                        <div id="imggallery">
                            {
                                props.imagesUrls.map(i =>
                                    <div className="cardimages" >
                                        <img  src={i.url} style={{ objectPosition: "" + scrollPercentage + "% center", borderRadius:"10px"}} className="image" draggable="false" />
                                        <div className="cardimagesoverlay" 
                                        role="button" onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setFullScreenUrl(i.url);
                                            }}
                                            >
                                            {props.preview &&
                                                // <Button onClick={e => {
                                                //     e.preventDefault();
                                                //     e.stopPropagation();
                                                //     removeImage(i);
                                                // }} variant="outline-danger" size="lg" className="cardoverlayimageremove">
                                                    <Trash3Fill className="cardoverlayimageremove" 
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeImage(i);
                                                     }}>
                                                        {/* <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" /> */}
                                                    </Trash3Fill>
                                                // </Button>
                                         
                                            }
                                            {/* <Button onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setFullScreenUrl(i.url);
                                            }} variant="outline-info" size="lg" className="cardoverlayimagezoom">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z" />
                                                </svg>
                                            </Button> */}
                                        </div>
                                    </div>)}
                            {props.addImage &&
                                   <OverlayTrigger placement='right' delay={{ show: 250, hide: 400 }} overlay = {<Tooltip> Add photos</Tooltip>}>
               
                                <div id="imggallery" style={{ transform: "translate(0%,0%)"}}>
                                    <div className="cardimages">
                                        <img src="/images/addImage.png" className="image" draggable="false" style={{borderRadius: "10px"}} />
                                        <input className="imageuploader" type="file" accept="image/png, image/jpeg" onChange={f => imageUpload(f)} />
                                    </div>
                                </div>
                                   </OverlayTrigger>
                                }
                        </div>
                    </div>
                </Col>
                {/* {props.addImage ?
                    <Col xs={4}>
                        <div className="imggallerybody">
                            <div id="imggallery" style={{ transform: "translate(0%,0%)" }}>
                                <div className="cardimages">
                                    <img src="/images/addImage.png" className="image" draggable="false" />
                                    <input className="imageuploader" type="file" accept="image/png, image/jpeg" onChange={f => imageUpload(f)} />
                                </div>
                            </div></div>
                    </Col>
                    :
                    <></>
                } */}
            </Row>
        </Container>
    )
}

export default Gallery;