import LogoButton from "../../components/repeat_etc/LogoButton";
import React, {useState, useRef, useEffect, useCallback} from "react";
import {isEmail, isPassword, isPhone} from "../../util/check.js";
import "../../css/user_css/Log.css";
import Header from "../../components/repeat_etc/Header";
import {useLocation} from 'react-router-dom';
import axios from "axios";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import cn from "classnames";
import Terms_of_service from "../../components/info/Terms_of_service";
import ImageComponent from "../../components/image/imageComponent";

const Signup = () => {
    const location = useLocation();
    let locations = {}
    useEffect(() => {
        locations = location.state;
        console.log(locations);
    }, []);

    const inputID = useRef();
    const inputPW = useRef();
    const inputName = useRef();
    const inputNicname = useRef();
    const inputphone = useRef();
    const inputemail = useRef();
    const IDRef = useRef();
    const nicknameRef = useRef();

    ///변수명 변경
    const [state, setState] = useState({
        id: "",
        password: "",
        name: "",
        nickname: "",
        phone: "",
        email: "",
        isValidEmail: false,
        isValidPassword: false,
        isValidPhone: false,
        city: locations.city,
        district: locations.district,
        tags: locations.tags,

    });

    const [isIdDuplicate, setIsIdDuplicate] = useState(true); // id 중복 여부 상태 변수
    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(true); // nickname 중복 여부 상태 변수
    const [termToggle, setTermToggle] = useState(false);
    const [CheckImg, setCheckImg] = useState(false);
    const [uploadImgUrl, setUploadImgUrl] = useState("");
    const [imgfile, setImgFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

    //모달창 보여주기 위한 상태 함수
    const onTermToggle = useCallback(
        () => {
            setTermToggle(true);
        },);

    //체크버튼 클릭시
    const onCheckImg = useCallback(
        () => {
            if (CheckImg === false) {
                alert("이용약관을 확인해주세요.");
                setTermToggle(true);
                return;
            } else {
                setCheckImg(!CheckImg);
            }
        },);

    //이용약관에 이미 체크가 되어있는데 또 이용약관을 보러 클릭했을 시
    const onCheckImgs = useCallback(
        () => {
            setCheckImg(true);
        },);

    const onChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
        console.log(e.target.name);
        console.log(e.target.value);
    };

    // 이메일 핸들러
    const handleEditemailChange = (e) => {
        const Email = e.target.value;

        setState((prevState) => ({
            ...prevState,
            email: Email,
            isValidEmail: isEmail(Email),
        }));
    };
    const handleEditPasswordChange = (e) => {
        const PW = e.target.value;

        setState((prevState) => ({
            ...prevState,
            password: PW,
            isValidPassword: isPassword(PW),
        }));
    };

    const handleEditPhoneChange = (e) => {
        const phone = e.target.value;

        setState((prevState) => ({
            ...prevState,
            phone: phone,
            isValidPhone: isPhone(phone),
        }));
    };

    //프로필 사진 업로드
    const onchangeImageUpload = (e) => {
        setUploadImgUrl("");
        setImgFile(null);
        console.log("사진", e.target.files);
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            console.log("File details:", file);
            const imageUrl = URL.createObjectURL(file);
            setUploadImgUrl(imageUrl);
            setImageSrc(uploadImgUrl);
            const reader = new FileReader();
            reader.onload = () => {
                if(reader.readyState === 2){
                    setUploadImgUrl(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])

        } else {
            console.error("No file selected");
            alert("이미지를 선택해주세요");
            return;
        }
    }
    //프로필 사진 삭제
    const onchangeImageDelete = (e) => {
        setUploadImgUrl("");
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            state.id.length < 1 &&
            state.password.length < 1 &&
            state.name.length < 1 &&
            state.nickname.length < 1 &&
            state.phone.length < 1 &&
            state.email.length < 1
        ) {

            alert("회원 정보를 입력해 주세요.");
            return;
        }

        if (state.id.length < 3) {
            inputID.current.focus();
            alert("아이디는 3자 이상이어야 합니다.");
            return;
        }

        if (state.password.length < 5) {
            inputPW.current.focus();
            alert("비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (state.name.length < 2) {
            inputName.current.focus();
            alert("이름은 2자 이상이어야 합니다.");
            return;
        }

        if (state.nickname.length < 2) {
            inputNicname.current.focus();
            alert("닉네임은 2자 이상이어야 합니다.");
            return;
        }

        if (state.phone.length < 7) {
            inputphone.current.focus();
            alert("전화번호는 7자 이상이어야 합니다.");
            return;
        }

        if (state.email.length < 1) {
            inputemail.current.focus();
            alert("이메일을 입력해 주세요.");
            return;
        }

        if (!isPassword(state.password)) {
            inputPW.current.focus();
            alert("비밀번호는 8 ~ 15자 영문, 숫자, 특수문자 조합이어야 합니다.");
            return;
        }

        if (!isEmail(state.email)) {
            inputemail.current.focus();
            alert("유효한 이메일 주소를 입력해 주세요.");
            return;
        }

        if (isIdDuplicate) {
            alert("아이디 중복 확인을 해주세요.");
            return;
        }

        if (isNicknameDuplicate) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        if (!CheckImg) {
            alert("이용약관을 동의해주세요");
            return;
        }


        try {
            const response = await axios.post("/api/signup", {
                id: state.id,
                password: state.password,
                name: state.name,
                nickname: state.nickname,
                phone: state.phone,
                email: state.email,
                city: locations.city,
                district: locations.district,
                tags: locations.tags,
            });

            if (response.status === 200) {
                const newMember = response.data;
                const memberId = newMember.id;
                localStorage.setItem("memberId", memberId);


                window.location.href = "/subinfo?memberId=${memberId}";
            } else {
                alert("회원가입에 실패하였습니다.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handleCheckDuplicateID = async () => {
        const id = state.id;
        if (!id) {
            alert("아이디를 입력해 주세요.");
            return;
        }

        if (IDRef.current) {
            IDRef.current.remove();
        }

        try {
            const response = await axios.get("/api/checkDuplicateID", {
                params: {id: id},
            });

            const isDuplicate = response.data;

            setIsIdDuplicate(isDuplicate);

            const message = document.createElement("p");
            message.textContent = isDuplicate ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다.";
            message.style.display = "block";
            message.style.color = isDuplicate ? "red" : "blue";

            inputID.current.parentNode.parentNode.appendChild(message);

            IDRef.current = message;

        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCheckDuplicateNickname = async () => {
        const nickname = state.nickname;

        if (!nickname) {
            alert("닉네임을 입력해 주세요.");
            return;
        }

        if (nickname === "관리자") {
            inputNicname.current.focus();
            alert("닉네임으로 '관리자'는 사용할 수 없습니다. 다른 닉네임을 입력해주세요.");
            return;
        }

        if (nicknameRef.current) {
            nicknameRef.current.remove();
        }

        try {
            const response = await axios.get("/api/checkDuplicateNickname", {
                params: {nickname: nickname},
            });

            const isDuplicate = response.data;

            setIsNicknameDuplicate(isDuplicate);

            const message = document.createElement("p");
            message.textContent = isDuplicate ? "이미 존재하는 닉네임입니다." : "사용 가능한 닉네임입니다.";
            message.style.display = "block";
            message.style.color = isDuplicate ? "red" : "blue";

            inputNicname.current.parentNode.parentNode.appendChild(message);

            nicknameRef.current = message;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <Header showSideCenter={false}/>
            <div className="containers" id="sign">
                <div className="login_info">
                    <p>회원가입</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {/*<div className={"profile_wrapper"}>*/}
                    {/*    <h2>프로필 사진</h2>*/}
                    {/*    <div className={"profile_content"}>*/}
                    {/*        <ImageComponent getImgName = {uploadImgUrl} imgsrc={imageSrc} />*/}
                    {/*        <input className="image-upload" type="file" accept="image/*"*/}
                    {/*               onChange={onchangeImageUpload}/>*/}
                    {/*        <button className="image-delete" onClick={onchangeImageDelete}>삭제</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div style={{position:"relative"}}>
                        <div className="input_info" style={{left: "31px"}}>
                            <div className="subinfo">아이디<span className="require_info">*</span></div>
                            <div className="signup_id input_bottom">
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <input
                                        ref={inputID}
                                        name={"id"}
                                        value={state.id}
                                        onChange={onChange}
                                        placeholder="아이디를 입력해주세요."
                                        style={{marginBottom: "0"}}
                                    />
                                    <button id="signup_nicname_btn" type="button" onClick={handleCheckDuplicateID}>
                                        중복확인
                                    </button>
                                </div>
                            </div>

                            <div className="subinfo">비밀번호<span className="require_info">*</span></div>
                            <div className="inputpw input_bottom">
                                <input
                                    ref={inputPW}
                                    name={"password"}
                                    type={"password"}
                                    value={state.password}
                                    onChange={handleEditPasswordChange}
                                    placeholder="8 ~ 15자 영문, 숫자, 특수문자 조합"
                                />
                                {state.password !== "" ? (
                                    state.isValidPassword ? (
                                        <p style={{color: "blue"}}>유효한 비밀번호입니다.</p>
                                    ) : (
                                        <p style={{color: "red"}}>비밀번호는 8 ~ 15자 영문, 숫자, 특수문자 조합이어야 합니다.</p>
                                    )
                                ) : null}
                            </div>

                            <div className="subinfo">이름<span className="require_info">*</span></div>
                            <div className="signup_name input_bottom">
                                <input
                                    ref={inputName}
                                    name={"name"}
                                    value={state.name}
                                    onChange={onChange}
                                    placeholder="이름을 입력해주세요."
                                />
                            </div>

                            <div className="subinfo">닉네임<span className="require_info">*</span></div>
                            <div className="signup_nicname input_bottom">
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <input
                                        ref={inputNicname}
                                        name={"nickname"}
                                        value={state.nickname}
                                        onChange={onChange}
                                        placeholder="닉네임을 입력해주세요."
                                    />
                                    <button id="signup_nicname_btn" type="button" onClick={handleCheckDuplicateNickname}>
                                        중복 확인
                                    </button>
                                </div>
                            </div>

                            <div className="subinfo">휴대폰<span className="require_info">*</span></div>
                            <div className="signup_phone input_bottom">
                                <input
                                    ref={inputphone}
                                    name={"phone"}
                                    value={state.phone}
                                    onChange={handleEditPhoneChange}
                                    placeholder="휴대폰 번호를 입력해주세요."
                                />
                                {state.phone !== "" ? (
                                    state.isValidPhone ? (
                                        <p style={{color: "blue"}}>유효한 핸드폰 번호입니다.</p>
                                    ) : (
                                        <p style={{color: "red"}}>핸드폰 번호는 010으로 시작해서 총 11자리입니다.</p>
                                    )
                                ) : null}
                            </div>

                            <div className="subinfo">이메일<span className="require_info">*</span></div>
                            <div className="inputemail">
                                <input
                                    style={{marginLeft: "0"}}
                                    ref={inputemail}
                                    name={"email"}
                                    value={state.email}
                                    onChange={handleEditemailChange}
                                    placeholder="이메일을 입력해주세요."
                                />
                                {state.email !== "" ? (
                                    state.isValidEmail ? (
                                        <p style={{color: "blue"}}>사용 가능한 email입니다.</p>
                                    ) : (
                                        <p style={{color: "red"}}>유효하지 않은 email입니다.</p>
                                    )
                                ) : null}
                            </div>
                        </div>

                    </div>
                    <div className="check_term_of_service">
                        {CheckImg ? <span><img src={checkbox} width="20px" onClick={onCheckImg}/>
                            <p onClick={onTermToggle}>이용약관</p></span>
                            : <span><img src={uncheckbox} width="20px" onClick={onCheckImg}/>
                                <p onClick={onTermToggle}>이용약관
                                    <span id={"term"} style={{color: "red", width: "150px"}}>(필수)</span></p>
                                </span>
                        }
                    </div>
                    {termToggle && <Terms_of_service onClose={() => {
                        setTermToggle(false);
                    }} CheckImg={CheckImg} onCheckImgs={onCheckImgs}/>}
                    <div className="signbtn">
                        <button type="submit">다음</button>
                    </div>
                </form>

            </div>
        </div>
    );
};
export default Signup;