import express from "express";
import createError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import photosRouter from "./routes/photos.js";
import couleursRouter from "./routes/couleurs.js";

import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

import mongoose from "mongoose";

mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1/coloryou');

// mongoose.connect(process.env.DATABASE_URL || 'mongodb://127.0.0.1/coloryou');

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/photos", photosRouter);
app.use("/couleurs", couleursRouter);

// Parse the OpenAPI document.
const openApiDocument = yaml.load(fs.readFileSync('./openapi.yaml'));
// Serve the Swagger UI documentation.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;