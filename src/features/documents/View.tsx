import {
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    Heading,
    Input,
    List,
    ListItem,
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
    SimpleGrid,
    Spacer,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import "./styles.css";
import SideBarLayout from "../../components/Layouts/SideBarLayout";
import { IconType } from "react-icons";
import { BsFiletypeDoc, BsPersonWorkspace } from "react-icons/bs";
import { BiTable } from "react-icons/bi";
import { FaRegFileAlt, FaRegFileExcel, FaTasks } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { useRef, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import {
    useCreateDocumentMutation,
    useGetDocumentsQuery,
    useUploadDocsMutation,
    useUploadPersistedDocsMutation,
} from "../../app/services/api";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaRegImage } from "react-icons/fa";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import UpdateModal from "./UpdateModal";

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
    const { isOpen: uploadIsOpen, onOpen: uploadOnOpen, onClose: uploadOnClose } = useDisclosure();
    const { isOpen: createIsOpen, onOpen: createOnOpen, onClose: createOnClose } = useDisclosure();

    const { data: documents } = useGetDocumentsQuery(null);
    const [createDocument] = useCreateDocumentMutation();

    const [uploadDocs] = useUploadDocsMutation();
    const [uploadPersistedDocs] = useUploadPersistedDocsMutation();
    const [file, setFile] = useState<File | null>(null);
    const [createdDocName, setCreatedDocName] = useState<string>("");
    const [editorValue, setEditorValue] = useState<string>("");

    const editorRef = useRef<any>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            console.log(event.target.files[0].name);
            setFile(event.target.files[0]);
            // const images = note.images;
            // setNote({ ...note, images: [...images, event.target.files[0].name] });
        }
    };

    const handleUploadClick = async () => {
        const formdata: FormData = new FormData();
        formdata.append("docs", file || "");
        const res: any = await uploadDocs(formdata);
        const persistedRes: any = await uploadPersistedDocs(formdata);

        console.log(res.data);
        console.log(persistedRes.data);

        if (res.data.url && persistedRes.data.url && res.data.url === persistedRes.data.url) {
            let splitFilename = res.data.file.filename.split(".");
            let ext = splitFilename[splitFilename.length - 1];
            createDocument({
                workspace: localStorage.getItem("workspaceId") || "",
                filename: res.data.originalname,
                type: "upload",
                originalname: res.data.originalname,
                url: res.data.url,
                file: res.data.file,
                ext: ext,
            });
        }
    };

    const handleDocumentClick = () => {
        createDocument({
            workspace: localStorage.getItem("workspaceId") || "",
            filename: createdDocName,
            type: "created",
            value: editorValue,
            ext: "created",
        });
    };

    const getIcon = (type: string) => {
        if (type === "jpg" || type === "png" || type === "jpeg") return <FaRegImage />;
        if (type === "xlsx") return <FaRegFileExcel />;
        return <FaRegFileAlt />;
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
                                        Documents
                                    </Heading>
                                    <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                        Upload files or create them with a Rich-Text editor.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pb={"20px"}>{/* <Create addNewWorkspace={addNewWorkspace} /> */}</Box>
                            </Flex>
                        </SimpleGrid>

                        <Card w={"300px"}>
                            <Menu>
                                <MenuButton as={Button} bgColor={"white"} rightIcon={<ChevronDownIcon />}>
                                    Actions
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={uploadOnOpen}>Upload file</MenuItem>
                                    <MenuItem onClick={createOnOpen}>Create doc</MenuItem>
                                </MenuList>
                            </Menu>
                        </Card>
                        <Card mt={"10px"}>
                            <CardBody>
                                {documents?.map((document, index) => {
                                    console.log(document);
                                    return (
                                        <List key={index}>
                                            <ListItem>
                                                <Flex>
                                                    <Box pt={"4px"} mr={"3px"}>
                                                        {getIcon(document.ext || "")}
                                                    </Box>
                                                    {document.type === "upload" ? (
                                                        <Text>
                                                            <a href={document.url} target="_blank">
                                                                {document.filename}
                                                            </a>
                                                        </Text>
                                                    ) : (
                                                        <UpdateModal document={document} />
                                                    )}
                                                </Flex>
                                            </ListItem>
                                        </List>
                                    );
                                })}
                            </CardBody>
                        </Card>
                    </Container>
                </Flex>
            </Box>
            <Modal isOpen={uploadIsOpen} onClose={uploadOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload File</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            type="file"
                            // accept="image/png, image/jpeg, image/jpg"
                            size={"md"}
                            p={"1px"}
                            mt={"6px"}
                            border={"none"}
                            onChange={handleFileChange}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={uploadOnClose}>
                            Close
                        </Button>
                        <PrimaryButton onClick={() => handleUploadClick()}>SAVE</PrimaryButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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
                        // toolbar:
                        //     "undo redo | casechange blocks | bold italic backcolor | " +
                        //     "alignleft aligncenter alignright alignjustify | " +
                        //     "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
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
