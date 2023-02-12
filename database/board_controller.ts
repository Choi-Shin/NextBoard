import { NextApiRequest, NextApiResponse } from "next";
import Boards from "../model/board";
import { Mongoose, MongooseError } from "mongoose";

import { Cookies } from "react-cookie";
import jwt from "jsonwebtoken";

// get: http://localhost:3000/api/boards
export async function getBoards(req: NextApiRequest, res: NextApiResponse) {
  try {
    const boards = await Boards.find({ status: 0 });
    if (!boards) {
      return res.status(404).json({ error: "Data not found." });
    }
    res.status(200).json(boards);
  } catch (error) {
    res.status(404).json({ error: "Error while fetching data." });
  }
}
// get: http://localhost:3000/api/boards/:id
export async function getBoard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { boardId } = req.query;
    if (boardId) {
      const board = await Boards.findById(boardId);
      board.hits = (parseInt(board.hits) + 1).toString();
      await Boards.findByIdAndUpdate(boardId, board);
      return res.status(200).json(board);
    }
    res.status(404).json({ error: "Board not selected" });
  } catch (error) {
    res.status(404).json({ error: "Cannot get the board...!" });
  }
}

// post: http://localhost:3000/api/boards/
export async function addBoard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData = req.body;
    if (!formData)
      return res.status(404).json({ error: "Form data not provided...!" });
    await Boards.create(
      formData,
      function (err: MongooseError, data: Promise<Mongoose>) {
        if (err) {
          return res.status(404).json({ err });
        }
        res.status(200);
      }
    );
  } catch (error) {
    res.status(404).json({ error });
  }
}

export async function putBoard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData = req.body;
    const { boardId } = req.query;
    if (!formData)
      return res.status(404).json({ error: "Form data not provided...!" });
    await Boards.findByIdAndUpdate(
      boardId,
      formData,
      function (err: MongooseError, data: Promise<Mongoose>) {
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    res.status(404).json({ error });
  }
}

export async function deleteBoard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { boardId } = req.query;
    if (!boardId)
      return res.status(404).json({ error: "Form data not provided...!" });
    const board = await Boards.findById(boardId);
    board.status = 1;
    await Boards.findByIdAndUpdate(
      boardId,
      board,
      function (err: MongooseError, data: Promise<Mongoose>) {
        return null;
      }
    );
    res.status(200);
  } catch (error) {
    res.status(404).json({ error });
  }
}
