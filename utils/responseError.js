const responseError = (error, response, errorMessage) => {
    if(error) return response.status(500).send(errorMessage)
}

module.exports = responseError;