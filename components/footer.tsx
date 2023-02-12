import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <>
      <footer>
        <nav className={styles.footerNav}>
          <a
            href="https://choi-shin.notion.site/9765258ba23f4f2399c58f417d3599d8"
            target="_blank"
          >
            Notion
          </a>{" "}
          |&nbsp;
          <a href="https://github.com/Choi-Shin" target="_blank">
            Github
          </a>
        </nav>
        <p>
          <span>저자 : Choi-Shin</span>
          <br />
          <span>
            <a href="mailto:shincho1990@naver.com">메일 보내기</a>
          </span>
          <br />
          <span>Copyright 2023. Choi-Shin. All Rights Reserved.</span>
        </p>
      </footer>
    </>
  );
}
