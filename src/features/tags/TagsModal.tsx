import {
    Box,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { GoTag } from "react-icons/go";
import {
    useCreateTagMutation,
    useGetOneWorkspaceQuery,
    useGetTagsQuery,
    useUpdateWorkspaceMutation,
} from "../../app/services/api";
import { TTag } from "../../types";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { BsPlusCircle } from "react-icons/bs";

interface IProps {
    data: any;
    tags: TTag[];
    update: any;
    workspaceId: string;
    tagType: string;
}

const TagsModal = ({ data, tags, update, workspaceId, tagType }: IProps) => {
    const { onOpen, isOpen, onClose } = useDisclosure();
    const initialRef = useRef<any>();

    const { data: workspace } = useGetOneWorkspaceQuery(workspaceId || "");
    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const { data: workspaceTags } = useGetTagsQuery(workspaceId);
    const [createTag] = useCreateTagMutation();

    const [availableTags, setAvailableTags] = useState<TTag[]>([]);

    const [tagInput, setTagInput] = useState<string>("");
    const [tagInputError, setTagInputError] = useState<boolean>(false);

    useEffect(() => {
        filterTags();
    }, [workspaceTags, tags]);

    const filterTags = () => {
        const tagIds: string[] = [];

        for (const tag of tags || []) {
            tagIds.push(tag._id || "");
        }
        console.log(tagIds);

        console.log(tags);

        const filteredTags = workspaceTags?.filter((item) => {
            if (!tagIds.includes(item._id || "")) {
                console.log(item);
                return true;
            } else {
                console.log(item);
                return false;
            }
        });

        console.log(filteredTags);

        setAvailableTags(filteredTags || []);
    };

    const handleTagInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(workspaceTags);
        setTagInputError(false);
        for (const workspaceTag of workspaceTags || []) {
            console.log(workspaceTag.name, event.target.value);
            if (workspaceTag.name == event.target.value) {
                setTagInputError(true);
            }
        }
        setTagInput(event.target.value);
    };

    const handleCreateTagClick = async () => {
        const res: any = await createTag({ tagType: tagType, tag: { workspace: workspaceId, name: tagInput } });
        const tagsCopy = tags || [];
        console.log(res);

        const workspaceTagsCopy = workspace?.workspaceTags || [];
        const updateWorkspaceCopy: any = updateWorkspace;

        if (tagType === "workspace") {
            await update({
                ...workspace,
                tags: [...tagsCopy, res.data],
                workspaceTags: [...workspaceTagsCopy, res.data],
            });
        } else {
            await updateWorkspaceCopy({
                ...workspace,
                workspaceTags: [...workspaceTagsCopy, res.data],
            });
            await update({
                ...data,
                tags: [...tagsCopy, res.data],
            });
        }

        filterTags();
        setTagInput("");
        onClose();
    };

    const handleAddWorkspaceTag = async (tag: TTag) => {
        const tagsCopy = tags || [];
        await update({
            ...data,
            tags: [...tagsCopy, tag],
        });

        filterTags();
        setTagInput("");
        onClose();
    };

    return (
        <>
            {tagType === "row" ? (
                <Button onClick={onOpen} variant={"unstyled"} h={"18px"} minW={"16px"} mr={"5px"} pt={"2px"}>
                    <BsPlusCircle color={"rgb(123, 128, 154)"} />
                </Button>
            ) : (
                <Button
                    flex="1"
                    variant="ghost"
                    leftIcon={<GoTag />}
                    color={"rgb(123, 128, 154)"}
                    zIndex={10}
                    onClick={onOpen}
                ></Button>
            )}
            <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tags</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box mb={"20px"}>
                            <Text mb={"5px"}>Create a new tag</Text>
                            <Flex>
                                <Input ref={initialRef} mr={"5px"} value={tagInput} onChange={handleTagInput} />
                                <PrimaryButton onClick={handleCreateTagClick} isDisabled={tagInputError}>
                                    ADD
                                </PrimaryButton>
                            </Flex>
                            <Box mt={"5px"} h={"10px"}>
                                {tagInputError ? (
                                    <Text
                                        color={"red"}
                                        fontSize={"14px"}
                                    >{`"${tagInput}" already exists in this workspace.`}</Text>
                                ) : null}
                            </Box>
                        </Box>
                        <Box>
                            {availableTags.length > 0 ? <Text mb={"10px"}>Or select an existing tag.</Text> : null}
                            {availableTags?.map((tag, index) => {
                                return (
                                    <Box key={index}>
                                        <Button
                                            w={"100%"}
                                            colorScheme="blue"
                                            variant={"ghost"}
                                            onClick={() => handleAddWorkspaceTag(tag)}
                                        >
                                            <Text w={"100%"} textAlign={"left"}>
                                                {tag.name}
                                            </Text>
                                        </Button>
                                    </Box>
                                );
                            })}
                        </Box>
                        {/* <Box>
                            {data.tags.map((tag: TTag, index: number) => {
                                return (
                                    <HStack spacing={4}>
                                        <Tag key={index} size={"sm"} variant="solid" colorScheme="green">
                                            <TagLabel>Green</TagLabel>
                                            <TagCloseButton />
                                        </Tag>
                                    </HStack>
                                );
                            })}
                        </Box> */}
                    </ModalBody>

                    <ModalFooter>
                        {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost">Secondary Action</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TagsModal;
