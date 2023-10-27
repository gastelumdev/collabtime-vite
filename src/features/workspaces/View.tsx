import { useState } from "react";
import {
    Box,
    Container,
    Flex,
    Heading,
    SimpleGrid,
    Spacer,
    Text,
    Button,
    Center,
} from "@chakra-ui/react";

import { TWorkspace, LinkItemProps } from "../../types";
import Create from "./Create";
import Edit from "./Edit";
import SideBarLayout from "../../components/Layouts/SideBarLayout";
import PrimaryCard from "../../components/PrimaryCard";

import { AiOutlineDelete, AiOutlineLike } from "react-icons/ai";
import { IconContext } from "react-icons";
import { BsPersonWorkspace } from "react-icons/bs";

/**
 * This is dummy data that simulates what will be brought in with RTK
 * @constant {IWorkspace[]} data
 */
const data: TWorkspace[] = [
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
        invitees: [],
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
        invitees: [],
    },
];

/**
 * The link items array used for the sidebar navigation
 * @constant {array}
 */
const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: BsPersonWorkspace, path: "/workspaces" },
];

/**
 * This is the default workspace view that renders all workspaces
 * @prop {null}
 * @returns {JSX}
 */
const View = () => {
    /**
     * State management for the array of workspaces coming from the backend ***
     * @constant {IWorkspaces[]} workspaces
     */
    const [workspaces, setWorkspaces] = useState<TWorkspace[]>(data);

    /**
     * Adds a new workspace to state.
     * NOTE: This is where the create request will be called.
     * This function is passed in as a prop to Create.tsx.
     * @param {IWorkspace} workspace
     */
    const addNewWorkspace = (workspace: TWorkspace) => {
        setWorkspaces([...workspaces, workspace]);
    };

    /**
     * Updates the one workspace to state
     * NOTE: This is where calling the update request will be called ***
     * This function is passed in as a prop to Edit.tsx.
     * @param {IWorkspace} workspace
     */
    const updateWorkspace = (workspace: TWorkspace) => {
        const oldData: TWorkspace[] = workspaces.filter((item) => {
            return workspace._id !== item._id;
        });

        setWorkspaces([...oldData, workspace]);
    };

    return (
        <SideBarLayout
            linkItems={LinkItems}
            leftContent={
                <Box pt={"6px"} pb={"4px"}>
                    <Center>
                        <IconContext.Provider
                            value={{ color: "#7b809a", size: "20px" }}
                        >
                            <Box display={"inline-block"} mr={"3px"}>
                                <AiOutlineLike />
                            </Box>
                        </IconContext.Provider>
                        <Text as={"b"} fontSize={"16px"} color={"#7b809a"}>
                            Collabtime
                        </Text>
                    </Center>
                </Box>
            }
            sidebar={false}
        >
            <Box>
                <Flex minH={"100vh"} bg={"#eff2f5"}>
                    <Container maxW={"8xl"} mt={{ base: 4, sm: 0 }}>
                        <SimpleGrid
                            spacing={6}
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
                            columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                        >
                            {workspaces.map((workspace, index) => {
                                return (
                                    <PrimaryCard
                                        key={index}
                                        index={index}
                                        data={workspace}
                                        editButton={
                                            <Edit
                                                workspace={workspace}
                                                updateWorkspace={
                                                    updateWorkspace
                                                }
                                            />
                                        }
                                        deleteButton={
                                            <Button
                                                flex="1"
                                                variant="ghost"
                                                leftIcon={<AiOutlineDelete />}
                                                color={"rgb(123, 128, 154)"}
                                                zIndex={10}
                                            ></Button>
                                        }
                                    />
                                );
                            })}
                        </SimpleGrid>
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
    );
};

export default View;
