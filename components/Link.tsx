import NextLink from 'next/link';

type LinkTypes = {
    href: string,
    children: string,
    [ x:string ]: any
}

export const Link = ({ href, children, ...props }: LinkTypes) => {
    return (
        <NextLink href={href}>
            <a {...props}>
                {children}
            </a>
        </NextLink>
    );
}