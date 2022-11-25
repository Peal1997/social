import mongoose from "mongoose";
import express from "express";
import path, { resolve } from "path";

import {
  loginPage,
  profilePage,
  registrePage,
  registreUser,
  loginUser,
  logOutUser,
  userAccountActivation,
  profilePhotPage,
  changePassword,
  editPage,
  profilePhotUpload,
  profilegalleryPage,
  gellaryPhotUpload,
  findFriendsPage,
  userProfileData,
  followuser,
  unfollowuser
} from "../controller/userController.js";
import { redirectMiddleWare } from "../middleware/redirectMiddleWare.js";
import { guestMiddleWare } from "../middleware/guestMiddleWare.js";
import multer from "multer";

//router
const router = express.Router();
const __dirname = resolve();

//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname == "gallery") {
      cb(null, path.join(__dirname, "/public/media/gallery"));
    }

    if (file.fieldname == "photo") {
      cb(null, path.join(__dirname, "/public/media/users"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

//create nultermiddle
const profilePhotoMulter = multer({
  storage,
}).single("photo");

//create nultermiddle
const gellaryPhotoMulter = multer({
  storage,
}).array("gallery", 10);

//routing
router.get("/", redirectMiddleWare, profilePage);
router.get("/photo-update", redirectMiddleWare, profilePhotPage);
router.post("/photo-update", profilePhotoMulter, profilePhotUpload);
router.get("/password-change", redirectMiddleWare, changePassword);
router.get("/profile-change", redirectMiddleWare, editPage);

//login register
router.get("/login", guestMiddleWare, loginPage);
router.get("/register", guestMiddleWare, registrePage);

//gelerrary update
router.get("/gallery-update", redirectMiddleWare, profilegalleryPage);
router.post("/gallery-update", gellaryPhotoMulter, gellaryPhotUpload);

//user router
router.post("/register", registreUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/activate/:token", userAccountActivation);
//follow routers

router.get("/find-friends", redirectMiddleWare, findFriendsPage);
//follow routers
router.get("/follow/:id", redirectMiddleWare, followuser);
router.get("/unfollow/:id", redirectMiddleWare, unfollowuser);

router.get("/:id", redirectMiddleWare, userProfileData);
//export

export default router;
