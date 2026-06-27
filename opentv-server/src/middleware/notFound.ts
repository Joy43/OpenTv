import { Request, Response } from "express";
import status from "http-status";

const notFound = (req: Request, res: Response) => {
  console.log({ url: req.originalUrl });
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Api not found",
    data: null,
  });
};

export default notFound;