import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../../styles/Board.module.css";
import Form from "../../components/addForm";
import Table from "../../components/table";
import { useQuery } from "react-query";
import { getBoards } from "../../lib/board_helper";
import { BiMenu, BiPencil } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { boardTypeAction } from "../../redux/reducer";
import { AnyAction } from "@reduxjs/toolkit";
import { setInterval } from "timers";

export type Board = {
  _id: string;
  title: string;
  content: string;
  writer: string;
  regDate: Date;
  hits: number;
  status: number;
};

type Boards = {
  boards: Board[];
};
export interface IState {
  app: {
    client: {
      boardType: string;
      detailId: string;
      loginUser: {
        isLogin: boolean;
        loginId: string;
      };
    };
  };
}
export default function Boards() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [dropdown, setDropdown] = useState(false);
  const { isLoading, isError, data, error } = useQuery<Boards>(
    "boards",
    getBoards
  );
  const [loading, setLoading] = useState("게시글을 가져오고 있습니다.");
  const type = useSelector<IState, string>(
    (state) => state.app.client.boardType
  );
  const dispatch = useDispatch();
  // if (router.asPath === "/boards" && type !== "board" && type !== "form") {
  //   dispatch(boardTypeAction("board"));
  // }
  useEffect(() => {
    setMounted(true);
    if (type === "" || (type !== "board" && type !== "form")) {
      dispatch(boardTypeAction("board"));
    }
  }, []);
  const props = {
    type: type,
    isLoading: isLoading,
    isError: isError,
    data: data,
    error: error,
    dispatch: dispatch,
    loading: loading,
    setLoading: setLoading,
    page: page,
    setPage: setPage,
    setDropdown: setDropdown,
    dropdown: dropdown,
  };

  return (
    <div className={styles.board_container}>
      {mounted ? TypeMaker(props) : <></>}
    </div>
  );
}
interface IDataProps {
  type: string;
  isLoading: boolean;
  isError: boolean;
  data: Boards | undefined;
  error: unknown;
  dispatch: Dispatch<AnyAction>;
  loading: string;
  setLoading: Dispatch<SetStateAction<string>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setDropdown: Dispatch<SetStateAction<boolean>>;
  dropdown: boolean;
}

function TypeMaker({
  type,
  isLoading,
  isError,
  data,
  error,
  dispatch,
  loading,
  setLoading,
  page,
  setPage,
  dropdown,
  setDropdown,
}: IDataProps) {
  const addBoardHandler = () => {
    dispatch(boardTypeAction("form"));
  };
  const boardHandler = () => {
    dispatch(boardTypeAction("board"));
  };
  let text: string;
  const loadingMotion = () => {
    let interval;
    if (isLoading) {
      if (loading === "게시글을 가져오고 있습니다....") {
        setLoading("게시글을 가져오고 있습니다.");
      }
      text = loading + ".";
      interval = setInterval(() => setLoading(text), 800);
    } else {
      clearInterval(interval);
    }
  };
  if (isLoading) {
    loadingMotion();
  }
  switch (type) {
    case "form":
      return (
        <div className="container">
          <div className={styles.btnWrap}>
            <button onClick={boardHandler} className={styles.btn}>
              글목록 보기
              <span>
                <BiMenu size={20} className="icon"></BiMenu>
              </span>
            </button>{" "}
          </div>
          <Form dispatch={dispatch}></Form>
        </div>
      );
    case "board":
      return isLoading ? (
        <div className="container">{loading}</div>
      ) : (
        <div className="container">
          <div className={styles.btnWrap}>
            <button onClick={addBoardHandler} className={styles.btn}>
              글쓰기
              <span>
                <BiPencil size={20} className="icon"></BiPencil>
              </span>
            </button>{" "}
          </div>
          {Table({
            data,
            isLoading,
            isError,
            error,
            dispatch,
            page,
            setPage,
            dropdown,
            setDropdown,
          })}
        </div>
      );
    default:
      break;
  }
}
