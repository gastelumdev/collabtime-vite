import {
    Box,
    Container,
    Flex,
    Heading,
    SimpleGrid,
    Spacer,
    Text,
} from "@chakra-ui/react";

import { IconType } from "react-icons";
import { BsFiletypeDoc, BsPersonWorkspace } from "react-icons/bs";
import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";

import SideBarLayout from "../../components/Layouts/SideBarLayout";

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

/**
 * The link items array used for the sidebar navigation
 * @constant {array}
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

const View = () => {
    return (
        <SideBarLayout
            linkItems={LinkItems}
        >
            <Box>
                <Flex
                    minH={"100vh"}
                    bg={"#eff2f5"}
                >
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
                                        Message Board
                                    </Heading>
                                    <Text
                                        color={"rgb(123, 128, 154)"}
                                        fontSize={"md"}
                                        fontWeight={300}
                                    >
                                        Post messages to update your team.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pb={"20px"}>
                                    {/* <Create addNewWorkspace={addNewWorkspace} /> */}
                                </Box>
                            </Flex>
                        </SimpleGrid>

                        <SimpleGrid
                            spacing={6}
                            columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                        ></SimpleGrid>
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
    );
};

export default View;
