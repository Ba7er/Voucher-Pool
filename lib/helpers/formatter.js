const prepareResponse = ({ success = false, data }) => {
    let responseBody = {
        result: success,
    };

    if (data) {
        responseBody = {
            ...responseBody,
            data,
        };
    } else if (success && !data) {
        responseBody = {
            ...responseBody,
            data: {},
        };
    }

    return responseBody;
};

const handleError = ({ err }) => {
    const responseBody = {
        result: false,
    };
    let responseCode = 500;

    if (err) {
        if (err.isBoom) {
            const { statusCode } = err.output;

            let payload;
            // To handle outbound calls HTTP errors
            if (err.data && err.data.isResponseError) {
                try {
                    const res = JSON.parse(err.data.payload.toString());
                    // To handle CIAM outbound calls HTTP errors
                    if (res.error) {
                        payload = {
                            error: res.error.code || res.error,
                            message: res.message || res.error_description,
                        };
                    }
                } catch (error) {
                    // Silent
                }
            }
            if (!payload) {
                payload = err.output.payload;
            }

            const { error, message } = payload;
            let trace;
            if (!err.isServer) {
                responseCode = statusCode;
            } else if (err.stack) {
                trace = err.stack;
            }
            responseBody.error = {
                code: error,
                message,
                statusCode,
                trace,
            };

            // JSON stringify error_desciption errors
            try {
                const parsed = JSON.parse(message);
                if (parsed.error) {
                    responseBody.error.code = parsed.error || parsed.error.code || err.name;
                    responseBody.error.message = parsed.error_description || parsed.error.message || err.message;
                    if (parsed.status_code) {
                        responseCode = parsed.status_code;
                        responseBody.error.statusCode = err.code;
                    }
                }
            } catch (e) {
                // Silent
            }
        }
    }
    return {
        responseBody,
        responseCode,
    };
};
module.exports = {
    prepareResponse,
    handleError,
};
