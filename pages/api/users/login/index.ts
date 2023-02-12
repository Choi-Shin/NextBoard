import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../../database/conn";
import { userLogin } from "../../../../database/user_controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await connectMongo().catch(() =>
    res.status(405).json({ error: "Error in the Connection" })
  );

  const { method } = req;

  switch (method) {
    case "POST":
      userLogin(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
