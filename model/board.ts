import { Schema, models, model } from "mongoose";

const BoardSchema = new Schema({
  title: String,
  content: String,
  writer: String,
  regDate: { type: Date, default: Date.now },
  hits: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  status: { type: Number, default: 0 },
});

const Boards = models.board || model("board", BoardSchema);
export default Boards;
