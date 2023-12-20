import { Box, Flex, Input, MenuItem, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useCreateDocumentMutation } from "../../app/services/api";
import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const DocDrawer = () => {
    const editorRef = useRef<any>(null);
    const { isOpen: createIsOpen, onOpen: createOnOpen, onClose: createOnClose } = useDisclosure();

    const [createDocument] = useCreateDocumentMutation();

    const [createdDocName, setCreatedDocName] = useState<string>("");
    const [editorValue, setEditorValue] = useState<string>("");

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
    return (
        <>
            <MenuItem onClick={createOnOpen}>Create doc</MenuItem>
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
                            // "a11ychecker",
                            "advlist",
                            // "advcode",
                            // "advtable",
                            "autolink",
                            // "checklist",
                            // "export",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            // "powerpaste",
                            "fullscreen",
                            // "formatpainter",
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
        </>
    );
};

export default DocDrawer;
