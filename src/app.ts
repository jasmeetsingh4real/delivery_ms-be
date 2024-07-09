import * as express from "express";
import { deliveryRouter } from "./routes/deliveryRoutes";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3300",
    exposedHeaders: ["Set-cookie"],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//add your routes here
app.use("/delivery", deliveryRouter);
export default app;
