import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    Heading,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Progress,
    Spacer,
    Table,
    TableContainer,
    Tag,
    TagCloseButton,
    TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    WrapItem,
    useDisclosure,
} from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import "./styles.css";
import SideBarLayout from "../../components/Layouts/SideBarLayout";
import LinkItems from "../../utils/linkItems";
import { IconContext } from "react-icons";
import { FaRegFileAlt, FaRegFileExcel, FaRegTrashAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import {
    useCreateDocumentMutation,
    useDeleteDocumentMutation,
    useDeleteTagMutation,
    useGetDocumentsQuery,
    useGetOneWorkspaceQuery,
    useTagExistsMutation,
    useUpdateDocumentMutation,
    useUpdateWorkspaceMutation,
    useUploadDocsMutation,
    useUploadPersistedDocsMutation,
} from "../../app/services/api";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaRegImage } from "react-icons/fa";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import UpdateModal from "./UpdateModal";
import { TDocument, TTag } from "../../types";
import TagsModal from "../tags/TagsModal";
import { Link } from "react-router-dom";

const View = () => {
    const { isOpen: uploadIsOpen, onOpen: uploadOnOpen, onClose: uploadOnClose } = useDisclosure();
    const { isOpen: createIsOpen, onOpen: createOnOpen, onClose: createOnClose } = useDisclosure();
    const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();

    const { data: documents, isFetching: documentsIsFetching } = useGetDocumentsQuery(null);
    const { data: workspace, isFetching } = useGetOneWorkspaceQuery(localStorage.getItem("workspaceId") || "");
    const [createDocument, { isLoading: createIsLoading }] = useCreateDocumentMutation();
    const [updateDocument] = useUpdateDocumentMutation();
    const [deleteDocument] = useDeleteDocumentMutation();
    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const [uploadDocs] = useUploadDocsMutation();
    const [uploadPersistedDocs] = useUploadPersistedDocsMutation();
    const [files, setFiles] = useState<FileList | []>([]);
    const [duplicateFiles, setDuplicateFiles] = useState<string[]>([]);
    const [createdDocName, setCreatedDocName] = useState<string>("");
    const [editorValue, setEditorValue] = useState<string>("");

    const editorRef = useRef<any>(null);
    const cancelRef = useRef<any>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuplicateFiles([]);
        console.log(event.target.files);
        if (event.target.files) {
            console.log("TO BE UPLOADED", event.target.files);
            console.log("DOCUMENTS", documents);
            let fileMap = {};
            for (const file of event.target.files) {
                fileMap = { ...fileMap, [file.name]: file.name };
            }

            const duplicateFilesCopy = duplicateFiles;

            for (const i in documents || []) {
                if (documents) {
                    if (fileMap.hasOwnProperty(documents[i].filename)) {
                        duplicateFilesCopy.push(documents[i].filename);
                    }
                }
            }

            setDuplicateFiles(duplicateFilesCopy);

            console.log(fileMap);
            setFiles(event.target.files);
            // const images = note.images;
            // setNote({ ...note, images: [...images, event.target.files[0].name] });
        }
    };

    const handleUploadClick = async () => {
        const formdata: FormData = new FormData();
        for (let i = 0; i < (files?.length || 0); i++) {
            formdata.append("docs", files[i]);
        }

        const res: any = await uploadDocs(formdata);
        const persistedRes: any = await uploadPersistedDocs(formdata);

        console.log(res.data);
        console.log(persistedRes.data);

        for (let i = 0; i < res.data.files.length; i++) {
            if (
                res.data.files[i].url &&
                persistedRes.data.files[i].url &&
                res.data.files[i].url === persistedRes.data.files[i].url
            ) {
                let splitFilename = res.data.files[i].file.filename.split(".");
                let ext = splitFilename[splitFilename.length - 1];
                await createDocument({
                    workspace: localStorage.getItem("workspaceId") || "",
                    filename: res.data.files[i].originalname,
                    type: "upload",
                    originalname: res.data.files[i].originalname,
                    url: res.data.files[i].url,
                    file: res.data.files[i].file,
                    ext: ext,
                    tags: [],
                });
                uploadOnClose();
            }
        }
    };

    const handleDocumentClick = () => {
        createOnClose();
        createDocument({
            workspace: localStorage.getItem("workspaceId") || "",
            filename: createdDocName,
            type: "created",
            value: editorValue,
            ext: "created",
            tags: [],
        });
    };

    const getIcon = (type: string) => {
        if (type === "jpg" || type === "png" || type === "jpeg") return <FaRegImage color={"rgb(123, 128, 154)"} />;
        if (type === "xlsx") return <FaRegFileExcel color={"rgb(123, 128, 154)"} />;
        return <FaRegFileAlt />;
    };

    const handleDeleteDocument = (document: TDocument) => {
        console.log(document);
        deleteDocument(document);
        deleteOnClose();
        setDuplicateFiles([]);
    };

    const handleUploadOnClose = () => {
        uploadOnClose();
        setDuplicateFiles([]);
    };

    const handleCloseTagButtonClick = async (document: TDocument, tag: TTag) => {
        const { tags } = document;
        console.log(tags);

        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        const addNewDocument = { ...document, tags: filteredTags };
        console.log(addNewDocument);
        const updatedRowRes: any = await updateDocument(addNewDocument);
        const updatedRow = updatedRowRes.data;
        console.log(updatedRow);

        let workspaceTags;

        if (workspace) {
            workspaceTags = workspace.workspaceTags;
        }

        const thisTagExistsRes: any = await tagExists(tag);
        console.log(thisTagExistsRes);

        if (!thisTagExistsRes.data.tagExists) {
            const filteredWorkspaceTags = workspaceTags?.filter((item: TTag) => {
                return item.name !== tag.name;
            });
            const newUpdatedWorkspace: any = { ...workspace, workspaceTags: filteredWorkspaceTags };

            await updateWorkspace(newUpdatedWorkspace);
            await deleteTag(tag);
        }
    };

    return (
        <SideBarLayout linkItems={LinkItems}>
            <Box>
                {/* <Flex
                    minH={"100vh"}
                    // justify={"center"}
                    bg={"#eff2f5"}
                > */}
                <Container maxW={"full"} mt={{ base: 4, sm: 0 }}>
                    <Box mb={{ base: "15px" }}>
                        <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                            <>
                                {!isFetching ? (
                                    <>
                                        <Link to={`/workspaces/${localStorage.getItem("workspaceId")}`}>
                                            <Text
                                                display={"inline"}
                                                textDecor={"underline"}
                                            >{`${workspace?.name}`}</Text>
                                        </Link>

                                        <Text display={"inline"}>{" / Documents"}</Text>
                                    </>
                                ) : null}
                            </>
                        </Heading>
                        <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                            Upload files or create them with a Rich-Text editor.
                        </Text>
                    </Box>

                    <Flex>
                        <Spacer />
                        <Card w={"150px"}>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    bgColor={"white"}
                                    color={"rgb(123, 128, 154)"}
                                    rightIcon={<ChevronDownIcon />}
                                >
                                    Actions
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            uploadOnOpen();
                                            setDuplicateFiles([]);
                                        }}
                                    >
                                        Upload files
                                    </MenuItem>
                                    <MenuItem onClick={createOnOpen}>Create doc</MenuItem>
                                </MenuList>
                            </Menu>
                        </Card>
                    </Flex>
                    <Card mt={"10px"}>
                        <CardBody>
                            {documents?.length || 0 > 0 ? (
                                <TableContainer>
                                    <Table size={"sm"} style={{ tableLayout: "fixed" }}>
                                        <Thead>
                                            <Tr>
                                                <Th width={"300px"}>Filename</Th>
                                                <Th width={"180px"}>Uploaded by</Th>
                                                <Th width={"180px"}>Size</Th>
                                                <Th width={"100px"}>Actions</Th>
                                                <Th>Tags</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {documents?.map((document, index) => {
                                                console.log(document);
                                                return (
                                                    <Tr key={index}>
                                                        <Td>
                                                            <Flex>
                                                                <Box pt={"0px"} mr={"6px"}>
                                                                    <IconContext.Provider value={{ color: "#7b809a" }}>
                                                                        {getIcon(document.ext || "")}
                                                                    </IconContext.Provider>
                                                                </Box>
                                                                {document.type === "upload" ? (
                                                                    <Text color={"rgb(123, 128, 154)"}>
                                                                        <a href={document.url} target="_blank">
                                                                            {document.filename}
                                                                        </a>
                                                                    </Text>
                                                                ) : (
                                                                    <UpdateModal document={document} />
                                                                )}
                                                            </Flex>
                                                        </Td>
                                                        <Td>
                                                            <Text
                                                                color={"rgb(123, 128, 154)"}
                                                                fontSize={"14px"}
                                                            >{`${document.createdBy.firstname} ${document.createdBy.lastname}`}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                                                                {document.file ? document.file.size : ""}
                                                            </Text>
                                                        </Td>
                                                        <Td>
                                                            <Text
                                                                p={"2px"}
                                                                onClick={deleteOnOpen}
                                                                cursor={"pointer"}
                                                                color={"rgb(123, 128, 154)"}
                                                                fontSize={"12px"}
                                                                _hover={{ color: "red" }}
                                                            >
                                                                <FaRegTrashAlt />
                                                            </Text>
                                                        </Td>
                                                        <AlertDialog
                                                            isOpen={deleteIsOpen}
                                                            leastDestructiveRef={cancelRef}
                                                            onClose={deleteOnClose}
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
                                                                        <Button ref={cancelRef} onClick={deleteOnClose}>
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            colorScheme="red"
                                                                            onClick={() =>
                                                                                handleDeleteDocument(document)
                                                                            }
                                                                            ml={3}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialogOverlay>
                                                        </AlertDialog>
                                                        <Td>
                                                            <Box overflow={"revert"}>
                                                                <Flex>
                                                                    <TagsModal
                                                                        tagType={"document"}
                                                                        data={document}
                                                                        tags={document.tags}
                                                                        update={updateDocument}
                                                                        workspaceId={document?.workspace || ""}
                                                                    />
                                                                    {document.tags !== undefined
                                                                        ? document.tags.map(
                                                                              (tag: TTag, index: number) => {
                                                                                  return (
                                                                                      <>
                                                                                          <WrapItem key={index}>
                                                                                              <Tag
                                                                                                  size={"sm"}
                                                                                                  variant="subtle"
                                                                                                  colorScheme="blue"
                                                                                                  mr={"5px"}
                                                                                                  zIndex={1000}
                                                                                              >
                                                                                                  <TagLabel pb={"2px"}>
                                                                                                      {tag.name}
                                                                                                  </TagLabel>
                                                                                                  <TagCloseButton
                                                                                                      onClick={() =>
                                                                                                          handleCloseTagButtonClick(
                                                                                                              document,
                                                                                                              tag
                                                                                                          )
                                                                                                      }
                                                                                                      zIndex={1000}
                                                                                                  />
                                                                                              </Tag>
                                                                                          </WrapItem>
                                                                                      </>
                                                                                  );
                                                                              }
                                                                          )
                                                                        : null}
                                                                </Flex>
                                                            </Box>
                                                        </Td>
                                                    </Tr>
                                                );
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Text color={"rgb(123, 128, 154)"}>You currently have no uploads.</Text>
                            )}
                        </CardBody>
                    </Card>
                </Container>
                {/* </Flex> */}
            </Box>
            {/*
             ***************************** UPLOAD MODAL ********************************************
             ***************************************************************************************
             */}
            <Modal isOpen={uploadIsOpen} onClose={uploadOnClose}>
                <ModalOverlay onClick={handleUploadOnClose} />
                <ModalContent>
                    <ModalHeader>Upload Files</ModalHeader>
                    <ModalCloseButton onClick={handleUploadOnClose} />
                    <ModalBody>
                        {createIsLoading || documentsIsFetching ? <Progress size="xs" isIndeterminate /> : null}
                        <Input
                            type="file"
                            // accept="image/png, image/jpeg, image/jpg"
                            size={"md"}
                            p={"1px"}
                            mt={"6px"}
                            border={"none"}
                            onChange={handleFileChange}
                            multiple={true}
                            onClick={() => {
                                setDuplicateFiles([]);
                            }}
                        />

                        <Box pt={"5px"}>
                            {duplicateFiles.length > 0 ? (
                                <Text color={"rgb(123, 128, 154)"} mb={"10px"}>
                                    The following files have already been uploaded:
                                </Text>
                            ) : (
                                <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                                    Limit: 50 per upload
                                </Text>
                            )}
                            {documents?.map((document, index) => {
                                console.log(duplicateFiles);
                                return (
                                    <Box key={index}>
                                        {duplicateFiles.includes(document.filename) ? (
                                            <Flex>
                                                <Box pt={"6px"} mr={"5px"} fontSize={"14px"}>
                                                    <Text color={"rgb(123, 128, 154)"}>{getIcon(document.type)}</Text>
                                                </Box>
                                                <Text color={"rgb(123, 128, 154)"}>{document.filename}</Text>
                                            </Flex>
                                        ) : null}
                                    </Box>
                                );
                            })}
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <PrimaryButton onClick={() => handleUploadClick()} isDisabled={duplicateFiles.length > 0}>
                            UPLOAD
                        </PrimaryButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/*
             ******************* CREATE DOCUMENT DRAWER ********************************************
             ***************************************************************************************
             */}
            <PrimaryDrawer isOpen={createIsOpen} onClose={createOnClose} title={"Create doc"} size="full">
                <Box pb={"20px"}>
                    <Text mb={"5px"}>Document name</Text>
                    <Input
                        value={createdDocName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCreatedDocName(event.target.value)}
                    />
                </Box>
                <Text mb={"5px"}>Content</Text>
                <Editor
                    apiKey={import.meta.env.VITE_EDITOR_KEY}
                    onInit={(evt, editor) => {
                        console.log(evt);
                        editorRef.current = editor;
                    }}
                    onEditorChange={(a) => {
                        setEditorValue(a);
                    }}
                    // initialValue="<p>This is the initial content of the editor.</p>"
                    value={editorValue}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            "a11ychecker",
                            "advlist",
                            "advcode",
                            "advtable",
                            "autolink",
                            "checklist",
                            "export",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "powerpaste",
                            "fullscreen",
                            "formatpainter",
                            "insertdatetime",
                            "media",
                            "table",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | casechange blocks | bold italic backcolor | " +
                            "alignleft aligncenter alignright alignjustify | " +
                            "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                        content_style: " .tox-menu {z-index: 10000000000 !important} ",
                    }}
                />
                <Flex mt={"10px"}>
                    <Spacer />
                    <PrimaryButton onClick={handleDocumentClick}>SAVE</PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </SideBarLayout>
        // </Layout>
    );
};

export default View;
