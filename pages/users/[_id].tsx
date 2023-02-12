import { Cookies } from "react-cookie";
import jwt from "jsonwebtoken";
import { useState, useEffect } from "react";

export default function myPage() {
  const [isLoading, setIsLoading] = useState(true);
  const cookies = new Cookies();
  const token = JSON.parse(
    JSON.stringify(jwt.decode(cookies.get("LoginToken")))
  );
  if (token) {
    useEffect(() => {
      setIsLoading(false);
    }, [isLoading]);
  }
  return <div>{isLoading ? "로딩중" : token.userUniqueId}</div>;
}
