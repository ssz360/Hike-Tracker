


function SelectPointStartEnd(props){
    const point={
        id:1,
        type:"hut",
        description:"Desc parking"
    }
    return(
        <>
            <img src={"/"+point.type+".png"} style={{width:'10'}} />
            <p>{point.description}</p>
        </>
    )
}

export default SelectPointStartEnd;