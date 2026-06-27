import { Router } from "express";
import { userControllers } from "./user.controller";

import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const route = Router();

route.get(
  "/dashboard",
  auth(UserRole.USER, UserRole.PREMIUM),
  userControllers.getUserCredential
);
route.get("/", auth(UserRole.ADMIN,UserRole.USER), userControllers.getAllUser);
route.patch("/:userId", auth(UserRole.ADMIN,UserRole.USER), userControllers.updateUser);
route.get("/:userId", auth(UserRole.ADMIN,UserRole.USER), userControllers.getSingleUser);
route.delete("/:userId", auth(UserRole.ADMIN,UserRole.USER), userControllers.deleteUser);

export const userRoute = route;
