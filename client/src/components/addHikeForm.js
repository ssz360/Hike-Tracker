import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

function AddHikeForm(props){
    const [error,setError]=useState();
    const [success,setSuccess]=useState(false);
    const [name,setName]=useState('');
    const [difficulty,setDifficulty]=useState();
    const [desc,setDesc]=useState('');
    const [file,setFile]=useState();
    const [fileName,setFileName]=useState('');
    const navigate=useNavigate();
    const submitHandler=async ()=>{
        try {
            let err="";
            if(!name) err+="No name was provided. ";
            if(!difficulty) err+="No difficulty was selected. "
            if(!file) err+="The track file was not provided. ";
            if(err!=="") throw err;
            //console.log("Trying to send an api call")
            await api.addHike(file,name,desc,difficulty);
            //console.log("Success in api call");
            setSuccess(true);
            setTimeout(()=>setSuccess(false),3000);
            await props.refreshHikes();
        } catch (error) {
            //console.log("Error in try catch",error);
            setSuccess(false);
            setError(error);
            setTimeout(()=>setError(false),3000);
        }
    }
    return(
    <>
        <Form className="my-5">
            <Form.Group className="mx-5 my-2">
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Hike Name</Form.Label>
                <Form.Control className="mx-auto text-center" style={{width:"50%"}} type="text" value={name} onChange={e=>setName(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mx-5 my-2">
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Hike Difficulty</Form.Label>
                <Form.Select className="mx-auto text-center" style={{width:"50%"}} value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                    <option value={undefined}>Select the difficulty of the hike</option>
                    <option value="TOURIST">Tourist</option>
                    <option value="HIKER">Hiker</option>
                    <option value="PROFESSIONAL HIKER">Professional Hiker</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mx-5 my-2">
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Hike Description</Form.Label>
                <Form.Control className="mx-auto" style={{width:"50%"}} as="textarea" value={desc} onChange={e=>setDesc(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formFile" className="mx-5 my-2" onChange={e=>{setFileName(e.target.value);setFile(e.target.files[0]);}}>
                <Form.Label className="text-center" style={{width:"100%",fontWeight:"bolder"}}>Track file</Form.Label>
                <Form.Control className="mx-auto text-center" style={{width:"50%"}} type="file" value={fileName}/>
            </Form.Group>
            <Form.Group className="mx-5 my-2">
                <div className="mx-auto text-center my-3">
                    <Button variant="outline-success" size="lg" onClick={e=>{
                        e.preventDefault();
                        e.stopPropagation();
                        submitHandler();
                    }}><strong>Submit</strong></Button>
                    <Button variant="outline-warning" className="mx-3" size="lg" onClick={e=>{
                            e.preventDefault();
                            e.stopPropagation();
                            setName('');
                            setDesc('');
                            setDifficulty('');
                            setFile();
                            setFileName('');
                            setError();
                            setSuccess();
                        }}><strong>Cancel</strong></Button>
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