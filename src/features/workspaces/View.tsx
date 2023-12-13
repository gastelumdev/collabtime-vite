import { useEffect, useState } from "react";
import {
    useGetWorkspacesQuery,
    useCreateWorkspaceMutation,
    useDeleteWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useCallUpdateMutation,
    useGetUserQuery,
    useDeleteTagMutation,
    useTagExistsMutation,
} from "../../app/services/api";

import { io } from "socket.io-client";

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
    useToast,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";

import { TWorkspace, LinkItemProps, TTag } from "../../types";
import Create from "./Create";
import Edit from "./Edit";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import PrimaryCard from "../../components/PrimaryCard";

import { AiOutlineDelete } from "react-icons/ai";
import { BsPersonWorkspace } from "react-icons/bs";
import React from "react";
import TagsModal from "../tags/TagsModal";

const LinkItems: Array<LinkItemProps> = [{ name: "Workspaces", icon: BsPersonWorkspace, path: "/workspaces" }];

/**
 * This is the default workspace view that renders all workspaces
 * @prop {null}
 * @returns {JSX}
 */
const View = () => {
    const { data } = useGetWorkspacesQuery(null);
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    const [createWorkspace, { isError: createWorkspaceIsError, error: createWorkspaceError }] =
        useCreateWorkspaceMutation();
    const [updateWorkspace] = useUpdateWorkspaceMutation();
    const [deleteWorkspace] = useDeleteWorkspaceMutation();
    const [callUpdate] = useCallUpdateMutation();
    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<any>(null);

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    /**
     * Socket.io listening for update to refetch data
     */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();

        socket.on("update", () => {
            callUpdate(null);
        });

        socket.on("getWorkspaces-" + localStorage.getItem("userId"), (item) => {
            console.log(item);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        for (const workspace of data || []) {
            for (const member of workspace.members) {
                if (member.email === user?.email && member.permissions > 1) {
                    setIsAuthorized(true);
                }
            }
        }
    }, [data, user]);

    const handleCloseTagButtonClick = async (workspace: TWorkspace, tag: TTag) => {
        const { tags } = workspace;
        console.log(tags);

        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        const newWorkspace = { ...workspace, tags: filteredTags };
        console.log(newWorkspace);
        const updatedWorkspaceRes: any = await updateWorkspace(newWorkspace);
        const updatedWorkspace = updatedWorkspaceRes.data;
        console.log(updatedWorkspace);

        const { workspaceTags } = updatedWorkspace;

        const thisTagExistsRes: any = await tagExists(tag);
        console.log(thisTagExistsRes);

        if (!thisTagExistsRes.data.tagExists) {
            const filteredWorkspaceTags = workspaceTags.filter((item: TTag) => {
                return item.name !== tag.name;
            });
            const newUpdatedWorkspace = { ...updatedWorkspace, workspaceTags: filteredWorkspaceTags };
            await updateWorkspace(newUpdatedWorkspace);
            await deleteTag(tag);
        }
    };

    if (createWorkspaceIsError) {
        toast({
            title: "Create Workspace Error",
            description: (createWorkspaceError as any)?.data.error._message,
            status: "error",
        });
    }

    return (
        <SideBarLayout
            linkItems={LinkItems}
            // leftContent={
            //     <Box pt={"6px"} pb={"4px"}>
            //         <Center>
            //             <IconContext.Provider value={{ color: "#7b809a", size: "20px" }}>
            //                 <Box display={"inline-block"} mr={"3px"}>
            //                     <AiOutlineLike />
            //                 </Box>
            //             </IconContext.Provider>
            //             <Text as={"b"} fontSize={"16px"} color={"#7b809a"}>
            //                 Collabtime
            //             </Text>
            //         </Center>
            //     </Box>
            // }
            sidebar={false}
        >
            <Box>
                <Flex minH={"100vh"} bg={"#eff2f5"}>
                    <Container maxW={"full"} mt={{ base: 4, sm: 0 }}>
                        <SimpleGrid spacing={6} columns={{ base: 1, sm: 2 }} pb={"50px"}>
                            <Flex>
                                <Box>
                                    <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                        Workspaces
                                    </Heading>
                                    <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                        Create a new workspace to manage your projects and teams.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pb={"20px"}>
                                    <Create addNewWorkspace={createWorkspace} />
                                </Box>
                            </Flex>
                        </SimpleGrid>
                        {data?.length || 0 > 0 ? (
                            <SimpleGrid
                                spacing={6}
                                columns={{
                                    base: 1,
                                    sm: 1,
                                    md: 2,
                                    lg: 3,
                                    xl: 4,
                                }}
                            >
                                {data?.map((workspace: TWorkspace, index: number) => {
                                    return (
                                        <PrimaryCard
                                            key={index}
                                            index={index}
                                            data={workspace}
                                            divider={
                                                workspace?.owner === localStorage.getItem("userId") || isAuthorized
                                            }
                                            editButton={
                                                workspace?.owner === localStorage.getItem("userId") || isAuthorized ? (
                                                    <Edit workspace={workspace} updateWorkspace={updateWorkspace} />
                                                ) : null
                                            }
                                            deleteButton={
                                                workspace?.owner === localStorage.getItem("userId") || isAuthorized ? (
                                                    <>
                                                        <Button
                                                            flex="1"
                                                            variant="ghost"
                                                            leftIcon={<AiOutlineDelete />}
                                                            color={"rgb(123, 128, 154)"}
                                                            zIndex={10}
                                                            onClick={onOpen}
                                                        ></Button>
                                                        <AlertDialog
                                                            isOpen={isOpen}
                                                            leastDestructiveRef={cancelRef}
                                                            onClose={onClose}
                                                        >
                                                            <AlertDialogOverlay>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                                                        Delete Workspace
                                                                    </AlertDialogHeader>

                                                                    <AlertDialogBody>
                                                                        Are you sure? You can't undo this action
                                                                        afterwards.
                                                                    </AlertDialogBody>

                                                                    <AlertDialogFooter>
                                                                        <Button ref={cancelRef} onClick={onClose}>
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            colorScheme="red"
                                                                            onClick={() => {
                                                                                deleteWorkspace(
                                                                                    workspace._id as string
                                                                                );
                                                                                onClose();
                                                                            }}
                                                                            ml={3}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialogOverlay>
                                                        </AlertDialog>
                                                    </>
                                                ) : null
                                            }
                                            tagButton={
                                                workspace?.owner === localStorage.getItem("userId") || isAuthorized ? (
                                                    <TagsModal
                                                        tagType={"workspace"}
                                                        data={workspace}
                                                        tags={workspace.tags}
                                                        update={updateWorkspace}
                                                        workspaceId={workspace._id || ""}
                                                    />
                                                ) : null
                                            }
                                            handleCloseTagButtonClick={handleCloseTagButtonClick}
                                        />
                                    );
                                })}
                            </SimpleGrid>
                        ) : (
                            <Center>
                                <Text color={"rgb(123, 128, 154)"}>Your workspaces list is empty.</Text>
                            </Center>
                        )}
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
    );
};

export default View;
