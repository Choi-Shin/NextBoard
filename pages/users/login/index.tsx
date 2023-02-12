import { useDispatch } from "react-redux";
import styles from "../../../styles/UserForm.module.css";
import { boardTypeAction, loginAction } from "../../../redux/reducer";
import type { NextPage, NextPageContext } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { BiLogIn } from "react-icons/bi";
import { userLogin } from "../../../lib/user_helper";

interface FormValue {
  id: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValue>();
  const dispatch = useDispatch();

  const router = useRouter();
  const login: SubmitHandler<FormValue> = async (data) => {
    const newLoginArrary = {
      id: data.id,
      password: data.password,
    };
    const result = await userLogin(newLoginArrary);
    if (result) {
      alert(`${data.id}님 환영합니다.`);
      dispatch(loginAction(data.id));
      router.push("/");
    } else {
      alert("아이디나 비밀번호를 확인해주세요.");
      return false;
    }
  };
  return (
    <div className="container">
      <form
        method="POST"
        onSubmit={handleSubmit(login)}
        className={styles.form}
      >
        <label className={styles.label}>
          아이디
          <input {...register("id")} type="text" className={styles.input} />
        </label>
        <label className={styles.label}>
          비밀번호
          <input
            {...register("password")}
            type="password"
            className={styles.input}
          />
        </label>
        <button className={styles.button}>
          <span>
            로그인
            <BiLogIn size={20} className="icon"></BiLogIn>
          </span>
        </button>
      </form>
    </div>
  );
}
