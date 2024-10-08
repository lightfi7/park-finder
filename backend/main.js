const express = require('express');
const cors = require('cors');
const axios = require("axios");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/parks', async (req, res) => {
    const { lat, lng, radius } = req.body;
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius: radius,
                type: 'park',
                key: process.env.GOOGLE_API_KEY
            }
        }
        );
        if (response.data.status === 'OK') {
            res.status(200).send(response.data.results);
        } else {
            res.status(404).send('No parks found within the given radius');
        }
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})