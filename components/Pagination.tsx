import { Dispatch } from "react";
import styles from "../styles/Board.module.css";
import { SetStateAction } from "react";

interface IPaginationProps {
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

function Pagination({ page, pages, setPage }: IPaginationProps) {
  const pageHandler = (i: number) => {
    setPage(i);
  };
  const element = () => {
    const result = [];
    for (let i = 1; i < pages + 1; i++) {
      if (i === page) {
        result.push(
          <li className={styles.activePage} key={i}>
            <a>{i}</a>
          </li>
        );
      } else {
        result.push(
          <li key={i} className={styles.InactivePage}>
            <a onClick={() => pageHandler(i)}>{i}</a>
          </li>
        );
      }
    }
    return result;
  };
  return <div className={styles.pageNav}>{element()}</div>;
}

export default Pagination;
