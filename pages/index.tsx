import Seo from "../components/SEO";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { IState } from "./boards/index";
export default function Home() {
  const router = useRouter();
  const toBoard = () => {
    router.push("/boards");
  };
  const userId = useSelector<IState, string>(
    (state) => state.app.client.loginUser.loginId
  );

  return (
    <>
      <Seo title="Home" />
      <div className="container">
        <h3>{userId ? userId + "님" : ""} 환영합니다.</h3>

        <button className="btn" onClick={toBoard}>
          게시판으로...
        </button>
      </div>
    </>
  );
}
