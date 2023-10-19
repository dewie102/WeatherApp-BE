const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.create_user = async (req, res) => {
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).send({
            error: "Please provide username and password to create a user",
        });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send({
            error: `username already exists: ${username}`,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    try {
        newUser = await User.create({ username, password: hashedPassword });
    } catch (error) {
        console.log(error);
        return res.send(error);
    }

    res.send({
        success: "User creation was successful",
    });
};

exports.login_user = async (req, res) => {
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).send({
            error: "Please provide username and password to login",
        });
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        return res.status(400).send({
            error: `username doesn't exists: ${username}`,
        });
    }

    const isValidLogin = await bcrypt.compare(password, existingUser.password);
    if (!isValidLogin) {
        return res.status(400).send({ error: "Invalid username/ password" });
    }

    const token = jwt.sign(
        { id: existingUser._id, username },
        process.env.JWT_KEY
    );
    res.send({ user: { id: existingUser._id, username }, token });
};
