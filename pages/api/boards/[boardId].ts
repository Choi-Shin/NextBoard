import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../database/conn";
import {
  deleteBoard,
  getBoard,
  putBoard,
} from "../../../database/board_controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "Error in the Connection..!" });
  });

  const { method } = req;

  switch (method) {
    case "GET":
      getBoard(req, res);
      break;
    case "PUT":
      putBoard(req, res);
      break;
    case "DELETE":
      deleteBoard(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
