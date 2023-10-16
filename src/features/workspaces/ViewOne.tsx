import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Container,
    Flex,
    Heading,
    SimpleGrid,
    Spacer,
    Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { IWorkspace } from "../../types";
import TopNav from "../../components/Layouts/TopNav";

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
        <Box>
            <TopNav
                breadcrumbs={
                    <Breadcrumb fontSize={"16px"} pb={{ sm: "20px" }}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/workspaces" color="#929dae">
                                Workspaces
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink href="#" color="#929dae">
                                Workspace 1
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                }
            />
            <Flex
                minH={"100vh"}
                // justify={"center"}
                bg={"#eff2f5"}
            >
                <Container maxW={"8xl"} mt={{ base: 20, sm: 10 }}>
                    <SimpleGrid
                        spacing={6}
                        // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                        columns={{ base: 1, sm: 2 }}
                        pb={"50px"}
                    >
                        <Flex>
                            <Box>
                                <Heading
                                    size={"sm"}
                                    mb={"12px"}
                                    color={"rgb(52, 71, 103)"}
                                >
                                    Workspaces
                                </Heading>
                                <Text
                                    color={"rgb(123, 128, 154)"}
                                    fontSize={"md"}
                                    fontWeight={300}
                                >
                                    Create a new workspace to manage your
                                    projects and teams.
                                </Text>
                            </Box>
                        </Flex>
                        <Flex>
                            <Spacer />
                            {/* <Box pb={"20px"}>
                            <Create addNewWorkspace={addNewWorkspace} />
                        </Box> */}
                        </Flex>
                    </SimpleGrid>
                    <SimpleGrid
                        spacing={6}
                        // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                        columns={{ base: 1, sm: 1, md: 3 }}
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
        </Box>
    );
};

export default ViewOne;
