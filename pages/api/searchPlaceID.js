export default async function handler(req, res) {
    const placeID = JSON.parse(req.body);
    return new Promise((resolve) =>{
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`)
        .then(async(response)=>{
            const data = await response.json();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'max-age=180000');
            res.end(JSON.stringify(data));
            resolve();
        })
    })
}