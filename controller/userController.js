import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { makeHash } from "../utility/hash.js";
import { validate } from "../utility/validate.js";
import { makeToken, verifyToken } from "../utility/jwt.js";
import cookieParser from "cookie-parser";
import { accountActivationMail } from "../utility/mail.js";

//show profile page

export const profilePage = (req, res) => {
  res.render("profile");
};
//show profile page

export const loginPage = (req, res) => {
  res.render("login");
};
//show profile page

export const registrePage = (req, res) => {
  res.render("register");
};
//register user

export const registreUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      validate("All fields are required!", "/register", req, res);
    } else {
      const emailCheck = await User.findOne().where("email").equals(email);
      if (emailCheck) {
        validate("Email already exist", "/login", req, res);
      } else {
        const user = await User.create({
          name,
          email,
          password: makeHash(password),
        });
        const token = makeToken({ id: user._id }, 1000 * 60 * 60 * 24 * 3);
        const link = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;
        accountActivationMail(email, {
          name: name,
          link: link,
        });
        validate("register user successful", "/login", req, res);
      }
    }
  } catch (error) {
    validate(error.message, "/register", req, res);
  }
};

//login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      validate("All fields are required!", "/login", req, res);
    } else {
      const loginUser = await User.find().where("email").equals(email);
      if (!loginUser[0]) {
        validate("User not found", "/login", req, res);
      } else {
        if (!loginUser[0].isActivated) {
          validate("Please activate your account", "/login", req, res);
        } else {
          const usePass = bcrypt.compareSync(password, loginUser[0].password);
          if (!usePass) {
            validate("Wrong password", "/login", req, res);
          } else {
            const token = makeToken(
              { id: loginUser[0]._id },
              1000 * 60 * 60 * 24 * 365
            );

            req.session.user = loginUser[0];
            res.cookie("authtoken", token);
            validate("Login successful", "/", req, res);
          }
        }
      }
    }
  } catch (error) {
    validate(error.message, "/login", req, res);
  }
};

//logout user

export const logOutUser = (req, res) => {
  delete req.session.user;
  res.clearCookie("authtoken");
  validate("Logout successful", "/login", req, res);
};

//userController activation
export const userAccountActivation = async (req, res) => {
  try {
    const { token } = req.params;
    const tokenVerify = verifyToken(token);
    if (!tokenVerify) {
      validate("Token is invalid", "/login", req, res);
    } else {
      const usercheck = await User.findById(tokenVerify.id);

      if (usercheck.isActivated) {
        validate("Already activated");
      } else {
        await User.findByIdAndUpdate(tokenVerify.id, {
          isActivated: true,
        });
        validate("Account verification successful", "/login", req, res);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * Update Profile photo
 */

export const profilePhotPage = (req, res) => {
  res.render("photo");
};

/**
 * change password
 */
export const changePassword = (req, res) => {
  res.render("password");
};

/**
 * edit page
 */

export const editPage = (req, res) => {
  res.render("edit");
};

/**
 * photo upload
 */

export const profilePhotUpload = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.user._id, {
      photo: req.file.filename,
    });
    req.session.user.photo = req.file.filename;
    validate("Profile photo upload success", "/photo-update", req, res);
  } catch (error) {
    validate(error.message, "/login", req, res);
  }
};
/**
 * gallery photo page
 */

export const profilegalleryPage = (req, res) => {
  res.render("gallery");
};

/**
 * gallery photo upload
 */

export const gellaryPhotUpload = async (req, res) => {
  try {
    let file_arr = [];
    req.files.forEach((item) => {
      file_arr.push(item.filename);
      req.session.user.gallery.push(item.filename);
    });
    //data push
    await User.findByIdAndUpdate(req.session.user._id, {
      $push: {
        gallery: { $each: file_arr },
      },
    });
    validate("Gallery photo upload successful", "/gallery-update", req, res);
  } catch (error) {
    validate(error.message, "/gallery-update", req, res);
  }
};

/**
 * find Friend page
 */

export const findFriendsPage = async (req, res) => {
  try {
    const friends = await User.find().where("email").ne(req.session.user.email);

    res.render("friends", {
      friends,
    });
  } catch (error) {
    console.log(error.message);
  }
};

//show single user profile
export const userProfileData = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await User.findById(id);

    res.render("single", {
      profile,
    });
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * follower controller
 */

export const followuser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user.isActivated == false) {
      validate("User account is deactivated", "/find-friends", req, res);
    } else {
      await User.findByIdAndUpdate(req.session.user._id, {
        $push: {
          following: id,
        },
      });
      await User.findByIdAndUpdate(id, {
        $push: {
          follower: req.session.user._id,
        },
      });
      req.session.user.following.push(id)
      validate("Following user sucessful", "/find-friends", req, res);
    }
  } catch (error) {
    console.log(error.message);
  }
};


/**
 * unfollow user
 */
 export const unfollowuser = async (req , res) => {
     
      try {
        const  {id} = req.params
        await User.findByIdAndUpdate(req.session.user._id , {
          $pull : {
             following : id
          }
        })
        await User.findByIdAndUpdate(id , {
          $pull : {
             following : req.session.user._id
          }
        })
             
           let updated_list =  req.session.user.following.filter(data => data != id)
            req.session.user.following = updated_list
            validate('Unfollow successfull' , '/find-friends' ,req , res)
      } catch (error) {
        console.log(error.message);
      }
      

 }
