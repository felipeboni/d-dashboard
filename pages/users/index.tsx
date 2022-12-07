import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/users';
import { userService } from 'services';

export const Index = () => {
    const [ users, setUsers ] = useState({});

    useEffect(() => {
        userService.getAll().then(x => setUsers(x));
    }, []);

    const deleteUser = (id) => {
        setUsers(users.map(x => {
            if (x.id === id) x.isDeleting = true
        }));

        userService.delete(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        })
    }
}