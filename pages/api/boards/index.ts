import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../database/conn";
import { addBoard, getBoards } from "../../../database/board_controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "Error in the Connection" });
  });

  // type of request
  const { method } = req;

  // ["GET", "POST", "PUT", "DELETE"];
  switch (method) {
    case "GET":
      getBoards(req, res);
      break;
    case "POST":
      addBoard(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
