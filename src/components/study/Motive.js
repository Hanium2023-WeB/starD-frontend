
const Motive=({motive, onClose})=>{
    console.log("지원 동기 : ", motive);
    console.log("onClose : ", onClose);

    return(
        <div className={"background"}>
            <div className={"show_motive"}>
            <p style={{color:"#99a98f"}}>지원 동기</p>
            <p>{motive}</p>
            <button onClick={onClose}>확인</button>
        </div>
        </div>
    )
}
export default Motive;