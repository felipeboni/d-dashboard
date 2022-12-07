import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';

export const Register = () => {
    const router = useRouter();

    // Form validation rules using Yup
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        username: Yup.string().required("Username is required"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
    });

    // Get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm({resolver: yupResolver(validationSchema)});
    const { errors } = formState;

    const onSubmit = (user: object) => {
        return userService.register(user)
            .then(() => {
                alertService.success("Registration successful", { keepAfterRouteChange: true });
                router.push("login");
            })
            .catch(alertService.error);
    }

    return (
        <Layout>
            <div className="card">
                <div className="card-header">Register</div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{ String(errors.firstName?.message) }</div>
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{ String(errors.lastName?.message) }</div>
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{ String(errors.username?.message) }</div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{ String(errors.password?.message) }</div>
                        </div>

                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Register
                        </button>

                        <Link href="/account/login" className="btn btn-link">Cancel</Link>

                    </form>
                </div>
            </div>
        </Layout>
    )
}