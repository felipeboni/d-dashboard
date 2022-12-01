import { request } from 'http';
import getConfig from 'next/config';
import { userService } from 'services';

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
}

const get = (url: string) => {
    const requestOptions = {
        method: "GET",
        headers: authHeader(url)
    };

    return fetch(url, requestOptions).then(handleResponse);
}

const post = (url: string, body) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader(url) },
        credentials: "include",
        body: JSON.stringify(body)
    }

    return fetch(url, requestOptions).then(handleResponse);
}

const put = (url: string, body) => {
    const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader(url) },
        body: JSON.stringify(body)
    }

    return fetch(url, requestOptions).then(handleResponse);
}

// Prefixed with underscore because delete is a reserved word in JS
const _delete = (url: string) => {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader(url)
    }

    return fetch(url, requestOptions).then(handleResponse);
}

// Helper function //---------------------------------------------

const authHeader = (url: string) => {
    // Return auth header with JWT if user is logged in and request it to the API url
    const user = userService.userValue;
    const isLoggedIn = user?.token;
    const isApiUrl = url.startsWith(publicRuntimeConfig?.apiUrl);

    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    }

    return {};
}

const handleResponse = (response) => {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && userService.userValue) {
                // Auto logout if 401 Unauthorized or 403 Forbbiden response returned from API
                userService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
    })
}