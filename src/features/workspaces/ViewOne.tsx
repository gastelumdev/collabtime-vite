import { useParams } from "react-router-dom";

import {
    Avatar,
    AvatarGroup,
    Box,
    Container,
    Flex,
    Heading,
    SimpleGrid,
    Spacer,
    Text,
} from "@chakra-ui/react";

import { IWorkspace, IInvitee, LinkItemProps } from "../../types";

import SideBarLayout from "../../components/Layouts/SideBarLayout";

import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { BsFiletypeDoc, BsListTask, BsPersonWorkspace } from "react-icons/bs";
import { AiOutlineMessage, AiOutlineTable } from "react-icons/ai";
import SecondaryCard from "../../components/SecondaryCard";
import Invite from "./Invite";

/**
 * This is dummy data that simulates what will be brought in with RTK
 * @constant {IWorkspace[]} data
 */
const data: IWorkspace[] = [
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
        invitees: [],
    },
    {
        _id: "2",
        name: "Workspace 2",
        description: "This is another sample workspace.",
        tools: {
            dataCollections: { access: 1 },
            taskLists: { access: 1 },
            docs: { access: 1 },
            messageBoard: { access: 0 },
        },
        invitees: [],
    },
];

/**
 * The link items array used for the sidebar navigation
 * @constant {LinkItemProps[]} LinkItems
 */
const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: BsPersonWorkspace, path: "/workspaces" },
    {
        name: "Data Collections",
        icon: BiTable,
        path: "/workspaces/1/dataCollections",
    },
    { name: "Tasks", icon: FaTasks, path: "/workspaces/1/taskLists" },
    { name: "Documents", icon: BsFiletypeDoc, path: "/workspaces/1/documents" },
    {
        name: "Message Board",
        icon: AiOutlineMessage,
        path: "/workspaces/1/messageBoard",
    },
];

/**
 * This funcion renders a workspace when selected from the workspaces page
 * The page will be obtained by the id in the url ex. /workspaces/:id
 * This may change with Redux since the workspace id will be saved in local
 * storage.
 * @returns {JSX}
 */
const ViewOne = () => {
    const { id } = useParams();

    /**
     * Filters the data to get the workspace with the id in the url
     * NOTE: this will come from the backend and should be removed ***
     * @constant {IWorkspace} workspace
     */
    const workspace: IWorkspace = data.filter((item) => {
        return item._id === id;
    })[0];

    /**
     * Gets workspace invites from the invite team member drawer
     * An API call is made that handles the email invites
     * @param {IInvitee} invitees
     */
    const getInvitees = (invitees: IInvitee[]) => {
        // Make API call to invite invitees
        console.log(invitees);
    };

    return (
        <SideBarLayout linkItems={LinkItems}>
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
                                        Workspace 1
                                    </Heading>
                                    <Text
                                        color={"rgb(123, 128, 154)"}
                                        fontSize={"md"}
                                        fontWeight={300}
                                    >
                                        The tools below will help manage your
                                        projects and teams.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pt={"30px"} mr={"10px"}>
                                    <Text
                                        color={"rgb(123, 128, 154)"}
                                        fontSize={"14px"}
                                    >
                                        Team Members:
                                    </Text>
                                </Box>
                                <AvatarGroup size="sm" max={5} mr={"18px"}>
                                    <Avatar
                                        name="Ryan Florence"
                                        src="https://bit.ly/ryan-florence"
                                    />
                                    <Avatar
                                        name="Segun Adebayo"
                                        src="https://bit.ly/sage-adebayo"
                                    />
                                    <Avatar
                                        name="Kent Dodds"
                                        src="https://bit.ly/kent-c-dodds"
                                    />
                                    <Avatar
                                        name="Prosper Otemuyiwa"
                                        src="https://bit.ly/prosper-baba"
                                    />
                                    <Avatar
                                        name="Christian Nwamba"
                                        src="https://bit.ly/code-beast"
                                    />
                                </AvatarGroup>
                                <Box mt={"18px"}>
                                    <Invite getInvitees={getInvitees} />
                                </Box>
                            </Flex>
                        </SimpleGrid>
                        <SimpleGrid
                            spacing={6}
                            spacingY={12}
                            columns={{ base: 1, sm: 1, md: 3 }}
                        >
                            {workspace.tools.dataCollections.access > 0 ? (
                                <a
                                    href={`/workspaces/${workspace._id}/dataCollections`}
                                >
                                    <SecondaryCard
                                        icon={AiOutlineTable}
                                        bgImage="linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))"
                                    />
                                </a>
                            ) : null}
                            {workspace.tools.taskLists.access > 0 ? (
                                <a
                                    href={`/workspaces/${workspace._id}/taskLists`}
                                >
                                    <SecondaryCard
                                        icon={BsListTask}
                                        bgImage="linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))"
                                    />
                                </a>
                            ) : null}
                            {workspace.tools.docs.access > 0 ? (
                                <a
                                    href={`/workspaces/${workspace._id}/documents`}
                                >
                                    <SecondaryCard
                                        icon={BsFiletypeDoc}
                                        bgImage="linear-gradient(195deg, rgb(66, 66, 74), black)"
                                    />
                                </a>
                            ) : null}
                            {workspace.tools.messageBoard.access > 0 ? (
                                <a
                                    href={`/workspaces/${workspace._id}/messageBoard`}
                                >
                                    <SecondaryCard
                                        icon={AiOutlineMessage}
                                        bgImage="linear-gradient(195deg, #FF548A, #EC1559)"
                                    />
                                </a>
                            ) : null}
                        </SimpleGrid>
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
    );
};

export default ViewOne;
