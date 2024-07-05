import * as express from "express";
import { deliveryRouter } from "./routes/deliveryRoutes";
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//add your routes here
app.use("/delivery", deliveryRouter);
export default app;
