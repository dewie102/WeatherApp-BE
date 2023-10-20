const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const unsplashURLBase = "https://api.unsplash.com";

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

exports.add_favorite_to_user = async (req, res) => {
    const { id, name, lat, lon } = req.body;

    if (!name && !lat && !lon) {
        return res
            .status(400)
            .send({ error: "Missing name, lat or lon from request" });
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(400).send({ error: "Invalid username ID" });
    }

    if (user.favorites.some((e) => e.lat == lat && e.lon == lon)) {
        return res.send({ error: "User already has location in favorites" });
    }

    user.favorites.push({ locationName: name, lat, lon });
    user.save();

    res.send({ message: `Updated users favorites`, user });
};

exports.get_user_favorites = async (req, res) => {
    const { id } = req.query;

    const user = await User.findById(id);
    if (!user) {
        return res.status(400).send({ error: "Invalid username ID" });
    }

    res.send({ favorites: user.favorites });
};

exports.delete_favorite_from_user = async (req, res) => {
    const { id, name } = req.body;

    const user = await User.findById(id);
    if (!user) {
        return res.status(400).send({ error: "Invalid username ID" });
    }

    const index = user.favorites.findIndex((e) => e.locationName === name);
    user.favorites.splice(index, 1);
    user.save();

    res.send({ message: "Deleted favorite" });
};

exports.get_photo_for_location = async (req, res) => {
    const { location } = req.query;

    const response = await fetch(
        `${unsplashURLBase}/search/photos?` +
            `client_id=${process.env.UNSPLASH_API}&` +
            `query=${location}`
    );

    const content = await response.json();
    const results = content.results;
    const photoURL = getRandomImageFromArray(results);
    if (!photoURL) {
        return res
            .status(400)
            .send({ error: "Something went wrong with getting a photo" });
    }

    return res.send({ url: photoURL });
};

exports.is_valid_token = async (req, res, next) => {
    let token;
    if (Object.hasOwn(req.body, "token")) {
        token = req.body.token;
    } else if (Object.hasOwn(req.query, "token")) {
        token = req.query.token;
    } else {
        return res.status(400).send({ error: "Token not provided" });
    }

    try {
        const userInfo = await jwt.verify(token, process.env.JWT_KEY);
        console.log(userInfo);
    } catch (error) {
        return res.status(400).send({ error: "Invalid token" });
    }

    next();
};

function getRandomImageFromArray(array) {
    let randomIndex = Math.floor(Math.random() * array.length - 1);
    return array[randomIndex]?.urls?.small;
}
