import {
    useGetDataCollectionsQuery,
    useCreateDataCollecionMutation,
    useDeleteDataCollectionMutation,
    useUpdateDataCollectionMutation,
    useGetUserQuery,
    useGetOneWorkspaceQuery,
    useDeleteTagMutation,
    useTagExistsMutation,
} from "../../app/services/api";

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    SimpleGrid,
    Spacer,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import SideBarLayout from "../../components/Layouts/SideBarLayout";

import LinkItems from "../../utils/linkItems";
import { AiOutlineDelete } from "react-icons/ai";
import Edit from "./Edit";
import Create from "./Create";
import { useEffect, useState } from "react";
import React from "react";
import PrimaryCard from "../../components/PrimaryCard";
import TagsModal from "../tags/TagsModal";
import { TDataCollection, TTag } from "../../types";

const View = () => {
    // const [data, setData] = useState<TDataCollection[]>(dataCollections);
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    const { data } = useGetDataCollectionsQuery(null);
    const { data: workspace, isFetching: workspaceIsFetching } = useGetOneWorkspaceQuery(
        localStorage.getItem("workspaceId") || ""
    );
    const [createDataCollection] = useCreateDataCollecionMutation();
    const [updateDataCollection] = useUpdateDataCollectionMutation();
    const [deleteDataCollection] = useDeleteDataCollectionMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const [permissions, setPermissions] = useState<number>();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<any>(null);

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

    const handleCloseTagButtonClick = async (dataCollection: TDataCollection, tag: TTag) => {
        const { tags } = dataCollection;
        console.log(tags);

        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        const addNewDataCollection = { ...dataCollection, tags: filteredTags };
        console.log(addNewDataCollection);
        const updatedDataCollectionRes: any = await updateDataCollection(addNewDataCollection);
        const updatedWorkspace = updatedDataCollectionRes.data;
        console.log(updatedWorkspace);

        const { workspaceTags } = updatedWorkspace;

        const thisTagExistsRes: any = await tagExists(tag);
        console.log(thisTagExistsRes);

        if (!thisTagExistsRes.data.tagExists) {
            const filteredWorkspaceTags = workspaceTags.filter((item: TTag) => {
                return item.name !== tag.name;
            });
            const newUpdatedWorkspace = { ...updatedWorkspace, workspaceTags: filteredWorkspaceTags };
            await updateDataCollection(newUpdatedWorkspace);
            await deleteTag(tag);
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
                    <Container maxW={"full"} mt={{ base: 4, sm: 0 }}>
                        <SimpleGrid
                            spacing={6}
                            // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                            columns={{ base: 1, sm: 2 }}
                            pb={"50px"}
                        >
                            <Flex>
                                <Box>
                                    <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                        {!workspaceIsFetching ? `${workspace?.name} - Data Collections` : null}
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
                                    <>
                                        <PrimaryCard
                                            key={index}
                                            index={index}
                                            data={dataCollection}
                                            redirectUrl={`/workspaces/${workspace?._id}/dataCollections/${dataCollection._id}`}
                                            localStorageId="dataCollectionId"
                                            divider={(permissions || 0) > 1}
                                            editButton={
                                                (permissions || 0) > 1 ? (
                                                    <Edit
                                                        dataCollection={dataCollection}
                                                        updateDataCollection={updateDataCollection}
                                                    />
                                                ) : null
                                            }
                                            deleteButton={
                                                (permissions || 0) > 1 ? (
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
                                                                                deleteDataCollection(
                                                                                    dataCollection._id as string
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
                                                (permissions || 0) > 1 ? (
                                                    <TagsModal
                                                        tagType={"dataCollection"}
                                                        data={dataCollection}
                                                        tags={dataCollection.tags}
                                                        update={updateDataCollection}
                                                        workspaceId={workspace?._id || ""}
                                                    />
                                                ) : null
                                            }
                                            handleCloseTagButtonClick={handleCloseTagButtonClick}
                                        />
                                        {/* <Card
                                            key={index}
                                            variant="outline"
                                            boxShadow="rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem"
                                            mb={{ base: 6 }}
                                            h={"250px"}
                                        >
                                            <CardHeader
                                                h={"60px"}
                                                as={"a"}
                                                href={`/workspaces/${localStorage.getItem(
                                                    "workspaceId"
                                                )}/dataCollections/${dataCollection._id}`}
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
                                                href={`/workspaces/${localStorage.getItem(
                                                    "workspaceId"
                                                )}/dataCollections/${dataCollection._id}`}
                                                onClick={() =>
                                                    localStorage.setItem("dataCollectionId", dataCollection?._id || "")
                                                }
                                            >
                                                <Center>
                                                    <Text color={"rgb(123, 128, 154)"} fontSize={"md"}>
                                                        {dataCollection.description}
                                                    </Text>
                                                </Center>
                                            </CardBody>

                                            <Divider
                                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                                marginBottom="2px"
                                            />
                                            {(permissions || 0) > 1 ? (
                                                <CardFooter p={"5px"}>
                                                    <Edit
                                                        dataCollection={dataCollection}
                                                        updateDataCollection={updateDataCollection}
                                                    />
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
                                                                        Delete Customer
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
                                                                                deleteDataCollection(
                                                                                    dataCollection?._id || ""
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
                                                </CardFooter>
                                            ) : null}
                                        </Card> */}
                                    </>
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
