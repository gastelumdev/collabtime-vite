import { Layout } from "antd";
import React, { ReactNode } from "react";
import TopNav from "./TopNav";
import { Content } from "antd/es/layout/layout";
import { Box } from "@chakra-ui/react";

interface ContentSectionProps {
    leftMargin: string;
    children: ReactNode;
}

const ContentSection = ({ leftMargin, children }: ContentSectionProps) => {
    return (
        <Layout style={{ marginLeft: leftMargin }}>
            <Content style={{ backgroundColor: "#eff2f5" }}>{children}</Content>
        </Layout>
    );
};

export default ContentSection;
