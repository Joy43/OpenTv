import express from "express";
import cors from "cors";
import route from "./routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";
import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://serverportfolio-eta.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
      
    ],
    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "portfiolio Server is up and running now",
  });
});

setupSwagger(app);
app.use("/api", route);
app.use(globalErrorHandler);
app.use(notFound);

export default app;