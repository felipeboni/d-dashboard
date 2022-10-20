import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { userService } from 'services';

export interface LayoutProps {
    children: string;
}

export const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();

    useEffect(() => {
        if (userService.userValue) {
            router.push('/');
        }
    }, [])

    return (
        <div className="">
            { children }
        </div>
    )
}