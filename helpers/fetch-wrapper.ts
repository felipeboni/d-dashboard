import { request } from 'http';
import getConfig from 'next/config';
import { userService } from 'services';

const { publicRuntimeConfig } = getConfig();

const get = async (url: string) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: [authHeader(url)]
    };

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

const post = async (url: string, body: object) => {
    const requestOptions: RequestInit = {
        method: "POST",
        headers: [["Content-Type", "application/json"], authHeader(url)],
        credentials: "include",
        body: JSON.stringify(body)
    }

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

const put = async (url: string, body: object) => {
    const requestOptions: RequestInit = {
        method: "PUT",
        headers: [["Content-Type", "application/json"], authHeader(url)],
        body: JSON.stringify(body)
    }

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

// Prefixed with underscore because delete is a reserved word in JS
const _delete = async (url: string) => {
    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: [authHeader(url)]
    }

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

// Helper function //---------------------------------------------

const authHeader = (url: string) => {
    // Return auth header with JWT if user is logged in and request it to the API url
    const user = userService.userValue;
    const isLoggedIn = user?.token;
    const isApiUrl = url.startsWith(publicRuntimeConfig?.apiUrl);

    if (isLoggedIn && isApiUrl) {
        return ["Authorization", `Bearer ${user.token}`];
    }

    return [];
}

const handleResponse = (response: Response) => {
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

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
}