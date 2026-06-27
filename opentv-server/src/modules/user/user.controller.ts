import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import pick from "../../utils/pick";
import { JwtPayload } from "jsonwebtoken";

const getAllUser = catchAsync(async (req, res) => {
  const paginateQuery = pick(req.query, ["page", "limit"]);
  const result = await userServices.getAllUser(paginateQuery);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrived successfully",
    data: result.data,
    meta: result.meta,
  });
});
const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userServices.getSingleUser(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrived successfully",
    data: result,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userServices.updateUser(userId, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userServices.deleteUser(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
const getUserCredential = catchAsync(async (req, res) => {
  const result = await userServices.getuserCredentials(req?.user as JwtPayload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User credential retrived successfully",
    data: result,
  });
});

export const userControllers = {
  getAllUser,
  updateUser,
  deleteUser,
  getSingleUser,
  getUserCredential,
};
