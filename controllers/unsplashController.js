const unsplashURLBase = "https://api.unsplash.com";

exports.get_photo_for_location = async (req, res) => {
    const { location } = req.query;

    console.log(location);

    const response = await fetch(
        `${unsplashURLBase}/search/photos?` +
            `client_id=${process.env.UNSPLASH_API}&` +
            `query=${location}`
    );

    const content = await response.json();

    if (Object.hasOwn(content, "errors")) {
        return res.status(404).send(content);
    }

    const results = content.results;
    const photoURL = getRandomImageFromArray(results);
    if (!photoURL && results.length > 0) {
        return res.status(400).send({
            error: "Something went wrong with getting a random photo",
        });
    }

    return res.send({ url: photoURL });
};

function getRandomImageFromArray(array) {
    let url;
    for (let count = 0; count < 5; count++) {
        let randomIndex = Math.floor(Math.random() * array.length - 1);
        url = array[randomIndex]?.urls?.small;
        if (url) {
            break;
        }
    }
    return url;
}
