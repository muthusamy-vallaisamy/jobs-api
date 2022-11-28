const express = require("express");
require("express-async-errors");
const { globalErrorHandler } = require("./middlewares/errorhandlermiddleware");
const { RouteNotFound } = require("./middlewares/routenotfoundmiddleware");
const authenticate = require("./middlewares/authmiddleware");
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();

//Security packages.
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.set("trust proxy", 1);
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticate, jobRouter);

app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.use(RouteNotFound);
app.use(globalErrorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.APP_PORT, () => {
      console.log(`Listening at port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
