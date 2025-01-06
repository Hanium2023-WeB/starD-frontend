import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import {useEventSource} from "../notification/EventSourceContext";

const Logout = ({sideheader}) => {

  const navigate = useNavigate();
  const { closeEventSource, setAccessToken } = useEventSource();
  
  useEffect(() => {
    const member = localStorage.getItem('isLoggedInUserId');
    const accessToken = localStorage.getItem('accessToken');


    if (member && accessToken) {
      axios.post("/api/members/auth/sign-out", {}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then((res) => {
        console.log("로그아웃 성공");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isLoggedInUserId');
        localStorage.removeItem('todos');
        localStorage.removeItem('ApplyStudies');
        localStorage.removeItem('selectedSido');
        localStorage.removeItem('selectedGugun');
        localStorage.removeItem('tags');
        localStorage.removeItem('studies');

        closeEventSource();
        setAccessToken(null);

        alert("로그아웃 성공");
        navigate('/');
      })
      .catch((error) => {
        console.log("로그아웃 실패" + error);
        navigate('/');
      });
    } else {
      console.log("로그아웃 실패 (로그인 하지 않는 상태)");
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, []);
  return (
      null
  );
}

export default Logout;