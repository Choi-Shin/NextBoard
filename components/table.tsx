import { useQuery } from "react-query";
import styles from "../styles/Board.module.css";
import { getBoards } from "../lib/board_helper";
import { Board } from "../pages/boards";
import { useDispatch } from "react-redux";
import {
  boardTypeAction,
  detailAction,
  dropdownAction,
} from "../redux/reducer";
import { Dispatch, SetStateAction, useEffect } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import Pagination from "./Pagination";
import { getUserByNickname } from "../lib/user_helper";

type Boards = {
  boards: Board[];
};

interface IProps {
  isLoading: boolean;
  isError: boolean;
  data: Boards | undefined;
  error: unknown;
  dispatch: Dispatch<AnyAction>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  dropdown: boolean;
  setDropdown: Dispatch<SetStateAction<boolean>>;
}
export default function Table({
  isLoading,
  isError,
  data,
  error,
  dispatch,
  page,
  setPage,
  dropdown,
  setDropdown,
}: IProps) {
  let newData;
  let pagination;
  let pages: number;
  let dataLen: number;
  if (Array.isArray(data)) {
    newData = data.slice(0).reverse();
    dataLen = newData.length;
    pages = Math.floor(dataLen / 10 + 1);
    pagination = newData.slice((page - 1) * 10, page * 10);
  } else {
    pages = 1;
  }
  if (isLoading) return <div>Contents ard Loading..</div>;
  if (isError) return <div>Got Error {`${error}`}</div>;

  return (
    <>
      <table className={styles.board_table}>
        <colgroup>
          <col className="num" width="7%" />
          <col />
          <col className="writer" width="10%" />
          <col className="wDate" width="18%" />
          <col className="hit" width="10%" />
        </colgroup>
        <thead className={styles.thead}>
          <tr className={styles.th}>
            <th>번호</th>
            <th className={styles.title}>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {pagination && Array.isArray(pagination) ? (
            pagination.map((obj: Board, i: number) => (
              <Tr
                {...obj}
                num={dataLen - (page - 1) * 10 - i}
                dispatch={dispatch}
                key={i}
                setDropdown={setDropdown}
                dropdown={dropdown}
              />
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
      <Pagination page={page} pages={pages} setPage={setPage}></Pagination>
    </>
  );
}

interface TrIProps {
  dispatch: Dispatch<AnyAction>;
  num: number;
  key: number;
  _id: string;
  title: string;
  content: string;
  writer: string;
  regDate: Date;
  hits: number;
  status: number;
  dropdown: boolean;
  setDropdown: Dispatch<SetStateAction<boolean>>;
}

function Tr({
  _id,
  title,
  writer,
  regDate,
  hits,
  num,
  dispatch,
  setDropdown,
  dropdown,
}: TrIProps) {
  const router = useRouter();
  const DetailHandler = (_id: string, dispatch: Dispatch<AnyAction>) => {
    dispatch(detailAction(_id));
    router.push(`/boards/${_id}`);
  };
  const date = new Date(regDate).toLocaleDateString();
  const today = new Date().toLocaleDateString();
  const time = new Date(regDate).toLocaleTimeString().split(" ");
  let dateString;
  const day = date.split(".");
  if (date === today) {
    if (time[0] === "오후") {
      const timeNum = time[1].split(":");
      dateString =
        parseInt(timeNum[0]) + 12 + ":" + timeNum[1] + ":" + timeNum[2];
    } else {
      dateString = time[1];
    }
  } else {
    dateString = `${day[0].substring(0, 4)}.${
      day[1].trim().length === 1 ? "0" + day[1].trim() : day[1].trim()
    }.${day[2].trim().length === 1 ? "0" + day[2].trim() : day[2].trim()}`;
  }
  const dropDown = () => {
    setDropdown(!dropdown);
  };
  return (
    <tr className={styles.tr}>
      <td>
        <div className={styles.trHeight}>{num}</div>
      </td>
      <td
        onClick={(e) => {
          DetailHandler(_id, dispatch);
        }}
        className={styles.board_title}
      >
        {title}
      </td>
      <td>
        <a onClick={dropDown}>{writer}</a>
      </td>
      <td>
        {" "}
        <div className={styles.trHeight}>{dateString}</div>
      </td>
      <td>{hits}</td>
    </tr>
  );
}
