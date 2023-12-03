import { Box, Container, Flex, Heading, Input, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import SideBarLayout from "../../components/Layouts/SideBarLayout";
import { IconType } from "react-icons";
import { BsFiletypeDoc, BsPersonWorkspace } from "react-icons/bs";
import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useUploadDocsMutation, useUploadPersistedDocsMutation } from "../../app/services/api";

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
    const [uploadDocs] = useUploadDocsMutation();
    const [uploadPersistedDocs] = useUploadPersistedDocsMutation();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            console.log(event.target.files[0].name);
            setFile(event.target.files[0]);
            // const images = note.images;
            // setNote({ ...note, images: [...images, event.target.files[0].name] });
        }
    };

    const handleNoteClick = async () => {
        const formdata: FormData = new FormData();
        formdata.append("docs", file || "");
        const res: any = await uploadDocs(formdata);
        const persistedRes: any = await uploadPersistedDocs(formdata);

        console.log(res.data);
        console.log(persistedRes.data);
        // const imagesCopy = note.images;

        // setNote({
        //     ...note,
        //     createdAt: new Date().toISOString(),
        //     people: workspace?.members || [],
        //     images: [...imagesCopy, res.data.url],
        // });

        // const dataCopy = row;
        // const notesList = dataCopy.notesList;
        // console.log(dataCopy);

        // const result = [
        //     ...notesList,
        //     {
        //         ...note,
        //         createdAt: new Date().toISOString(),
        //         people: workspace?.members || [],
        //         images: [...imagesCopy, res.data.url],
        //     },
        // ];

        // updateRow({ ...row, notesList: result });

        // setNote({
        //     content: "",
        //     owner: `${user?.firstname} ${user?.lastname}`,
        //     createdAt: "",
        //     read: false,
        //     people: [],
        //     images: [],
        // });
        // setFile(null);
        // notesOnClose();
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

                        <SimpleGrid spacing={6} columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}>
                            <Input
                                type="file"
                                // accept="image/png, image/jpeg, image/jpg"
                                size={"md"}
                                p={"1px"}
                                mt={"6px"}
                                border={"none"}
                                onChange={handleFileChange}
                            />
                            <PrimaryButton onClick={() => handleNoteClick()}>SAVE</PrimaryButton>
                        </SimpleGrid>
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
        // </Layout>
    );
};

export default View;
