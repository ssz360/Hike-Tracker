import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import api from "../lib/api";
import icons from "../lib/iconspoint";
import GallerySlider from "./gallerySlider";

function SelectedPoint(props){
    const [waiting,setWaiting]=useState(false);
    const [imagesUrls,setImagesUrls]=useState([]);
    useEffect(()=>{
        const getImages=async()=>{
            try {
                setWaiting(true);
                const imgs=await api.getImagesPoint(props.point.id);
                setWaiting(false);
                setImagesUrls([...imgs]);
            } catch (error) {
                setWaiting(false);
                setImagesUrls([]);
            }
        }
        getImages();
    },[props.point])
    return(
        <>
            <div className="my-3 text-center">
                <strong>{icons.iconsvgelement[props.point.typeOfPoint]}</strong>
            </div>
            <div className="my-3 text-center">
                <strong>{props.point.name}</strong>
            </div>
            <div className="my-3 text-center">
                <strong>{props.point.geographicalArea}</strong>
            </div>
            {waiting?
                <div className="my-3 text-center">
                    <Spinner animation="grow"/>
                </div>
                :
                <GallerySlider add={false} images={imagesUrls}/>
            }
        </>
    )
}

export default SelectedPoint;