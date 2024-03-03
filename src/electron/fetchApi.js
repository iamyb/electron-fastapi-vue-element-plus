// api.js

// Helper functions for making HTTP requests
// export const fetchWrapper = {
//     get,
//     post,
//     put,
//     delete: _delete, // Note: "delete" is a reserved word in JavaScript
// };

const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete, // Note: "delete" is a reserved word in JavaScript
};

module.exports = {
    fetchWrapper
}

// GET request
async function get(url) {
    const requestOptions = {
        method: 'GET',
    };
    return await fetch(url, requestOptions);
}

// POST request
async function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
    return await fetch(url, requestOptions);
}

// PUT request
async function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
    return await fetch(url, requestOptions);
}

// DELETE request
async function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
    };
    return await fetch(url, requestOptions);
}

// // Helper function to handle response
// function handleResponse(response) {
//     return response.text().then((text) => {
//         const data = text && JSON.parse(text);
//         if (!response.ok) {
//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }
//         return data;
//     });
// }
