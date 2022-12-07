import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig}/users`;
const userSubject = new BehaviorSubject(typeof window && JSON.parse(localStorage.getItem('user') || ""));

const login = (username: string, password: string) => {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        .then(user => {
            // Publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        })
}

const logout = () => {
    // Remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

const register = (user: object) => {
    return fetchWrapper.post(`${baseUrl}/register`, user);
}

const getAll = () => {
    return fetchWrapper.get(baseUrl);
}

const getById = (id: string) => {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

const update = (id: string, params: object) => {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            // Update stored user if the logged in user updated their own record
            if (id === userSubject.value.id) {
                // Update local storage
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // Publish updated user to subscribers
                userSubject.next(user);
            }

            return x;
        })
}

// Prefixed with underscore because delete is a reserved word in JS
const _delete = (id: string) => {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}

export interface userServiceProps {
    
}

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
}