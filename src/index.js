const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
// const express = require("express");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 2000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please upload a Word Document!"));
//     }
//     cb(undefined, true);

//     // cb(new Error('File must be a PDF'))
//     // cb(undefined, true)
//     // cb(undefined, false)
//   },
// });

// // const errorMiddleware = (req, res, next) => {
// //   throw new Error("From my middleware");
// // };

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// // const pet = {   Example for toJSON function
// //   name: "hal",
// // };

// // // pet.toJSON = function () {
// //   console.log(this);
// //   return this;
// // };

// // console.log(JSON.stringify(pet));

// // const jwt = require("jsonwebtoken");   // Example to get jet

// // const myFunction = async () => {
// //   const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse", {
// //     expiresIn: "7 days",
// //   });
// //   console.log(token);

// //   const data = jwt.verify(token, "thisismynewcourse");
// //   console.log(data);
// // };

// // myFunction();

// // const task = require("./models/task");

// // const main = async () => {
// //   // const task = await Task.findById("5f2f57655e713b52100b9800");
// //   // await task.populate("owner").execPopulate();
// //   // console.log(task.owner);

// //   const user = await User.findById("5f2f512f2a5b024180f526bd");
// //   await user.populate("tasks").execPopulate();
// //   console.log(user.tasks);
// // };

// // main();
