import { Save } from "react-feather";

const fs = require('fs');

// Users in JSON file for simplicity, store in a db for prod app
let users = require('data/users.json');

interface userProps {
    id: number,
    dateCreated: string,
    dateUpdated: string
}

const create = (user: userProps) => {
    // Generate user id
    user.id = users.length ? Math.max(...users.map((x: userProps) => x.id)) + 1 : 1;

    // Set date created and updated
    user.dateCreated = new Date().toISOString();
    user.dateUpdated = new Date().toISOString();

    // Add and save user
    users.push(user);
    save();
}

const update = ( id: userProps, params: object ) => {
    const user = users.find((x: userProps) => x.id.toString() === id.toString());

    // Set date updated
    user.dateUpdated = new Date().toISOString();

    // Update and save
    Object.assign(user, params);
    save();
}

// Prefixed with underscore `_` because 'delete' is a reserved word in JS
const _delete = (id: userProps) => {

    // Filter out deleted user and save
    users = users.filter((x: userProps) => x.id.toString() !== id.toString());
    save();
}

// Private helper function
const save = () => {
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));
}

export const usersRepo = {
    getAll: () => users,
    getById: (id: userProps) => users.find((x: userProps) => x.id.toString() === id.toString()),
    find: (x: userProps) => users.find(x),
    create,
    update,
    delete: _delete
}