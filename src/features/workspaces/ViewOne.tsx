import { Breadcrumb, Card } from "antd";
import Meta from "antd/es/card/Meta";
import Layout from "../../components/Layout";
import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { IWorkspace } from "../../types";

const data = [
    {
        _id: "1",
        name: "Workspace 1",
        description: "This is a sample workspace.",
        tools: {
            dataCollections: { access: 2 },
            taskLists: { access: 2 },
            docs: { access: 2 },
            messageBoard: { access: 2 },
        },
    },
    {
        _id: "2",
        name: "Workspace 2",
        description: "This is another sample workspace.",
        tools: {
            dataCollections: { access: 1 },
            taskLists: { access: 0 },
            docs: { access: 1 },
            messageBoard: { access: 0 },
        },
    },
];

const dataCollectionSet = {
    _id: "1",
    workspace: "1",
    dataCollections: [
        { _id: "1", name: "Project 1", workspace: "1" },
        { _id: "2", name: "Project 2", workspace: "1" },
    ],
};

const ViewOne = () => {
    const { id } = useParams();

    const workspace: IWorkspace = data.filter((item) => {
        return item._id === id;
    })[0];

    return (
        <Layout title={workspace.name} description="">
            <Flex
                minH={"100vh"}
                // justify={"center"}
                bg={"#f8fafc"}
            >
                <Container maxW={"6xl"} mt={8}>
                    <Breadcrumb
                        style={{ paddingBottom: "30px", fontSize: "16px" }}
                        separator=">"
                        items={[
                            {
                                title: <a href="/workspaces">Workspaces</a>,
                            },
                            {
                                title: workspace.name,
                            },
                        ]}
                    />

                    <Box pb={"20px"}></Box>

                    <SimpleGrid
                        spacing={4}
                        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    >
                        {workspace.tools.dataCollections.access > 0 ? (
                            <a
                                href={`/workspaces/${workspace._id}/dataCollections/${dataCollectionSet._id}`}
                            >
                                <Card bodyStyle={{ height: "200px" }} hoverable>
                                    <Meta title="Data Collections" />
                                </Card>
                            </a>
                        ) : null}
                        {workspace.tools.taskLists.access > 0 ? (
                            <a href={`/workspaces/${workspace._id}/tasks`}>
                                <Card bodyStyle={{ height: "200px" }} hoverable>
                                    <Meta title="Tasks" />
                                </Card>
                            </a>
                        ) : null}
                        {workspace.tools.docs.access > 0 ? (
                            <a href={`/workspaces/${workspace._id}/docs`}>
                                <Card bodyStyle={{ height: "200px" }} hoverable>
                                    <Meta title="Docs" />
                                </Card>
                            </a>
                        ) : null}
                        {workspace.tools.messageBoard.access > 0 ? (
                            <a
                                href={`/workspaces/${workspace._id}/messageBoard`}
                            >
                                <Card bodyStyle={{ height: "200px" }} hoverable>
                                    <Meta title="Message Board" />
                                </Card>
                            </a>
                        ) : null}
                    </SimpleGrid>
                </Container>
            </Flex>
        </Layout>
    );
};

export default ViewOne;
