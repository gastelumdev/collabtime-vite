import { useState } from "react";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Breadcrumb, Card } from "antd";
import Meta from "antd/es/card/Meta";
import Layout from "../../components/Layout";
import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import Create from "./Create";
import { useNavigate } from "react-router-dom";
import { IWorkspace } from "../../types";
import Edit from "./Edit";

const data = [
    {
        _id: "1",
        name: "Workspace 1",
        description: "This is a sample workspace.",
        tools: {
            dataCollections: { access: 1 },
            taskLists: { access: 1 },
            docs: { access: 1 },
            messageBoard: { access: 1 },
        },
    },
    {
        _id: "2",
        name: "Workspace 2",
        description: "This is another sample workspace.",
        tools: {
            dataCollections: { access: 2 },
            taskLists: { access: 0 },
            docs: { access: 2 },
            messageBoard: { access: 0 },
        },
    },
];

const View = () => {
    const [workspaces, setWorkspaces] = useState(data);
    const navigate = useNavigate();

    const del = (id: string) => {
        let newData = workspaces.filter((item) => {
            return item._id !== id;
        });

        setWorkspaces(newData);
    };

    const openWorkspace = (_id: string) => {
        console.log(_id);
        navigate(`/workspaces/${_id}`);
    };

    const addNewWorkspace = (workspace: IWorkspace) => {
        setWorkspaces([...workspaces, workspace]);
    };

    const updateWorkspace = (workspace: IWorkspace) => {
        const oldData = workspaces.filter((item) => {
            return workspace._id !== item._id;
        });

        setWorkspaces([...oldData, workspace]);
    };

    return (
        <Layout title={"Workspaces"} description="Manage your workspaces!">
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
                                title: "Workspaces",
                            },
                        ]}
                    />

                    <Box pb={"20px"}>
                        <Create addNewWorkspace={addNewWorkspace} />
                    </Box>

                    <SimpleGrid
                        spacing={2}
                        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    >
                        {workspaces.map((workspace, index) => {
                            return (
                                <Card
                                    key={index}
                                    bodyStyle={{ height: "150px" }}
                                    actions={[
                                        <EyeOutlined
                                            key="eye"
                                            onClick={() =>
                                                openWorkspace(workspace._id)
                                            }
                                        />,
                                        // <EditOutlined key="edit" />,
                                        <Edit
                                            workspace={workspace}
                                            updateWorkspace={updateWorkspace}
                                        />,
                                        <DeleteOutlined
                                            key="delete"
                                            onClick={() => del(workspace._id)}
                                        />,
                                    ]}
                                >
                                    <Meta
                                        title={workspace.name}
                                        description={workspace.description}
                                    />
                                </Card>
                            );
                        })}
                    </SimpleGrid>
                </Container>
            </Flex>
        </Layout>
    );
};

export default View;
