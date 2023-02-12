import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import styles from "../styles/Board.module.css";
import { useState, useRef, LegacyRef, Dispatch, SetStateAction } from "react";
import { getBoards, putBoard } from "../lib/board_helper";
import { UseMutationResult, useMutation, useQueryClient } from "react-query";
import ReactQuill from "react-quill";
import { boardTypeAction } from "../redux/reducer";
import { BiCloudUpload } from "react-icons/bi";
import { AnyAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { IState } from "../pages/boards/index";
import { IDataProps } from "../pages/boards/[boardId]";
import { useRouter } from "next/router";

// Quill.register("modules/imageResize", ImageResize);
export interface Content {
  title: string | null | undefined;
  con: string | undefined;
}

type Board = {
  title: string;
  content: string | undefined;
  writer: string;
  regDate: string;
  hits: string;
  status: string;
};

interface IWrappedComponent {
  forwardedRef: LegacyRef<ReactQuill>;
  theme: string;
  modules: any;
  formats: string[];
  placeholder: string;
  id: string;
  className: string;
  value: string | undefined;
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
  boardId: string | undefined;
  isLoading: boolean;
  data: Board | undefined;
  error: unknown;
  dispatch: React.Dispatch<AnyAction>;
  mutationError: string;
  setMutationError: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  quillRef: React.RefObject<ReactQuill>;
  putMutation: UseMutationResult<any, unknown, any, unknown>;
}

export default function Form({
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
}: IProps) {
  const updateHandler = () => {
    const quill = document.querySelector(".ql-editor");
    const quillCon = quill?.innerHTML;
    const con = {
      boardId: boardId,
      con: {
        title: inputRef.current?.value,
        content: quillCon,
        writer: "신초이",
        regDate: new Date().toLocaleString(),
        hits: "0",
        status: "0",
      },
    };
    putMutation.mutate(con);
    location.reload();
  };
  if (putMutation.isSuccess) {
    dispatch(boardTypeAction("board"));
  }
  if (putMutation.isLoading) return <div>Loading!</div>;
  if (mutationError !== "") return <div>{mutationError}</div>;

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
  let title;
  if (data?.title) {
    title = data.title;
  }
  return (
    <div className="container">
      <div className={styles.formtitle}>
        <label htmlFor="title"></label>
        <input
          ref={inputRef}
          type="text"
          className={styles.titleInput}
          placeholder="제목"
          defaultValue={title}
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
        value={data?.content}
      ></RQuill>
      {/* <QuillNoSSRWrapper
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="내용"
        id="quill"
      ></QuillNoSSRWrapper> */}
      <button onClick={updateHandler} className={styles.btn}>
        게시
        <span>
          <BiCloudUpload className={styles.icon} size={20}></BiCloudUpload>
        </span>
      </button>
    </div>
  );
}
