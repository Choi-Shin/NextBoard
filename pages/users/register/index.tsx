import { useDispatch } from "react-redux";
import styles from "../../../styles/UserForm.module.css";
import { boardTypeAction } from "../../../redux/reducer";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  getUser,
  getUserByEmail,
  getUserByNickname,
  userRegister,
} from "../../../lib/user_helper";
import { useState } from "react";
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs";

interface FormValue {
  id: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  email: string;
}

export default function Register() {
  // 0 - 중립, 1 - 통과, 2- 실패, 3 - 길이 주의
  const [idCheck, setIdCheck] = useState(0);
  const [validPwd, setValidPwd] = useState(0);
  const [pwdCheck, setPwdCheck] = useState(0);
  const [nickCheck, setNickCheck] = useState(0);
  const [emailCheck, setEmailCheck] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValue>();

  const validate = (data: FormValue) => {
    if (
      idCheck === 1 &&
      validPwd === 1 &&
      pwdCheck === 1 &&
      nickCheck === 1 &&
      emailCheck === 1
    ) {
      return true;
    }
    return false;
  };
  const router = useRouter();
  const userReg: SubmitHandler<FormValue> = (data) => {
    const isAvailable = validate(data);
    if (isAvailable) {
      userRegister(data);
      router.push("/");
      alert("회원 가입 성공!\n환영합니다.");
    } else {
      return false;
    }
  };

  const checkId = async () => {
    const re = /^[A-Za-z0-9]+$/;
    const id = watch("id");
    if (id && !re.test(id)) {
      setIdCheck(3);
      return;
    }
    if (id)
      if (id.length < 8 || id.length > 16) {
        setIdCheck(2);
        return false;
      } else {
        const res = await getUser(id);
        setIdCheck(res.code);
      }
  };

  const validatePwd = () => {
    const pwd = watch("password");
    const re_length = /^.{8,20}$/;
    const re = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z!@#]{8,20}$/;
    if (pwd) {
      if (!re_length.test(pwd)) {
        setValidPwd(3);
      } else {
        if (!re.test(pwd)) {
          setValidPwd(2);
        } else {
          setValidPwd(1);
        }
      }
    } else {
      setValidPwd(0);
    }
  };
  const passwordCheck = () => {
    // setPwdCheck()의 초기값은 0으로 어떠한 태그도 생성되지 않는다.
    if (watch("confirmPassword") === "") {
      setPwdCheck(0);
      return;
    }
    if (watch("password") === watch("confirmPassword")) {
      // 가능
      setPwdCheck(1);
    } else {
      // 불가능
      setPwdCheck(2);
    }
  };
  const checkUniqueNickname = async () => {
    const nickname = watch("nickname");
    if (nickname) {
      const res = await getUserByNickname(nickname);
      if (res.message === "사용 가능한 닉네임입니다.") {
        setNickCheck(1);
      } else {
        setNickCheck(2);
      }
    } else {
      setNickCheck(0);
    }
  };
  const checkEmail = async () => {
    const email = watch("email");
    const re =
      /([\w\.\_\-])([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    if (!email) {
      setEmailCheck(0);
    } else {
      if (re.test(email)) {
        const res = await getUserByEmail(email);
        if (res.message === "가입이 가능한 이메일 주소입니다.") {
          setEmailCheck(1);
        } else if (res.message === "이미 가입된 이메일 입니다.") {
          setEmailCheck(2);
        }
      } else {
        setEmailCheck(3);
      }
    }
  };
  return (
    <div className="container">
      <form
        className={styles.form}
        onSubmit={handleSubmit(userReg)}
        method="POST"
      >
        <label className={styles.label}>
          아이디
          <input
            type="text"
            {...register("id")}
            onBlur={checkId}
            className={
              !idCheck
                ? styles.input
                : idCheck === 1
                ? styles.success
                : styles.failed
            }
          />
          {idCheck ? (
            idCheck === 1 ? (
              <span className={styles.msgSuccess}>
                {idCheck}
                <BsCheckCircle
                  color="green"
                  className="icon"
                  size={18}
                ></BsCheckCircle>
              </span>
            ) : (
              <span className={styles.msgFailed}>
                {idCheck}
                <BsExclamationCircle
                  className="icon"
                  size={18}
                  color="red"
                ></BsExclamationCircle>
              </span>
            )
          ) : (
            <></>
          )}
        </label>
        <label className={styles.label}>
          비밀번호
          <input
            type="password"
            {...register("password")}
            className={
              validPwd === 0
                ? styles.input
                : validPwd === 1
                ? styles.success
                : styles.failed
            }
            onBlur={validatePwd}
          />
          {!validPwd ? (
            <></>
          ) : validPwd === 1 ? (
            <span className={styles.msgSuccess}>
              사용 가능한 비밀번호 입니다.
              <BsCheckCircle
                className="icon"
                size={18}
                color="green"
              ></BsCheckCircle>
            </span>
          ) : validPwd === 3 ? (
            <span className={styles.msgFailed}>
              비밀번호는 8자 이상 20자 이하로 생성해주세요.
              <BsExclamationCircle
                className="icon"
                size={18}
                color="red"
              ></BsExclamationCircle>
            </span>
          ) : (
            <span className={styles.msgFailed}>
              비밀번호는 영문 대/소문자, 숫자, 특수문자(!@#)를<br></br>포함할 수
              있으며 영문과 숫자는 필수 사향입니다.
              <BsExclamationCircle
                className="icon"
                size={18}
                color="red"
              ></BsExclamationCircle>
            </span>
          )}
        </label>
        <label className={styles.label}>
          비밀번호 확인
          <input
            type="password"
            {...register("confirmPassword")}
            className={
              pwdCheck === 0
                ? styles.input
                : pwdCheck === 1
                ? styles.success
                : styles.failed
            }
            onBlur={passwordCheck}
          />
          {pwdCheck === 1 ? (
            <span className={styles.msgSuccess}>
              비밀번호가 일치합니다.
              <BsCheckCircle
                className="icon"
                size={18}
                color="green"
              ></BsCheckCircle>
            </span>
          ) : pwdCheck === 2 ? (
            <span className={styles.msgFailed}>
              비밀번호가 서로 다릅니다.
              <BsExclamationCircle
                className="icon"
                size={18}
                color="red"
              ></BsExclamationCircle>
            </span>
          ) : (
            <></>
          )}
        </label>
        <label className={styles.label}>
          닉네임
          <input
            type="text"
            {...register("nickname")}
            className={
              !nickCheck
                ? styles.input
                : nickCheck === 1
                ? styles.success
                : styles.failed
            }
            onBlur={checkUniqueNickname}
          />
          {!nickCheck ? (
            <></>
          ) : nickCheck === 1 ? (
            <span className={styles.msgSuccess}>
              사용 가능한 닉네임 입니다.
              <BsCheckCircle
                className="icon"
                size={18}
                color="green"
              ></BsCheckCircle>
            </span>
          ) : (
            <span className={styles.msgFailed}>
              이미 존재하는 닉네임 입니다.
              <BsExclamationCircle
                className="icon"
                size={18}
                color="red"
              ></BsExclamationCircle>
            </span>
          )}
        </label>
        <label className={styles.label}>
          이메일
          <input
            type="email"
            {...register("email")}
            className={styles.input}
            onBlur={checkEmail}
          />
          {!emailCheck ? (
            <></>
          ) : emailCheck === 1 ? (
            <span className={styles.msgSuccess}>
              사용 가능한 이메일 입니다.
              <BsCheckCircle
                className="icon"
                size={18}
                color="green"
              ></BsCheckCircle>
            </span>
          ) : (
            <span className={styles.msgFailed}>
              이미 가입된 이메일이거나 유효하지 않은 이메일 주소입니다.
              <BsExclamationCircle
                className="icon"
                size={18}
                color="red"
              ></BsExclamationCircle>
            </span>
          )}
        </label>
        <button className={styles.button}>회원가입</button>
      </form>
    </div>
  );
}
