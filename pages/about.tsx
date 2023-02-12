import Image from "next/image";

export default function About() {
  return (
    <div className="container">
      <div className="subtitle">
        <h3>introduce</h3>
        <div className="introduce">
          <div className="note">
            <p>안녕하세요. 저는 풀스택 개발자 신초이입니다.</p>
          </div>
        </div>
      </div>
      <div className="portContainer">
        <h3>Portfolio</h3>
      </div>

      <hr />
      <div className="portfolioBox">
        <div className="card">
          <a href="http://pf.kakao.com/_wzjIxj/chat">
            <img src="/assets/kakao.gif" alt="" width={350} />
          </a>
          <p> 카카오 챗봇</p>
        </div>
        <div className="card"> 스프링 게시판</div>
        <div className="card"> 영상통화 앱</div>
        <div className="card">Next.js 게시판</div>
        <div className="card">GoLang file Downloader</div>
      </div>
      <hr />
      <div className="siteStack">
        <div>이 홈페이지는 다음과 같은 개발도구로 제작되었습니다.</div>
        <div className="styleNoneList">
          <ul className="note">
            <li>language: typescript</li>
            <li>front-end: Next.js</li>
            <li>back-end: Next.js</li>
            <li>server: nginx</li>
            <li>server-os: ubuntu 22.04 LTS</li>
            <li>db: mongoose</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
