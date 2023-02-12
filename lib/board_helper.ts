// const BASE_URL = "http://localhost:3000";

export async function getBoards() {
  const Options = {
    method: "GET",
  };
  const response = await fetch(`/api/boards`, Options);
  const json = await response.json();
  return json;
}

export async function getBoard(detailId: string) {
  const response = await fetch(`/api/boards/${detailId}`);
  const json = await response.json();
  if (json) return json;
  return {};
}

export async function addBoard(content: Object) {
  try {
    const Options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    };
    const response = await fetch(`/api/boards`, Options);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}

type putType = {
  boardId: string | undefined;
  con: Object;
};
export async function putBoard(content: putType) {
  try {
    const Options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content.con),
    };
    const response = await fetch(`/api/boards/${content.boardId}`, Options);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}
interface IdeleteToken {
  boardId: string;
  token: string;
}
export async function deleteBoard(deleteCon: IdeleteToken) {
  try {
    const Options = {
      method: "DELETE",
    };
    const response = await fetch(`/api/boards/${deleteCon.boardId}`, Options);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}
