## Parker Finder ##

# Backend #
Run the backend by using "npm start" command

# Frontend #
Run the frontend by using "npm start" command

<code>
export const fetchParks = (lat, lng, radius) => new Promise((resolve, reject) => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/parks`, {
        lat,
        lng,
        radius,
    }).then((response) => resolve(response))
        .catch((error) => reject(error));
});
</code>
