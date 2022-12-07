import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

interface AddEditProps {
    user?: {
        id: number
    }
}

export interface UserProps {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
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

    const formOptions = {
        resolver: yupResolver(validationSchema),
        defaultValues: !isAddMode ? props.user : {}
    }

    // Get function to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm<UserProps>(formOptions);
    const { errors } = formState;

    const onSubmit: SubmitHandler<UserProps> =
        data => isAddMode ? createUser(data) : updateUser(user.id, data);


    function createUser(data: UserProps) {
        return userService.register(data)
            .then(() => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('/');
            })
            .catch(alertService.error);
    }

    function updateUser(id: string, data: UserProps) {
        return userService.update(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">

                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" type="text" {...register('lastName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>

            </div>

            <div className="form-row">

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password {!isAddMode && <em>(Leave blank to keep the same password)</em>}</label>
                    <input id="password" type="text" {...register('password')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>

            </div>

            <div className="form-group">
                <button type="submit" disabled={ formState.isSubmitting }>
                     { formState.isSubmitting && <span></span> }
                    Save
                </button>

                <button
                    type="button"
                    onClick={ () => reset(formOptions.defaultValues) }
                    disabled={ formState.isSubmitting }>
                        Reset
                </button>
                
                <Link href="users">Cancel</Link>
            </div>
        </form>
    )
}