import { Layout } from "antd";
import { ReactNode } from "react";
import { Content } from "antd/es/layout/layout";
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
