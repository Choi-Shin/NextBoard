import { NextApiRequest, NextApiResponse } from "next";
import Users from "../model/user";
import { Mongoose, MongooseError } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser {
  id: string;
  password: string;
  nickname: string;
  email: string;
  avatar: string;
  regDate: Date;
  auth: boolean;
  status: number;
  secretKey: string;
}

const SALT_WORK_FACTOR = 10;

const genPassword = async (keyword: string) => {
  const hash = await bcrypt.hash(keyword, SALT_WORK_FACTOR);
  return hash;
};

const comparePassword = (password: string, dbPassword: string) => {
  if (password !== dbPassword) {
    return false;
  }
  return true;
};

export async function userLogin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      res.status(200).json({ message: "아이디나 패스워드를 확인해주세요." });
    }
    const user = await Users.findOne({ id: id });
    if (!user) {
      return res.status(200).json({ message: "존재하지 않는 유저입니다." });
    }
    const secretKey = await genPassword(id);
    if (await bcrypt.compare(password, user.password)) {
      try {
        const accessToken = await new Promise((resolve, reject) => {
          jwt.sign(
            {
              userUniqueId: user._id,
              userId: user.id,
              userNick: user.nickname,
            },
            secretKey,
            {
              expiresIn: "5m",
            },
            (err, token) => {
              if (err) {
                reject(err);
              } else {
                resolve(token);
              }
            }
          );
        });
        res.status(200).json({ accessToken });
      } catch (err) {
        res.status(404).json({ message: "토큰 서명에 실패했습니다." });
      }
    } else {
      res.status(200).json({ error: "로그인에 실패하였습니다." });
    }
  } catch (error) {
    res.status(404).json({ message: "Error while fetching data." });
  }
}

export async function userRegister(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, password, nickname, email } = req.body;
    const hashedPassword = await genPassword(password);
    const user: IUser = await {
      id: id,
      password: hashedPassword,
      nickname: nickname,
      email: email,
      avatar:
        "data:image/svg;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzQwIiBoZWlnaHQ9IjM0MCI+CjxwYXRoIGZpbGw9IiNEREQiIGQ9Im0xNjksLjVhMTY5LDE2OSAwIDEsMCAyLDB6bTAsODZhNzYsNzYgMCAxCjEtMiwwek01NywyODdxMjctMzUgNjctMzVoOTJxNDAsMCA2NywzNWExNjQsMTY0IDAgMCwxLTIyNiwwIi8+Cjwvc3ZnPg==",
      regDate: new Date(),
      status: 0,
      auth: false,
      secretKey: await genPassword("id"),
    };
    console.log(user.password);
    await Users.create(
      user,
      function (err: MongooseError, data: Promise<Mongoose>) {
        if (err) {
          return res.status(200).json({ message: err });
        }
        res.status(200).json({ message: "가입을 축하합니다" });
      }
    );
  } catch (error) {
    res.status(404).json({ message: "Error while fetching data." });
  }
}

export async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(404).json({ code: 2 });
    }
    const user = await Users.findOne({ id: id });
    if (user) {
      return res.status(200).json({ code: 2 });
    }
    res.status(200).json({ code: 1 });
  } catch (error) {
    res.status(404).json({ code: 2 });
  }
}

export async function getUserByNickname(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const nickname = req.query.nickname;
    if (!nickname) {
      return res
        .status(404)
        .json({ message: "검색할 유저가 존재하지 않습니다." });
    }
    const user = await Users.findOne({ nickname: nickname });
    if (user) {
      return res.status(200).json({ message: "이미 존재하는 닉네임입니다." });
    }
    res.status(200).json({ message: "사용 가능한 닉네임입니다." });
  } catch (error) {
    res.status(404).json({ message: "잠시 후 다시 시도해주세요." });
  }
}

export async function getUserByEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const email = req.query.email;
  if (!email) {
    return res
      .status(404)
      .json({ message: "이메일을 입력하여 검색하여 주세요." });
  }
  try {
    const user = await Users.findOne({ email: email });
    if (user) {
      res.status(200).json({ message: "이미 가입된 이메일 입니다." });
    } else {
      res.status(200).json({ message: "가입이 가능한 이메일 주소입니다." });
    }
  } catch (error) {
    res.status(404).json({ message: "잠시 후 다시 시도해주세요." });
  }
}
