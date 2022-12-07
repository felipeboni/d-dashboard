import { useState, useEffect } from 'react';

import { Layout, AddEdit } from 'components/users';
import { Spinner } from 'components';
import { userService, alertService } from 'services';

const Edit = ({ id }: { id: string }) => {
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        // Fetch user and set default form values if in edit mode
        userService.getById(id)
            .then((x: string) => setUser(x))
            .catch(alertService.error)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <h1>Edit User</h1>
            { user ? <AddEdit user={user} /> : <Spinner/> }
        </Layout>
    )
}

export const getServerSideProps = async ({ params }: { [props: string]: { [id: string]: number } }) => {
    return {
        props: { id: params.id }
    }
}