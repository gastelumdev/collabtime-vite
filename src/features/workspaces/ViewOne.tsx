import { useParams, Navigate } from "react-router-dom";

import { useGetOneWorkspaceQuery, useGetWorkspaceUsersQuery, useGetUserQuery } from "../../app/services/api";

import { Avatar, AvatarGroup, Box, Container, Flex, Heading, SimpleGrid, Spacer, Text } from "@chakra-ui/react";

import LinkItems from "../../utils/linkItems";
import { TUser } from "../../types";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import { BsFiletypeDoc } from "react-icons/bs";
import { AiOutlineMessage, AiOutlineTable } from "react-icons/ai";
import SecondaryCard from "../../components/SecondaryCard";
import Invite from "./Invite";
import { useEffect, useState } from "react";

/**
 * This funcion renders a workspace when selected from the workspaces page
 * The page will be obtained by the id in the url ex. /workspaces/:id
 * This may change with Redux since the workspace id will be saved in local
 * storage.
 * @returns {JSX}
 */
const ViewOne = () => {
    const { id } = useParams();
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    const { data: workspace, isError, error } = useGetOneWorkspaceQuery(id as string);
    const { data: workspaceUser } = useGetWorkspaceUsersQuery(id as string);

    const [permissions, setPermissions] = useState<number>();

    useEffect(() => {
        localStorage.setItem("workspaceId", id || "");

        getPermissions();
    }, [user, error]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem("workspaceId")) {
                setPermissions(workspace.permissions);
            }
        }
    };

    if (isError) return <Navigate to={"/workspaces"} />;

    return (
        <SideBarLayout linkItems={LinkItems}>
            <Box>
                <Flex minH={"100vh"} bg={"#eff2f5"}>
                    <Container maxW={"full"} mt={{ base: 4, sm: 0 }}>
                        <SimpleGrid spacing={6} columns={{ base: 1, sm: 2 }} pb={"50px"}>
                            <Flex>
                                <Box>
                                    <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                        {workspace?.name}
                                    </Heading>
                                    <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                        The tools below will help manage your projects and teams.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pt={"30px"} mr={"10px"}>
                                    <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                                        Team Members:
                                    </Text>
                                </Box>
                                <Box pt={"22px"}>
                                    <AvatarGroup size="sm" max={5} mr={"18px"}>
                                        {workspaceUser?.members.map((member: TUser, index: number) => {
                                            return (
                                                <Avatar
                                                    key={index}
                                                    name={`${member.firstname[0]}${member.lastname[0]}`}
                                                    getInitials={(name: string) => {
                                                        return name;
                                                    }}
                                                    _hover={{ zIndex: 10 }}
                                                    cursor={"default"}
                                                />
                                            );
                                        })}
                                    </AvatarGroup>
                                </Box>
                                {(permissions || 1) > 1 ? (
                                    <Box mt={"18px"}>
                                        <Invite />
                                    </Box>
                                ) : null}
                            </Flex>
                        </SimpleGrid>
                        <SimpleGrid spacing={6} spacingY={12} columns={{ base: 1, sm: 1, md: 3, lg: 4 }}>
                            {(workspace?.tools.dataCollections.access || 0) > 0 ? (
                                <a href={`/workspaces/${workspace?._id}/dataCollections`}>
                                    <SecondaryCard
                                        title={"Data Collections"}
                                        description={"Create and manage data."}
                                        icon={AiOutlineTable}
                                        bgImage="linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))"
                                    />
                                </a>
                            ) : null}
                            {(workspace?.tools.docs.access || 0) > 0 ? (
                                <a href={`/workspaces/${workspace?._id}/documents`}>
                                    <SecondaryCard
                                        title={"Documents"}
                                        description={"Create and upload docs."}
                                        icon={BsFiletypeDoc}
                                        bgImage="linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))"
                                    />
                                </a>
                            ) : null}
                            {(workspace?.tools.messageBoard.access || 0) > 0 ? (
                                <a href={`/workspaces/${workspace?._id}/messageBoard`}>
                                    <SecondaryCard
                                        title={"Message Board"}
                                        description={"Message your team."}
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
