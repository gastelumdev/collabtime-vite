import { ReactNode } from "react";
import PageHeading from "./PageHeading";
import { Box } from "@chakra-ui/react";

interface IProps {
    title?: string;
    description?: string;
    children: ReactNode;
}

// interface IBreadcrumbItem {
//     title: any;
// }

const Layout = ({ title, children }: IProps) => {
    return (
        <>
            <PageHeading title={title} description={""} />

            <Box pt={0}>{children}</Box>
        </>
    );
};

export default Layout;
