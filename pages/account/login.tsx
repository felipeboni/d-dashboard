import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';
import { URL } from 'url';

export const Login = () => {
    const router = useRouter();

    // Form validation rules
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    })
    const formOptions = { resolver: yupResolver(validationSchema) };

    // Get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = ({ username, password }: { [key: string]: string; }) => {
        return userService.login(username, password)
            .then(() => {
                // Get return URL from query parameters or default to '/'
                const returnUrl = new URL(String(router.query.returnUrl) || '/');
                router.push(returnUrl);
            })
            .catch(alertService.error)

    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{ String(errors.username?.message) }</div>
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{ String(errors.password?.message) }</div>
                        </div>
                        
                        <button className="btn btn-primary">
                            { formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span> }
                            Login
                        </button>

                        <Link href="/account/register" className="btn btn-link">Register</Link>
                    </form>
                </div>
            </div>
        </Layout>
    )
}