const identifyRoute = (req, res, next) => {
    // if (req.method !== 'GET') {
    //     return res.status(405).setHeader('cache-control', 'no-cache').send();
    // }
    next();
}

export default identifyRoute;