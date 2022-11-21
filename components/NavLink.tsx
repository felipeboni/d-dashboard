import { useRouter } from "next/router";

import { Link } from ".";

interface propTypes {
    children: string,
    href: string,
    exact: boolean,
    className: string
}

export const NavLink = ({ children, href, exact = false, ...props }: propTypes) => {
    const { pathname } = useRouter();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    if (isActive) {
        props.className += ' active';
    } 

    return <Link href={href} {...props}>{children}</Link>;
}