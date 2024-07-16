import * as express from "express";
import { deliveryRouter } from "./routes/deliveryRoutes";
import { authRouter } from "./routes/authRoutes";
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3300",
    exposedHeaders: ["Set-cookie"],
  })
);
app.use(express.json());
//add your routes here
app.use("/delivery", deliveryRouter);
app.use("/auth", authRouter);
export default app;
