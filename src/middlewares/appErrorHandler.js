import response from "../libs/responseLib";

let errorHandler = (err, req, res, next) => {
    console.log("application error handler called");
    console.log(err);

    let apiResponse = response.generate(true, 'Unhandled error occured', 400, null)
    res.status(apiResponse.status).send()

}// end request ip logger function 

let notFoundHandler = (req, res, next) => {

    console.log("Global not found handler called");
    let apiResponse;
    if (req.method == 'PATCH') {
        apiResponse = response.generate(true, 'Method not allowed', 405, null)
    } else {
        apiResponse = response.generate(true, 'Route not found in the application', 404, null)
    }
    res.status(apiResponse.status).send(apiResponse)

}// end not found handler

export default {
    globalErrorHandler: errorHandler,
    globalNotFoundHandler: notFoundHandler
}
