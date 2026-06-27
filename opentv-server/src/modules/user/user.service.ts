import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import { User, UserStatus } from "@prisma/client";


const getAllUser = async (paginateQuery: Record<string, unknown>) => {
  const { page = 1, limit = 10 } = paginateQuery;
  const skip = (Number(page) - 1) * Number(limit);
  const result = await prisma.user.findMany({
    take: Number(limit),
    skip,
    include: {
      comments: true,
      votes: true,
      ratings: true,
      posts: true,
    },
  });
  return {
    data: result,
    meta: {
      total: await prisma.user.count({}),
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil((await prisma.user.count({})) / Number(limit)),
    },
  };
};

const getSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      comments: true,
      votes: true,
      ratings: true,
      posts: true,
    },
  });
  return result;
};

const updateUser = async (id: string, payload: Partial<User>) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    include: {
      comments: true,
      votes: true,
      ratings: true,
      posts: true,
    },
  });
  return result;
};
const deleteUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      status: UserStatus.DELETED,
    },
  });
  return result;
};

export const getuserCredentials = async (decoded: JwtPayload) => {
  const { id, email } = decoded;
  const posts = await prisma.post.findMany({
    where: {
      userId: id,
    },
    include: {
      category: true,
      ratings: true,
      votes: true,
      comments: true,
      user: true,
    },
  });
  const comments = await prisma.comment.findMany({
    where: {
      userId: id,
    },
    include: {
      post: true,
      user: true,
    },
  });
  const ratings = await prisma.rating.findMany({
    where: {
      userId: id,
    },
    include: {
      post: true,
      user: true,
    },
  });
  const votes = await prisma.vote.findMany({
    where: {
      userId: id,
    },
    include: {
      post: true,
      user: true,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      comments: true,
      votes: true,
      ratings: true,
      posts: true,
    },
  });
  return {
    posts,
    comments,
    ratings,
    votes,
    user,
  };
};

export const userServices = {
  getAllUser,
  updateUser,
  getSingleUser,
  deleteUser,
  getuserCredentials,
};
