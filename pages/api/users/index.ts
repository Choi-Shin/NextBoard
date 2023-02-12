import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../database/conn";
import {
  getUser,
  getUserByEmail,
  getUserByNickname,
} from "../../../database/user_controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await connectMongo().catch(() =>
    res.status(405).json({ error: "Error in the Connection" })
  );

  const { method } = req;

  switch (method) {
    case "GET":
      if (req.query.nickname) {
        getUserByNickname(req, res);
      } else if (req.query.email) {
        getUserByEmail(req, res);
      } else {
        getUser(req, res);
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
