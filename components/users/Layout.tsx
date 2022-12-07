import { ReactNode } from "react";

export interface LayoutProps  { 
    children: ReactNode
 }

export const Layout = ( Props: LayoutProps ) => {
    return (
    <div>
        <div>
            { Props.children }
        </div>
    </div>
    )
}