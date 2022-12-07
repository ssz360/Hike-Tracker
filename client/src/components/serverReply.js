import { Alert, Spinner } from "react-bootstrap";

function ServerReply(props){
    return(
    <>
    {props.error?
        <div className="text-center mt-3 mx-auto justify-content-center" style={{width:"85%"}}>
            <Alert variant="danger">
                <Alert.Heading>{props.errorMessage}</Alert.Heading>
                <h5>
                    {props.error}
                </h5>
            </Alert>
        </div>
        :
        props.success?
            <div className="text-center mt-3 mx-auto justify-content-center" style={{width:"85%"}}>
                <Alert variant="success">
                    <Alert.Heading>{props.successMessage}</Alert.Heading>
                </Alert>
            </div>
            :
            props.waiting?
                <div className="text-center mt-3 mx-auto justify-content-center">
                    <Spinner animation="grow"/>
                </div>
                :
                <></>
    }
    </>
    );
}

export default ServerReply;