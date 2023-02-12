import Image from "next/image";
import styles from "../styles/Header.module.css";
import Link from "next/link";
import logo from "../public/assets/logo.svg";
import node_logo from "../public/assets/node.js_logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { IState } from "../pages/boards/index";
import { Cookies } from "react-cookie";
import jwt from "jsonwebtoken";
import { loginAction, logoutAction } from "../redux/reducer";
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";

interface ILoginUser {
  isLogin: boolean;
  loginId: string;
}

interface IToken {
  userUniqueId: string;
  userNick: string;
  userId: string;
  exp: number;
  iat: number;
}

export default function Header() {
  const cookies = new Cookies();
  const loginUser = useSelector<IState, ILoginUser>(
    (state) => state.app.client.loginUser
  );
  const dispatch = useDispatch();
  const [token, setToken] = useState<IToken>();
  // useEffect(() => {
  //   token ? dispatch(loginAction(token.userId)) : ;
  // }, [token]);
  useEffect(() => {
    try {
      setToken(
        JSON.parse(JSON.stringify(jwt.decode(cookies.get("LoginToken"))))
      );
    } catch (err: any) {}
  }, []);
  useEffect(() => {
    if (token) {
      dispatch(loginAction(token?.userId));
    } else {
      dispatch(logoutAction(""));
    }
  }, [token]);
  const logoutHandler = () => {
    cookies.remove("LoginToken");
    dispatch(logoutAction(token?.userId));
  };
  return (
    <div className={styles.Header}>
      <header className={styles.appHeader}>
        <Link href={"/"}>
          <h1 className={styles.logos}>
            <Image src={logo} className={styles.react} alt={`logo`}></Image>
            <Image src={node_logo} className={styles.node} alt={`node_logo`} />
          </h1>
        </Link>
        <p>
          <Link href={"/"} className={styles.page_title}>
            Choi's DevSpace
          </Link>
        </p>
      </header>
      <div className={styles.userNav}>
        {loginUser.isLogin ? (
          <ul>
            <li>
              <Link legacyBehavior href={"/about"}>
                about me
              </Link>
            </li>
            <li>
              <Link legacyBehavior href={"/boards"}>
                게시판
              </Link>
            </li>
            <li>
              <Link legacyBehavior href={`/users/${token?.userUniqueId}`}>
                마이페이지
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/users/modify">
                쪽지함
              </Link>
            </li>
            <li>
              <a onClick={logoutHandler}>로그아웃 |</a>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link legacyBehavior href={"/about"}>
                about me
              </Link>
            </li>
            <li>
              <Link legacyBehavior href={"/boards"}>
                게시판
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/users/login">
                로그인
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/users/register">
                회원가입 |
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
