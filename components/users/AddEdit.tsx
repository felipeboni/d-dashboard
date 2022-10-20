import { useRouter } from 'next/router';
import { useForm, UseFormProps } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

interface AddEditProps {
    user?: {
        id: number
    }
}

export const AddEdit = (props: AddEditProps) => {
    const user = props?.user;
    const isAddMode = !user;
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First name is required'),
        lastName: Yup.string()
            .required('Last name is required'),
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Password is required') : Yup.string())
            .min(6, 'Password must be at least 6 characters')
    })

    const formOptions: UseFormProps = { resolver: yupResolver(validationSchema) };

    // Set default form values if in edit modereact nu
    !isAddMode ? formOptions.defaultValues = props.user : null;

    // Get function to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        return userService.register(data)
        .then(() => {
            alertService.success('User Added', { keepAfterRouteChange: true });
            router.push('/');
        })
        .catch(alertService.error);
    }
}