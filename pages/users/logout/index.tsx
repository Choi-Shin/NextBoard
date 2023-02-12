import { Cookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../../redux/reducer";
import { IState } from "../../boards/index";

export default function Logout() {
  const cookies = new Cookies();
  const userId = useSelector<IState, string>(
    (state) => state.app.client.loginUser.loginId
  );
  const dispatch = useDispatch();
  cookies.remove("LoginToken");
  dispatch(logoutAction(userId));
  return;
}
