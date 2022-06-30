const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

//login
router.post("/login", async (req, res) => {
    // console.log(req.body);
    try {
        const user = await User.findOne({
            email: req?.body?.email,
        });
        // console.log(user);
        !user &&
            res.status(500).json({
                status: 1,
                error: "Wrong User/Password!",
            });
        const hashedPassword = CryptoJS.AES.decrypt(
            user?.password,
            process?.env?.PASS_SEC
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req?.body?.password;
        originalPassword !== inputPassword &&
            res.status(500).json({
                status: 1,
                error: "Wrong User/Password!",
            });
        const accessToken = await jwt.sign(
            {
                id: user?._id,
                user_name: user?.user_name,
                user_email: user?.email,
            },
            process?.env?.JWT_SEC,
            { expiresIn: "1d" }
        );
        const { password, updatedAt, __v, createdAt, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        console.log("login error => ", err);
        res.status(500).json({
            status: 0,
            res: err,
            error: "There was a server side error!",
        });
    }
});

// customer register
router.post("/registration", async (req, res) => {
    console.log(req.body);
    try {
        const newUser = new User({
            user_name: req.body.user_name,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SECRET
            ).toString(),
        });
        const registered = await newUser.save();
        // console.log(registered);
        const accessToken = await jwt.sign(
            {
                id: registered?._id,
                user_name: registered?.user_name,
                user_email: registered?.email,
            },
            process?.env?.JWT_SEC,
            { expiresIn: "1d" }
        );
        const { password, updatedAt, __v, createdAt, ...others } =
            registered._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        console.log("register error => ", err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
