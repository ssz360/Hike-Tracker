import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function LocalGuide(props){
    const [name,setName]=useState();
    const [difficulty,setDifficulty]=useState('');
    const [desc,setDesc]=useState('');
    const [file,setFile]=useState();
    const [fileName,setFileName]=useState();
    const submitHandler=async ()=>{
        try {
            const data=new FormData();
            data.append('file',file);
            data.append('name',name);
            data.append('description',desc);
            data.append('difficulty',difficulty);
            const res=await fetch('http://localhost:3001/api/newHike',{
                method:'POST',
                body: data
            });
            const ret=await res.json();
            if(res.ok){
                console.log("New hike added correctly hippip hurra!");
                //const arr=[];ret.forEach(h=>arr.push(new Hike(h.id,h.name,h.length,h.ascent,h.difficulty,h.expectedTime,h.startPoint,h.endPoint,h.referencePoints,h.description,h.coordinates,h.center)));
                //setHikes(arr);
            }
            else throw res.status;
        } catch (error) {
            console.log("error while adding hike",error);
        }
    }
    return(
    <>
        <div className="text-align-center my-3">Add a new hike!</div>
        <Form>
            <Form.Group>
                <Form.Label>Hike Name</Form.Label>
                <Form.Control type="text" value={name} onChange={e=>setName(e.target.value)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Hike Difficulty</Form.Label>
                <Form.Select aria-label="Default select example" value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                    <option value={''}>Select the difficulty of the hike</option>
                    <option value="Tourist">Tourist</option>
                    <option value="Hiker">Hiker</option>
                    <option value="Professional Hiker">Professional Hiker</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Hike Description</Form.Label>
                <Form.Control type="textarea" value={desc} onChange={e=>setDesc(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3" onChange={e=>{setFileName(e.target.value);setFile(e.target.files[0]);}}>
                <Form.Label>Default file input example</Form.Label>
                <Form.Control type="file" value={fileName}/>
            </Form.Group>
            <Button variant="outline-success" size="lg" onClick={e=>{
                e.preventDefault();
                e.stopPropagation();
                submitHandler();
            }}>Submit</Button>
        </Form>
    </>
    )
}


export default LocalGuide;