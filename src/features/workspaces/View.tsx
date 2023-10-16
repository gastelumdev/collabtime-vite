import { ReactNode, useState } from "react";
import {
    DeleteOutlined,
    EyeOutlined,
    LikeFilled,
    LikeOutlined,
} from "@ant-design/icons";
import {} from "antd";
import Meta from "antd/es/card/Meta";
import Layout from "../../components/Layouts/Layout";
import {
    Box,
    Breadcrumb,
    Card,
    CardHeader,
    CardBody,
    Container,
    Flex,
    Heading,
    Image,
    SimpleGrid,
    Spacer,
    Text,
    Avatar,
    IconButton,
    CardFooter,
    Button,
    Center,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@chakra-ui/react";
import Create from "./Create";
import { useNavigate } from "react-router-dom";
import { IWorkspace } from "../../types";
import Edit from "./Edit";
import { BiLike, BiChat, BiShare, BiEdit, BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsPersonWorkspace } from "react-icons/bs";
import Divider from "../../components/Divider/Divider";
import TopNav from "../../components/Layouts/TopNav";

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
        <Box>
            <TopNav
                breadcrumbs={
                    <Breadcrumb fontSize={"16px"} pb={{ sm: "20px" }}>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink href="#" color="#929dae">
                                Workspaces
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
                            <Box pb={"20px"}>
                                <Create addNewWorkspace={addNewWorkspace} />
                            </Box>
                        </Flex>
                    </SimpleGrid>

                    <SimpleGrid
                        spacing={6}
                        // templateColumns="repeat(3, minmax(300px, 1fr))"
                        columns={{ base: 1, sm: 1, md: 3 }}
                    >
                        {workspaces.map((workspace, index) => {
                            return (
                                <Card
                                    variant="outline"
                                    boxShadow="rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem"
                                    mb={{ base: 6 }}
                                    h={"250px"}
                                >
                                    <CardHeader
                                        h={"60px"}
                                        as={"a"}
                                        href={`/workspaces/${workspace._id}`}
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
                                                        "radial-gradient(circle at right top, #FF5BA7 , #D32C7A)"
                                                    }
                                                    padding={"20px"}
                                                    borderRadius={"lg"}
                                                    // position={"relative"}
                                                    // bottom={10}
                                                >
                                                    {/* <BsPersonWorkspace
                                                    size={"30px"}
                                                    color={"white"}
                                                /> */}
                                                    <LikeFilled
                                                        style={{
                                                            marginRight: "4px",
                                                            fontSize: "20px",
                                                            color: "white",
                                                        }}
                                                    />
                                                </Box>
                                                {/* <Avatar
                                                    name="Segun Adebayo"
                                                    src="https://bit.ly/sage-adebayo"
                                                /> */}

                                                <Box
                                                    // position={"relative"}
                                                    // bottom={7}
                                                    pt={7}
                                                >
                                                    <Heading
                                                        size="sm"
                                                        color={"#575757"}
                                                    >
                                                        {workspace.name}
                                                    </Heading>
                                                    {/* <Text>
                                                        Creator, Chakra UI
                                                    </Text> */}
                                                </Box>
                                            </Flex>
                                            {/* <IconButton
                                            variant="ghost"
                                            colorScheme="gray"
                                            aria-label="See menu"
                                            icon={<BsThreeDotsVertical />}
                                        /> */}
                                        </Flex>
                                    </CardHeader>
                                    <CardBody
                                        py={0}
                                        as={"a"}
                                        href={`/workspaces/${workspace._id}`}
                                    >
                                        <Center>
                                            <Text
                                                color={"rgb(123, 128, 154)"}
                                                fontSize={"md"}
                                            >
                                                {workspace.description}
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

                                    <CardFooter p={"5px"}>
                                        <Edit
                                            workspace={workspace}
                                            updateWorkspace={setWorkspaces}
                                        />
                                        <Button
                                            flex="1"
                                            variant="ghost"
                                            leftIcon={<AiOutlineDelete />}
                                            color={"rgb(123, 128, 154)"}
                                            zIndex={10}
                                        ></Button>
                                    </CardFooter>
                                </Card>
                                // </Box>
                            );
                        })}
                    </SimpleGrid>
                </Container>
            </Flex>
        </Box>
        // </Layout>
    );
};

export default View;
