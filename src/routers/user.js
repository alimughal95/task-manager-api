const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const router = new express.Router();

////********************************Creating USER******************** */

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  //////********** ASYNC/AWAIT METHOD */
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }

  //////************PROMISE  CHAINING*/
  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).send(user);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //     //   res.send(e);
  //   });
  //   console.log(req.body);
  //   res.send("testing!");
});

///*****************************READING USER**************** */

//************ */ 1. (FINDING ALL USERS)***************/
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);

  ///////viewing everyone's data
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send();
  // }
  //   User.find({})
  //     .then((users) => {
  //       res.send(users);
  //     })
  //     .catch((error) => {
  //       res.status(500).send();
  //     });
});

///***************************** */

////******************LOGGING IN */

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

///////////***************LOGGING OUT (SINGLE USER)************/

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

///************************LOGGING OUT ALL USERS *******************/

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

////****************************UPDATING USER******************************** */

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body); //Error handling for updating an invalid property
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operation!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//////***************************DELETE USER ********/

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  //destination directory (multer middleware)

  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid picture!"));
    }
    cb(undefined, true);

    // cb(new Error('File must be a PDF'))
    // cb(undefined, true)
    // cb(undefined, false)
  },
});

//////
////////// AVATAR ROUTES
/////

//route to set avatar to DB
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//route to delete an avatar

router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  }
  // (error, req, res, next) => {
  //   res.status(400).send({ error: error.message });
  // }
);

// // router to get the picture from the db

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
