import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    minLength: 8,
  },
  password: { type: String, required: true },
  nickname: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  avatar: { type: String },
  regDate: { type: Date, default: Date.now() },
  auth: {
    type: Boolean,
    required: true,
  },
  secretKey: {
    type: String,
    required: true,
  },
  status: { type: Number, default: 0 },
});

const Users = models.user || model("user", UserSchema);
export default Users;
