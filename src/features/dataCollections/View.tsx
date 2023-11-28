import {
    useGetDataCollectionsQuery,
    useCreateDataCollecionMutation,
    useDeleteDataCollectionMutation,
    useUpdateDataCollectionMutation,
    useGetUserQuery,
} from "../../app/services/api";

import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    Container,
    Flex,
    Heading,
    SimpleGrid,
    Spacer,
    Text,
} from "@chakra-ui/react";
import SideBarLayout from "../../components/Layouts/SideBarLayout";

import { BsFiletypeDoc, BsPersonWorkspace } from "react-icons/bs";
import { IconContext, IconType } from "react-icons";
import { AiOutlineDelete, AiOutlineMessage } from "react-icons/ai";
import Divider from "../../components/Divider/Divider";
import { BiTable } from "react-icons/bi";
import Edit from "./Edit";
import Create from "./Create";
import { FaTasks } from "react-icons/fa";
import { useEffect, useState } from "react";

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: BsPersonWorkspace, path: "/workspaces" },
    {
        name: "Data Collections",
        icon: BiTable,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/dataCollections`,
    },
    {
        name: "Tasks",
        icon: FaTasks,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/taskLists`,
    },
    {
        name: "Documents",
        icon: BsFiletypeDoc,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/documents`,
    },
    {
        name: "Message Board",
        icon: AiOutlineMessage,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/messageBoard`,
    },
];

const View = () => {
    // const [data, setData] = useState<TDataCollection[]>(dataCollections);
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    const { data } = useGetDataCollectionsQuery(null);
    const [createDataCollection] = useCreateDataCollecionMutation();
    const [updateDataCollection] = useUpdateDataCollectionMutation();
    const [deleteDataCollection] = useDeleteDataCollectionMutation();

    const [permissions, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem("workspaceId")) {
                setPermissions(workspace.permissions);
            }
        }
    };

    return (
        <SideBarLayout linkItems={LinkItems}>
            <Box>
                <Flex
                    minH={"100vh"}
                    // justify={"center"}
                    bg={"#eff2f5"}
                >
                    <Container maxW={"8xl"} mt={{ base: 4, sm: 0 }}>
                        <SimpleGrid
                            spacing={6}
                            // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                            columns={{ base: 1, sm: 2 }}
                            pb={"50px"}
                        >
                            <Flex>
                                <Box>
                                    <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                        Data Collections
                                    </Heading>
                                    <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                        Create data collection tables to visualize and manage your data.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pb={"20px"}>
                                    <Create addNewDataCollection={createDataCollection} />
                                </Box>
                            </Flex>
                        </SimpleGrid>

                        <SimpleGrid
                            spacing={6}
                            // templateColumns="repeat(3, minmax(300px, 1fr))"
                            columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                        >
                            {data?.map((dataCollection, index) => {
                                return (
                                    <Card
                                        key={index}
                                        variant="outline"
                                        boxShadow="rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem"
                                        mb={{ base: 6 }}
                                        h={"250px"}
                                    >
                                        <CardHeader
                                            h={"60px"}
                                            as={"a"}
                                            href={`/workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${
                                                dataCollection._id
                                            }`}
                                            onClick={() =>
                                                localStorage.setItem("dataCollectionId", dataCollection?._id || "")
                                            }
                                        >
                                            <Flex>
                                                <Flex
                                                    flex="1"
                                                    gap="4"
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                    position={"relative"}
                                                    bottom={10}
                                                >
                                                    <Box
                                                        bgImage={
                                                            // "radial-gradient(circle at center top, rgb(73, 163, 241), rgb(26, 115, 232))"
                                                            // "radial-gradient(circle at center top, rgb(66, 66, 74), black)"
                                                            // "radial-gradient(circle at right top, #F26989, #EB1E4E)"
                                                            "linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))"
                                                        }
                                                        padding={"20px"}
                                                        borderRadius={"lg"}
                                                        // position={"relative"}
                                                        // bottom={10}
                                                    >
                                                        <IconContext.Provider
                                                            value={{
                                                                size: "18px",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <BiTable />
                                                        </IconContext.Provider>
                                                    </Box>

                                                    <Box
                                                        // position={"relative"}
                                                        // bottom={7}
                                                        pt={7}
                                                    >
                                                        <Heading size="xs" color={"#575757"}>
                                                            {dataCollection.name}
                                                        </Heading>
                                                    </Box>
                                                </Flex>
                                            </Flex>
                                        </CardHeader>
                                        <CardBody
                                            py={0}
                                            as={"a"}
                                            href={`/workspaces/${localStorage.getItem("workspaceId")}/dataCollections/${
                                                dataCollection._id
                                            }`}
                                            onClick={() =>
                                                localStorage.setItem("dataCollectionId", dataCollection?._id || "")
                                            }
                                        >
                                            <Center>
                                                <Text color={"rgb(123, 128, 154)"} fontSize={"md"}>
                                                    {/* {dataCollection.description} */}
                                                </Text>
                                            </Center>
                                        </CardBody>

                                        <Divider
                                            gradient="radial-gradient(#eceef1 40%, white 60%)"
                                            marginBottom="2px"
                                        />
                                        {/* <Image
                                    objectFit="cover"
                                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                    alt="Chakra UI"
                                /> */}
                                        {(permissions || 0) > 1 ? (
                                            <CardFooter p={"5px"}>
                                                <Edit
                                                    dataCollection={dataCollection}
                                                    updateDataCollection={updateDataCollection}
                                                />
                                                <Button
                                                    flex="1"
                                                    variant="ghost"
                                                    leftIcon={<AiOutlineDelete />}
                                                    color={"rgb(123, 128, 154)"}
                                                    zIndex={10}
                                                    onClick={() => deleteDataCollection(dataCollection?._id || "")}
                                                ></Button>
                                            </CardFooter>
                                        ) : null}
                                    </Card>
                                    // </Box>
                                );
                            })}
                        </SimpleGrid>
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
        // </Layout>
    );
};

export default View;
