import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../API";

function AddHikeForm(props){
    const [error,setError]=useState();
    const [success,setSuccess]=useState(false);
    const navigate=useNavigate();
    const submitHandler=async ()=>{
        try {
            let err="";
            if(!props.name) err+="No name was provided. ";
            if(!props.difficulty) err+="No difficulty was selected. "
            if(!props.file) err+="The track file was not provided. ";
            if(err!=="") throw err;
            //console.log("Trying to send an api call")
            await API.addHike(props.file,props.name,props.desc,props.difficulty);
            //console.log("Success in api call");
            setSuccess(true);
            setTimeout(()=>setSuccess(false),3000);
        } catch (error) {
            //console.log("Error in try catch",error);
            setSuccess(false);
            setError(error);
            setTimeout(()=>setError(false),3000);
        }
    }
    /*
    <Form.Group className="my-2">
            <div className="text-left" onClick={e=>{
                            e.preventDefault();
                            e.stopPropagation();
                            navigate('/');
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{width:"7%",heigth:"5%"}} fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
        <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
        </svg>
                        </div>
                <Form.Label className="text-center mx-auto" style={{width:"100%",fontWeight:"bolder"}}>
                    Add a new hike!
                </Form.Label>
            </Form.Group>
            */
    return(
    <>
        <Form>
            <Form.Group className="mx-5 my-2">
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Hike Name</Form.Label>
                <Form.Control className="mx-auto text-center" style={{width:"50%"}} type="text" value={props.name} onChange={e=>props.setName(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mx-5 my-2">
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Hike Difficulty</Form.Label>
                <Form.Select className="mx-auto text-center" style={{width:"50%"}} value={props.difficulty} onChange={e=>props.setDifficulty(e.target.value)}>
                    <option value={undefined}>Select the difficulty of the hike</option>
                    <option value="TOURIST">Tourist</option>
                    <option value="HIKER">Hiker</option>
                    <option value="PROFESSIONAL HIKER">Professional Hiker</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mx-5 my-2">
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Hike Description</Form.Label>
                <Form.Control className="mx-auto" style={{width:"50%"}} as="textarea" value={props.desc} onChange={e=>props.setDesc(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formFile" className="mx-5 my-2" onChange={e=>{props.setFileName(e.target.value);props.setFile(e.target.files[0]);}}>
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Track file</Form.Label>
                <Form.Control className="mx-auto text-center" style={{width:"50%"}} type="file" value={props.fileName}/>
            </Form.Group>
            <Form.Group className="mx-5 my-2">
                <div className="mx-auto text-center my-3">
                    <Button variant="outline-success" size="lg" onClick={e=>{
                        e.preventDefault();
                        e.stopPropagation();
                        submitHandler();
                    }}>Submit</Button>
                    <Button variant="outline-warning" className="mx-3" size="lg" onClick={e=>{
                            e.preventDefault();
                            e.stopPropagation();
                            props.setName('');
                            props.setDesc('');
                            props.setDifficulty('');
                            props.setFile();
                            props.setFileName('');
                            setError();
                            setSuccess();
                        }}>Cancel</Button>
                </div>
            </Form.Group>
        </Form>
        {error?
        <div className="text-center mt-5 mx-auto justify-content-center" style={{width:"85%"}}>
            <Alert variant="danger">
                <Alert.Heading>Error while adding a new hike</Alert.Heading>
                <h5>
                    {error}
                </h5>
            </Alert>
        </div>
        :
        success?
        <div className="text-center mt-5 mx-auto justify-content-center" style={{width:"85%"}}>
            <Alert variant="success">
                <Alert.Heading>New hike added correctly!</Alert.Heading>
            </Alert>
        </div>
        :<></>
        }
    </>
    )
}


export default AddHikeForm;