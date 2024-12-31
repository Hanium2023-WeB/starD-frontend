import React from "react";
import Header from "../../components/repeat_etc/Header";
import LOGO from "../../images/Logo.png";

const ResetPasswordEmailSent = () => {
  return (
      <div>
        <Header showSideCenter={false}/>
        <div style={styles.container}>
          <img style={styles.logo} src={LOGO} alt="LOGO" width="100px"/>
          <p style={styles.title}>비밀번호 재설정 이메일 전송 완료!</p>
          <p style={styles.message}>
            입력하신 이메일 주소로 비밀번호 재설정 링크를 보냈습니다.
            <br/>
            이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
          </p>
          <button style={styles.button}
                  onClick={() => window.location.href = "/"}>
            홈으로 돌아가기
          </button>
        </div>
      </div>

  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    textAlign: "center"
  },
  logo: {
    marginBottom: "30px"
  },
  title: {
    fontSize: "1.7em",
    fontWeight: "bold",
    marginBottom: "40px",
    color: "#395b64",
  },
  message: {
    fontSize: "1.3em",
    lineHeight: "1.5",
    marginBottom: "30px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1.3em",
    color: "#fff",
    backgroundColor: "#99A98F",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default ResetPasswordEmailSent;