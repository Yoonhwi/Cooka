import Styles from "./index.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { User } from "@/types";
import { createSalt } from "@/utilities/createSalt";
import { encodePw } from "@/utilities/encodePw";
import AniButton from "@/components/AniButton";
import { checkJoinData } from "@/api/checkJoinData";

const JoinContent = () => {
  //유효성검사에 따른 상태메시지
  const [nicknameMessage, setNicknameMessage] = useState<string>("");
  const [idMessage, setIdMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [checkPasswordMessage, setCheckPasswordMessage] = useState<string>("");
  const [phoneMessage, setPhoneMessage] = useState<string>("");
  //입력된 nickname,id,password,
  const [nickname, setNickname] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [name, setName] = useState<string>("");
  // 유효성검사
  const [isNickname, setIsNickname] = useState<boolean>(false);
  const [isId, setIsId] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPhoneNum, setIsPhoneNum] = useState<boolean>(false);

  const idRegExp = /^[a-zA-z0-9]{6,12}$/;
  const nicknameRegExp = /^[가-힣]{2,8}$/;
  const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
  const phoneNumRegExp = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;
  const router = useRouter();

  const onChangeId: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setId(e.target.value);
  };

  const onChangeNickname: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNickname(e.target.value);
  };

  const onChangePhoneNum: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPhoneNum(e.target.value);
  };

  const onChangeName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const onChangePassword: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
    if (passwordRegExp.test(e.target.value)) {
      setPasswordMessage("사용가능한 비밀번호 입니다!");
    } else {
      setPasswordMessage(
        "숫자+영문자+특수문자 조합으로 8자리이상 입력해주세요"
      );
    }
  };

  const onChangePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === password) {
      if (!passwordRegExp.test(e.target.value)) {
        setIsPassword(false);
        setCheckPasswordMessage(
          "숫자+영문자+특수문자 조합으로 8자리이상 입력해주세요"
        );
      } else {
        setIsPassword(true);
        setCheckPasswordMessage("비밀번호가 일치합니다.");
      }
    } else {
      setIsPassword(false);
      setCheckPasswordMessage("비밀번호가 불일치합니다");
    }
  };

  const onClickCheckId = async () => {
    if (idRegExp.test(id)) {
      setIsId(true);
      setIdMessage("사용가능한 아이디입니다!");
      checkJoinData("login_id", id, setIsId, setIdMessage);
    } else {
      setIsId(false);
      setIdMessage("6~12사이 대소문자 또는 숫자만 입력해 주세요!");
    }
  };

  const onClickCheckNickName = () => {
    if (nicknameRegExp.test(nickname)) {
      setIsNickname(true);
      setNicknameMessage("사용가능한 닉네임입니다!");
      checkJoinData("nickname", nickname, setIsNickname, setNicknameMessage);
    } else {
      setIsNickname(false);
      setNicknameMessage("2~8사이 한글만 입력해 주세요!");
    }
  };

  const onClickPhoneNum = () => {
    if (phoneNumRegExp.test(phoneNum)) {
      setIsPhoneNum(true);
      setPhoneMessage("사용가능한 휴대폰번호입니다.");
      checkJoinData("phone", phoneNum, setIsPhoneNum, setPhoneMessage);
    } else {
      setIsPhoneNum(false);
      setPhoneMessage("-를 포함하여 입력바랍니다.");
    }
  };

  const onClickJoin = async () => {
    if (isId && isPhoneNum && isPassword && isNickname) {
      const salt = await createSalt()
        .then((res) => res)
        .catch((err) => {
          console.log(err);
        });
      if (!salt) return;
      const encodePassword = encodePw(salt, password);
      axios
        .post(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}:8000/users`, {
          name: name,
          nickname: nickname,
          phone_number: phoneNum,
          login_type: "user",
          social_id: 0,
          login_id: id,
          login_password: encodePassword,
          profile_img: "/nonuser.webp",
          profile_text: "자기소개를 입력해주세요",
          salt: salt,
        })
        .catch((err) => console.log(err));
      alert("회원가입이 완료되었습니다!");
      router.push("/");
    } else {
      alert("양식에맞게 입력 부탁드립니다!");
    }
  };

  return (
    <div className={Styles.join}>
      <div className={Styles.join_title}>
        <h1>회원가입</h1>
        <div>cooka 회원이 되어 다양한 혜택을 받아보세요!</div>
      </div>
      <div>
        <div>
          <span style={{ color: "red" }}>*</span>성함
        </div>
        <input
          type="text"
          className={Styles.input_text}
          onChange={onChangeName}
        />
      </div>
      <div>
        <div>
          <span style={{ color: "red" }}>*</span>닉네임
        </div>
        <input
          type="text"
          className={Styles.input_text}
          onChange={onChangeNickname}
        />
        <AniButton className={Styles.check_btn} onClick={onClickCheckNickName}>
          중복확인
        </AniButton>
        <div className={isNickname ? Styles.okmessage : Styles.nomessage}>
          {nicknameMessage}
        </div>
      </div>
      <div>
        <div>
          <span style={{ color: "red" }}>*</span>아이디
        </div>
        <input
          type="text"
          className={Styles.input_text}
          onChange={onChangeId}
        />
        <AniButton className={Styles.check_btn} onClick={onClickCheckId}>
          중복확인
        </AniButton>
        <div className={isId ? Styles.okmessage : Styles.nomessage}>
          {idMessage}
        </div>
      </div>
      <div>
        <div>
          <span style={{ color: "red" }}>*</span>비밀번호
        </div>
        <input
          type="password"
          className={Styles.input_text}
          onChange={onChangePassword}
        />
        <div
          className={
            passwordMessage === "사용가능한 비밀번호 입니다!"
              ? Styles.okmessage
              : Styles.nomessage
          }
        >
          {passwordMessage}
        </div>
      </div>
      <div>
        <div>
          <span style={{ color: "red" }}>*</span>비밀번호 확인
        </div>
        <input
          type="password"
          className={Styles.input_text}
          onChange={onChangePasswordCheck}
        />
        <div className={isPassword ? Styles.okmessage : Styles.nomessage}>
          {checkPasswordMessage}
        </div>
      </div>
      <div>
        <div>
          <span style={{ color: "red" }}>*</span>휴대폰번호
        </div>
        <input
          type="text"
          className={Styles.input_text}
          onChange={onChangePhoneNum}
        />
        <AniButton className={Styles.check_btn} onClick={onClickPhoneNum}>
          중복확인
        </AniButton>
        <div className={isPhoneNum ? Styles.okmessage : Styles.nomessage}>
          {phoneMessage}
        </div>
      </div>
      <div className={Styles.gojoin}>
        <AniButton className={Styles.gojoin_btn} onClick={onClickJoin}>
          가입하기
        </AniButton>
        <AniButton
          className={Styles.gojoin_btn}
          onClick={() => router.push(`/login`)}
        >
          돌아가기
        </AniButton>
      </div>
    </div>
  );
};
export default JoinContent;
