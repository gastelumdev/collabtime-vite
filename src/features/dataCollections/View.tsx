import { useState } from "react";
import { Breadcrumb, ConfigProvider, Space, Tag } from "antd";
import Layout from "../../components/Layout";
import {
    Box,
    Container,
    Flex,
    useColorModeValue,
    Text,
} from "@chakra-ui/react";
// import Create from "./Create";
import { useParams } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const columns: ColumnsType<DataType> = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "100px",
        render: (text) => <a>{text}</a>,
    },
    {
        title: "Age",
        dataIndex: "age",
        key: "age",
        width: "100px",
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
        width: "200px",
    },
    {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        width: "200px",
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? "geekblue" : "green";
                    if (tag === "loser") {
                        color = "volcano";
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
    },
    {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
        tags: ["cool", "teacher"],
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

const View = () => {
    const { id } = useParams();
    const [dataCollections] = useState(dataCollectionSet.dataCollections);

    // const del = (id: string) => {
    //     let newData = dataCollections.filter((item) => {
    //         return item._id !== id;
    //     });

    //     setDataCollections(newData);
    // };

    return (
        <Layout
            title={"Data Collections"}
            description="Manage your Data Collections!"
        >
            <Flex
                minH={"100vh"}
                // justify={"center"}
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Container maxW={"10xl"} mt={12}>
                    <Breadcrumb
                        style={{ paddingBottom: "30px", fontSize: "16px" }}
                        items={[
                            {
                                title: <a href="/workspaces">Workspaces</a>,
                            },
                            {
                                title: (
                                    <a href={`/workspaces/${id}`}>
                                        Workspace 1
                                    </a>
                                ),
                            },
                            {
                                title: "Data Collections",
                            },
                        ]}
                    />

                    <Box pb={"20px"}>
                        {/* <Create
                        workspaces={workspaces}
                        setWorkspaces={setWorkspaces}
                    /> */}
                    </Box>
                    {dataCollections.map((dataCollection, index) => {
                        return (
                            <div key={index} style={{ marginBottom: "30px" }}>
                                <Text fontSize="3x1" mb={"5px"}>
                                    {dataCollection.name}
                                </Text>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Table: {
                                                // headerBg: "gray",
                                            },
                                        },
                                    }}
                                >
                                    <Table
                                        columns={columns}
                                        dataSource={data}
                                        bordered
                                        size={"small"}
                                    />
                                </ConfigProvider>
                            </div>
                        );
                    })}
                </Container>
            </Flex>
        </Layout>
    );
};

export default View;
