import { Cookies } from "react-cookie";
import { useRouter } from "next/router";

const BASE_URL = "http://localhost:3000/";

const cookies = new Cookies();

export async function getUser(id: string) {
  const Options = {
    method: "GET",
  };
  const response = await fetch(`/api/users?id=${id}`, Options);
  const json = await response.json();
  return json;
}

export async function userLogin(formData: Object) {
  const Options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`/api/users/login`, Options);
  const json = await response.json();
  const { accessToken } = json;
  if (accessToken) {
    cookies.set("LoginToken", accessToken, {
      path: "/",
      secure: true,
      sameSite: "none",
    });
    return true;
  } else {
    return false;
  }
}

export async function userRegister(formData: Object) {
  const Options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`/api/users/register`, Options);
  const json = await response.json();
  return json;
}

export async function getUserByNickname(nickname: string) {
  const Options = {
    method: "GET",
  };
  const response = await fetch(`/api/users?nickname=${nickname}`, Options);
  const json = await response.json();
  return json;
}

export async function getUserByEmail(email: string) {
  const Options = {
    method: "GET",
  };
  const response = await fetch(`/api/users?email=${email}`, Options);
  const json = await response.json();
  return json;
}
