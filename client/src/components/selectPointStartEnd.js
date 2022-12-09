import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import ServerReply from "./serverReply";


function SelectPointStartEnd(props){
    console.log("IN SELECTPOINTSTARTEND WITH ",props.point);
    const euclidianDistance=(a,b)=>Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2));
    const iconsvg={
        "Hut":<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" className="bi bi-houses-fill" viewBox="0 0 16 16"><path d="M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.51 2.51 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354L7.207 1Z"/><path d="M8.793 2a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708L8.793 2Z"/></svg>,
        "Parking":<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" className="bi bi-p-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM5.5 4.002V12h1.283V9.164h1.668C10.033 9.164 11 8.08 11 6.586c0-1.482-.955-2.584-2.538-2.584H5.5Zm2.77 4.072c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z"/></svg>,
        "hikePoint":<svg xmlns="http://www.w3.org/2000/svg" width="32" height="auto" fill="blue" className="bi bi-geo-fill" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/></svg>
    }
    const isStart=props.point.id===props.startPoint.id;
    const isEnd=props.point.id===props.endPoint.id;
    const [link,setLink]=useState(euclidianDistance(props.point.coordinates,props.startPoint.coordinates)<euclidianDistance(props.point.coordinates,props.endPoint.coordinates)?"start":"end");
    const [error,setError]=useState();
    const [success,setSuccess]=useState(false);
    const [waiting,setWaiting]=useState(false);
    const [info,setInfo]=useState("");
    useEffect(()=>{
        if(isStart){
            setInfo("This point is already the starting point of this hike");
            setTimeout(()=>setInfo(""),3000);
        }
        else if(isEnd){
            setInfo("This point is already the ending point of this hike");
            setTimeout(()=>setInfo(""),3000);
        }
        setLink(!props.linkableStart && !props.linkableEnd?"":euclidianDistance(props.point.coordinates,props.startPoint.coordinates)<euclidianDistance(props.point.coordinates,props.endPoint.coordinates)?"start":"end");
    },[props.point]);
    const submitHandler=async ()=>{
        try {
            if(link==="start" || link==="end"){
                setWaiting(true);
                await props.linkPoint(link);
                setWaiting(false);
                setSuccess(true);
                setError()
                setTimeout(()=>setSuccess(false),3000);
            }
            else throw "You have to select between starting and ending point";
        } catch (error) {
            setWaiting(false);
            setSuccess(false);
            setError(error);
            setTimeout(()=>setError(false),3000);
        }
    }
    return(
        <>
            <Form>
                <Form.Group className="my-3 text-center">
                    {iconsvg[props.point.typeOfPoint]}
                    <Form.Label style={{width:"100%",fontWeight:"bolder"}}><p className="mt-3">{props.point.name}</p></Form.Label>
                </Form.Group>
                <Form.Group className="mx-5 mb-3">
                    <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}><h3>Link this point as the new</h3></Form.Label>
                    <Form.Select disabled={isEnd || isStart} className="mx-auto text-center my-3" style={{width:"100%"}} value={link} onChange={e=>{console.log("Setting link as",e.target.value);setLink(e.target.value);}}>
                        <option value="">Link it as a start/end point</option>
                        <option value="start" disabled={!props.linkableStart}>Starting point</option>
                        <option value="end" disabled={!props.linkableEnd}>Ending point</option>
                    </Form.Select>
                </Form.Group>
                {isEnd || isStart?
                <></>
                :<Form.Group className="mx-5 my-3">
                    <div className="mx-auto text-center my-3">
                        <Button variant="outline-success" onClick={e=>{
                            e.preventDefault();
                            e.stopPropagation();
                            submitHandler();
                        }}>Submit</Button>
                        <Button variant="outline-warning" className="mx-2" onClick={e=>{
                                e.preventDefault();
                                e.stopPropagation();
                                setLink("");
                                setError();
                                setSuccess();
                            }}>Cancel</Button>
                    </div>
                </Form.Group>
            }
            </Form>
            <ServerReply error={error} success={success} waiting={waiting} errorMessage={"Error while trying to link "+props.point.name+" as a "+link+" point of "+props.hike.name} successMessage={"Linked "+props.point.name+" as a "+link+" point of "+props.hike.name+" correctly!"}/>
            {info!=="" && !success && !error && !waiting?
            <div className="text-center mt-5 mx-auto justify-content-center" style={{width:"85%"}}>
                <Alert variant="info">
                    <Alert.Heading>{info}</Alert.Heading>
                </Alert>
            </div>
            :<></>
            }
        </>
    )
}

export default SelectPointStartEnd;