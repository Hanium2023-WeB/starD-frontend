import LogoButton from "../../components/repeat_etc/LogoButton";
import React, {useState, useRef, useEffect, useCallback} from "react";
import {isEmail, isPassword, isPhone} from "../../util/check.js";
import "../../css/user_css/Log.css";
import Header from "../../components/repeat_etc/Header";
import {useLocation, useNavigate} from 'react-router-dom';
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
    const inputNicname = useRef();
    const IDRef = useRef();
    const nicknameRef = useRef();
    const navigate = useNavigate();

    ///변수명 변경
    const [state, setState] = useState({
        email: "",
        password: "",
        nickname: "",
        authCode:"",
        isValidEmail: false,
        isValidPassword: false,
        isValidPhone: false,
        city: locations.city,
        district: locations.district,
        tags: locations.tags,
        file:""
    });

    const [isIdDuplicate, setIsIdDuplicate] = useState(null); // id 중복 여부 상태 변수
    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false); // nickname 중복 여부 상태 변수
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [isCheckAuthCode, setIsCheckAuthCode] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
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
    };

    // 이메일 핸들러
    const handleEditemailChange = (e) => {
        const email = e.target.value;

        setState((prevState) => ({
            ...prevState,
            email: email,
            isValidEmail: isEmail(email),
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

    const handleConfirmPasswordChange = (e) => {
        const confirmPW = e.target.value;
        setConfirmPassword(confirmPW);
        setIsPasswordMatch(confirmPW === state.password);
    };

    //프로필 사진 업로드
    const onchangeImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            const imageUrl = URL.createObjectURL(file);
            setUploadImgUrl(imageUrl);
            setImageSrc(imageUrl);
            console.log(uploadImgUrl);
            console.log(imageSrc);
        } else {
            alert("이미지를 선택해주세요.");
        }
    };
    //프로필 사진 삭제
    const onchangeImageDelete = (e) => {
        setUploadImgUrl("");
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            state.email.length < 1 &&
            state.password.length < 1 &&
            state.nickname.length < 1
        ) {
            alert("회원 정보를 입력해 주세요.");
            return;
        }

        if (state.password.length < 5) {
            inputPW.current.focus();
            alert("비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (state.nickname.length < 2) {
            inputNicname.current.focus();
            alert("닉네임은 2자 이상이어야 합니다.");
            return;
        }

        if (!isPassword(state.password)) {
            inputPW.current.focus();
            alert("비밀번호는 8 ~ 15자 영문, 숫자, 특수문자 조합이어야 합니다.");
            return;
        }

        if (!isPasswordMatch) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!isEmail(state.email)) {
            inputID.current.focus();
            alert("유효한 이메일 주소를 입력해 주세요.");
            return;
        }

        if (!isIdDuplicate) {
            alert("이메일 중복 확인을 해주세요.");
            return;
        }

        if (!isNicknameDuplicate) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        if (!CheckImg) {
            alert("이용약관을 동의해주세요");
            return;
        }

        if (!isCheckAuthCode) {
            alert("인증 번호 확인이 되지 않았습니다.");
            return;
        }

        // Create a FormData object to send the file and other data
        const formData = new FormData();

        // Append the image file if it exists
        if (imgfile) {
            formData.append("file", imgfile);
        }

        formData.append("requestDto", JSON.stringify({
            password: state.password,
            nickname: state.nickname,
            email: state.email,
        }));

        console.log(formData);
        setState(prevState => ({
            ...prevState,
            file:formData
        }))

        axios.post("/api/members/auth/join", formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure the content type is set correctly
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    const newMemberId = response.data.memberId;
                    localStorage.setItem("newMemberId", newMemberId);
                    alert("가입되었습니다.");
                    navigate(`/subinfo`);
                } else {
                    alert("회원가입에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("Error:", error.response?.data || error);
            });

    };



    const handleCheckDuplicateID = () => {
        const email = state.email;
        if (!email) {
            alert("이메일을 입력해 주세요.");
            return;
        }

        if (IDRef.current) {
            IDRef.current.remove();
        }
        console.log(email);
        axios
            .post("/api/members/auth/check-email", {
                email: email,
            })
            .then((response) => {
                const isDuplicate = response.data;

                setIsIdDuplicate(isDuplicate);

                console.log(isDuplicate);
                const message = document.querySelector(".is_valid_email");

                if (message) {
                    message.textContent = !isDuplicate ? "이미 존재하는 이메일입니다." : "사용 가능한 이메일입니다.";
                    message.style.display = "block";
                    message.style.color = !isDuplicate ? "red" : "blue";
                }

                // 이메일 중복 확인 통과 시 confirm 창을 띄워 인증번호 전송 여부 확인
                if (isDuplicate) {
                    const confirmSendCode = window.confirm("이 메일로 인증번호를 전송하시겠습니까?");
                    if (confirmSendCode) {
                        axios
                            .post("/api/members/auth/auth-codes", { email: email })
                            .then(() => {
                                alert("인증번호가 전송되었습니다.");
                                setShowVerificationInput(true);
                            })
                            .catch((error) => {
                                console.error("Error:", error.response?.data || error);
                            });
                    }
                }
            })
            .catch((error) => {
                console.error("Error:", error.response?.data || error);
            });
    };

    const handleCheckAuthCode = () => {
        const email = state.email;
        const authCode = state.authCode;
        console.log(email);
        console.log(authCode);
        axios
            .post("/api/members/auth/auth-codes/verify", {
                email:email, authCode:authCode
            })
            .then((response) => {
                setIsCheckAuthCode(response.data);
                alert("인증이 성공적으로 완료되었습니다.");
            })
            .catch((error) => {
                const status = error.response?.status;
                if (status === 400) {
                    alert("인증번호가 틀렸습니다.");
                } else if (status === 404) {
                    alert("유효시간이 지났습니다.");
                } else {
                    console.error("Error:", error.response?.data || error);
                }
            });
    }


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

        axios
            .post("/api/members/auth/check-nickname", {
                nickname: nickname,
            })
            .then((response) => {
                const isDuplicate = response.data;

                setIsNicknameDuplicate(isDuplicate);

                console.log(isDuplicate);
                const message = document.createElement("p");
                message.textContent = !isDuplicate ? "이미 존재하는 닉네임입니다." : "사용 가능한 닉네임입니다.";
                message.style.display = "block";
                message.style.color = !isDuplicate ? "red" : "blue";

                inputNicname.current.parentNode.parentNode.appendChild(message);

                nicknameRef.current = message;
            })
            .catch((error) => {
                console.error("Error:", error.response?.data || error);
            });
    };

    return (
        <div>
            <Header showSideCenter={false}/>
            <div className="containers" id="sign">
                <div className="login_info">
                    <p>회원가입</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{display:"flex"}}>
                        <div className={"profile_wrapper"}>
                            <h2>프로필 사진</h2>
                            <div className={"profile_content"}>
                                <ImageComponent getImgName = {uploadImgUrl} imageUrl={imageSrc}/>
                                <input className="image-upload" type="file" accept="image/*"
                                       onChange={onchangeImageUpload}/>
                                <button className="image-delete" onClick={onchangeImageDelete}>삭제</button>
                            </div>
                        </div>
                        <div style={{position:"relative"}}>
                            <div className="input_info" style={{left: "31px"}}>
                                <div className="subinfo">이메일<span className="require_info">*</span></div>
                                <div className="signup_id input_bottom">
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <input
                                            ref={inputID}
                                            name={"email"}
                                            value={state.email}
                                            onChange={handleEditemailChange}
                                            placeholder="이메일을 입력해주세요."
                                            style={{marginBottom: "0"}}
                                        />
                                        <button id="signup_nicname_btn" type="button" onClick={handleCheckDuplicateID}>
                                            중복 확인
                                        </button>
                                    </div>
                                    {state.email !== "" ? (
                                        state.isValidEmail ? (
                                            <p className="is_valid_email" style={{color: "blue"}}>유효한 email입니다.</p>
                                        ) : (
                                            <p className="is_valid_email" style={{color: "red"}}>유효하지 않은 email입니다.</p>
                                        )
                                    ) : null}
                                </div>
                                {showVerificationInput && (
                                    <div className="signup_id input_bottom">
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <input
                                                name={"authCode"}
                                                value={state.authCode}
                                                onChange={onChange}
                                                placeholder="메일로 받으신 인증번호를 입력해주세요."
                                                style={{marginBottom: "0"}}
                                            />
                                            <button id="signup_nicname_btn" type="button" onClick={handleCheckAuthCode}>
                                                인증 확인
                                            </button>
                                        </div>
                                    </div>
                                )}
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

                                <div className="subinfo">비밀번호 확인<span className="require_info">*</span></div>
                                <div className="inputpw input_bottom">
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="비밀번호 확인"
                                    />
                                    {confirmPassword && state.password ? (
                                        isPasswordMatch ? (
                                            <p style={{color: "blue"}}>비밀번호가 일치합니다.</p>
                                        ) : (
                                            <p style={{color: "red"}}>비밀번호가 일치하지 않습니다.</p>
                                        )
                                    ) : null}
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