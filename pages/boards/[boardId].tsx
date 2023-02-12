import { NextRouter, useRouter } from "next/router";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import styles from "../../styles/Board.module.css";
import {
  deleteBoard,
  getBoard,
  getBoards,
  putBoard,
} from "../../lib/board_helper";
import { useDispatch, useSelector } from "react-redux";
import { boardTypeAction } from "../../redux/reducer";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnyAction } from "@reduxjs/toolkit";
import Form from "../../components/updateForm";
import { IState } from ".";
import ReactQuill from "react-quill";
import { IUser } from "../../database/user_controller";
import { Cookies } from "react-cookie";
import jwt from "jsonwebtoken";

export default function Board() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const detailId = router.query.boardId?.toString();
  const { isLoading, isError, data, error } = useQuery<Board>({
    queryKey: ["board", detailId],
    queryFn: () => {
      return getBoard(detailId !== undefined ? detailId : "");
    },
  });
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  const queryClient = useQueryClient();
  const putMutation = useMutation(putBoard, {
    onSuccess: () => {
      queryClient.prefetchQuery("boards", getBoards);
      dispatch(boardTypeAction("detail"));
      location.reload();
    },
    onError: (error) => {
      if (typeof error === "string") setMutationError(error);
    },
  });
  const deleteMutation = useMutation(deleteBoard, {
    onSuccess: () => {
      router.push("/boards");
      queryClient.prefetchQuery("boards", getBoards);
      dispatch(boardTypeAction("board"));
    },
    onError: (error) => {
      if (typeof error === "string") setMutationError(error);
    },
  });

  const type = useSelector<IState, string>(
    (state) => state.app.client.boardType
  );
  const cookies = new Cookies();
  let nick;
  let token = cookies.get("LoginToken");
  if (cookies.get("LoginToken")) {
    nick = JSON.parse(
      JSON.stringify(jwt.decode(cookies.get("LoginToken")))
    ).userNick;
  }
  if (type === "update" && inputRef.current && data) {
    inputRef.current.value = data.title;
  }
  useEffect(() => {
    setMounted(true);
    if (type === "" || (type !== "update" && type !== "detail")) {
      dispatch(boardTypeAction("detail"));
    }
  }, []);
  const props = {
    boardId: detailId,
    type: type,
    isLoading: isLoading,
    isError: isError,
    data: data,
    error: error,
    dispatch: dispatch,
    mutationError: mutationError,
    setMutationError: setMutationError,
    inputRef: inputRef,
    quillRef: quillRef,
    putMutation: putMutation,
    deleteMutation: deleteMutation,
    router: router,
    nick: nick,
    token: token,
  };
  return data ? TypeMaker(props) : <></>;
}

type Board = {
  title: string;
  content: string | undefined;
  writer: string;
  regDate: string;
  hits: string;
  status: string;
};

export interface IDataProps {
  boardId: string | undefined;
  type: string;
  isLoading: boolean;
  isError: boolean;
  data: Board | undefined;
  error: unknown;
  dispatch: Dispatch<AnyAction>;
  mutationError: string;
  setMutationError: Dispatch<SetStateAction<string>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  quillRef: React.RefObject<ReactQuill>;
  putMutation: UseMutationResult<any, unknown, any, unknown>;
  deleteMutation: UseMutationResult<any, unknown, any, unknown>;
  router: NextRouter;
  nick: string;
  token: string;
}

function TypeMaker({
  boardId,
  type,
  isLoading,
  isError,
  data,
  error,
  dispatch,
  mutationError,
  setMutationError,
  inputRef,
  quillRef,
  putMutation,
  deleteMutation,
  router,
  nick,
  token,
}: IDataProps) {
  const updateHandler = () => {
    dispatch(boardTypeAction("update"));
  };
  interface IdeleteToken {
    boardId: string;
    token: string;
  }
  const deleteCon = {
    boardId: boardId,
    token: token,
  };
  const deleteHandler = () => {
    deleteMutation.mutate(deleteCon);
    if (deleteMutation.isSuccess) {
      console.log("성공");
    }
    dispatch(boardTypeAction("delete"));
  };
  const listHandler = () => {
    router.push("/boards");
  };
  switch (type) {
    case "detail":
      let dateString;
      if (data?.regDate) {
        const date = new Date(data.regDate);
        dateString = date.toLocaleString();
      }
      return data ? (
        <div className="container">
          <div className={styles.quillCon}>
            <h1>{data.title}</h1>
            <span>
              {data.writer} | {dateString}
            </span>
            <hr />
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: typeof data.content === "string" ? data.content : "",
              }}
            ></div>
          </div>
          {nick === data.writer ? (
            <div className={styles.btnWrap}>
              <button onClick={updateHandler} className={styles.btn}>
                수정하기
              </button>{" "}
              <button onClick={deleteHandler} className={styles.btn}>
                삭제하기
              </button>{" "}
            </div>
          ) : (
            <></>
          )}

          <div>
            <button onClick={listHandler} className={styles.btn}>
              목록으로
            </button>{" "}
          </div>
        </div>
      ) : (
        <></>
      );
    case "update":
      return data ? (
        Form({
          boardId,
          isLoading,
          data,
          error,
          dispatch,
          mutationError,
          setMutationError,
          inputRef,
          quillRef,
          putMutation,
        })
      ) : (
        <></>
      );
    case "delete":
      return <div className="container">삭제되었습니다. </div>;
    default:
      break;
  }
}
