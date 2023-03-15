import axios from 'axios';

// const axiosService = axios.create({
//     baseURL: 'https://',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     timeout: 10000,
// });

/**
 * Simple GET Request.
 * @param url addition to the base domain url to send the getRequest to.
 * @returns server's response object if response.ok, else returns void.
 * Response.ok: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
 */
export const httpsGet = async (url: string): Promise<void | object | any>=> {
    return axios.get(`https://${url}`)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            console.error("Error in httpGet: ", error);
            console.error("Error code: ", error.code ? error.code : "undefined");
            console.error("httpGet: error.response.status", error.response?.status ? error.response.status : "undefined");
            console.error("httpGet: error.response.statusText", error.response?.statusText ? error.response.statusText : "undefined");
            throw error;
        });
}

/**
 * Simple POST Request.
 * @param url The url to send the post request to.
 * @param payload The data to send to the server.
 * @returns server's response object if response.ok, else returns void.
 */
export const httpsPost = async (url: string, payload: any, apiKey?: string): Promise<void | object | any>=> {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    return axios.post(`https://${url}`, payload, { headers })
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            console.error("Error in httpPost: ", error);
            console.error("Error code: ", error.code);
            console.error("httpPost: error.response.status: ", error.response.status);
            console.error("httpPost: error.response.statusText: ", error.response.statusText);
            throw error;
        });
}