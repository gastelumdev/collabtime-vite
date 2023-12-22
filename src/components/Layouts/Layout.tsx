import { ReactNode, useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import Nav from "./Nav";
import { useLocation } from "react-router-dom";
import ContentSection from "./ContentSection";

interface IProps {
    title?: string;
    description?: string;
    children: ReactNode;
}

// interface IBreadcrumbItem {
//     title: any;
// }

const Layout = ({ children }: IProps) => {
    const location = useLocation();
    const pathSnippets = location.pathname.split("/").filter((i) => i);

    const [leftMargin, setLeftMargin] = useState("270px");

    const setWidth = (width: string) => {
        setLeftMargin(width);
    };

    return (
        <>
            {pathSnippets.length === 0 || pathSnippets[0] === "public" ? null : (
                <>
                    <Box padding={"14px"} bgClip={useColorModeValue("gray.50", "gray.800")}>
                        <Nav logo={"Collabtime"} firstname={"Omar"} lastname={"Gastelum"} setWidth={setWidth} />

                        {/* <Box pt={0}></Box> */}
                    </Box>
                    <ContentSection leftMargin={leftMargin}>{children}</ContentSection>
                </>
            )}
        </>
    );
};

export default Layout;
