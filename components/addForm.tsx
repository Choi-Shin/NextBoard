import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import styles from "../styles/Board.module.css";
import { useState, useRef, LegacyRef, Dispatch } from "react";
import { addBoard, getBoards } from "../lib/board_helper";
import { useMutation, useQueryClient } from "react-query";
import { boardTypeAction } from "../redux/reducer";
import { BiCloudUpload } from "react-icons/bi";
import { AnyAction } from "@reduxjs/toolkit";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { IState } from "../pages/boards/index";
import { getUser } from "../lib/user_helper";
import { IUser } from "../database/user_controller";
import { Cookies } from "react-cookie";
import jwt from "jsonwebtoken";

interface IWrappedComponent {
  forwardedRef: LegacyRef<ReactQuill>;
  theme: string;
  modules: any;
  formats: string[];
  placeholder: string;
  id: string;
  className: string;
}

const RQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return function comp({ forwardedRef, ...props }: IWrappedComponent) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

interface IProps {
  dispatch: Dispatch<AnyAction>;
}

export default function Form({ dispatch }: IProps) {
  const queryClient = useQueryClient();
  const [mutationErr, setMutationErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill>(null);
  const isLogin = useSelector<IState, boolean>(
    (state) => state.app.client.loginUser.isLogin
  );
  let userNickname: string;
  if (isLogin) {
    const cookies = new Cookies();
    const token = JSON.parse(
      JSON.stringify(jwt.decode(cookies.get("LoginToken")))
    );
    userNickname = token?.userNick || "";
  }
  const addMutation = useMutation(addBoard, {
    onSuccess: () => {
      queryClient.prefetchQuery("boards", getBoards);
    },
    onError: (error) => {
      if (typeof error === "string") setMutationErr(error);
    },
  });
  const uploadHandler = async () => {
    const quill = document.querySelector(".ql-editor");
    const quillCon = quill?.innerHTML;
    const con = {
      title: inputRef.current?.value,
      content: quillCon,
      writer: userNickname ? userNickname : "비회원",
      regDate: Date(),
      hits: 0,
      status: 0,
    };
    addMutation.mutate(con);
    setTimeout(() => {
      location.reload();
    }, 1000);
  };
  if (addMutation.isSuccess) {
    dispatch(boardTypeAction("board"));
  }
  if (addMutation.isLoading) return <div>Loading!</div>;
  if (mutationErr !== "") return <div>{mutationErr}</div>;

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    // ImageResize: {
    //   parchment: Quill.import("parchment"),
    //   modules: ["Resize", "DisplaySize"],
    // },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <div>
      <div className={styles.formtitle}>
        <label htmlFor="title"></label>
        <input
          ref={inputRef}
          type="text"
          className={styles.titleInput}
          placeholder="제목"
        />
      </div>
      <RQuill
        forwardedRef={quillRef}
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="내용"
        id="quill"
        className={styles.quillEdit}
      ></RQuill>
      {/* <QuillNoSSRWrapper
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="내용"
        id="quill"
      ></QuillNoSSRWrapper> */}
      <button onClick={uploadHandler} className={styles.btn}>
        게시
        <span>
          <BiCloudUpload className={styles.icon} size={20}></BiCloudUpload>
        </span>
      </button>
    </div>
  );
}
