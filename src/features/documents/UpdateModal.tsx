import { Box, Flex, Input, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { TDocument } from '../../types';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { Editor } from '@tinymce/tinymce-react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useEffect, useRef, useState } from 'react';
import { useUpdateDocumentMutation } from '../../app/services/api';

import './styles.css';

interface IProps {
    document: TDocument;
    fontSize?: string;
    color?: string;
    permissions?: any;
}

const UpdateModal = ({
    document,
    fontSize = '13px',
    color = '#666',
    permissions = { view: false, create: false, update: false, delete: false, tag: false },
}: IProps) => {
    const { isOpen: updateDocIsOpen, onOpen: updateDocOnOpen, onClose: updateDocOnClose } = useDisclosure();
    const editorRef = useRef<any>(null);

    const [updateDocument] = useUpdateDocumentMutation();

    const [createdDocName, setCreatedDocName] = useState<string>(document.filename);
    const [editorValue, setEditorValue] = useState<string>(document.value || '');

    useEffect(() => {
        setCreatedDocName(document.filename);
        setEditorValue(document.value || '');
    }, [document]);

    const handleDocumentClick = () => {
        updateDocOnClose();
        updateDocument({
            ...document,
            filename: createdDocName,
            value: editorValue,
        });
    };

    return (
        <>
            <Text
                onClick={() => {
                    updateDocOnOpen();
                }}
                cursor={'pointer'}
                color={color}
                fontSize={fontSize}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
            >
                {document.filename}
            </Text>
            <PrimaryDrawer isOpen={updateDocIsOpen} onClose={updateDocOnClose} title={'Update doc'} size="full">
                <Box pb={'20px'}>
                    <Text mb={'5px'} color={'rgb(123, 128, 154)'}>
                        Document name
                    </Text>
                    <Input
                        value={createdDocName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCreatedDocName(event.target.value)}
                        isReadOnly={!permissions.update}
                    />
                </Box>
                <Text mb={'5px'} color={'rgb(123, 128, 154)'}>
                    Content
                </Text>

                <Editor
                    apiKey={import.meta.env.VITE_EDITOR_KEY}
                    onInit={(evt, editor) => {
                        editorRef.current = editor;
                        evt;
                    }}
                    disabled={!permissions.update}
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
                            'advlist',
                            // "advcode",
                            // "advtable",
                            'autolink',
                            // "checklist",
                            // "export",
                            'lists',
                            'link',
                            'image',
                            'charmap',
                            'preview',
                            'anchor',
                            'searchreplace',
                            'visualblocks',
                            // "powerpaste",
                            'fullscreen',
                            // "formatpainter",
                            'insertdatetime',
                            'media',
                            'table',
                            'help',
                            'wordcount',
                        ],
                        // toolbar:
                        //     "undo redo | casechange blocks | bold italic backcolor | " +
                        //     "alignleft aligncenter alignright alignjustify | " +
                        //     "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                        content_style: ' .tox-menu {z-index: 10000000000 !important} ',
                    }}
                />

                {permissions.update ? (
                    <Flex mt={'10px'}>
                        <Spacer />
                        <PrimaryButton onClick={handleDocumentClick}>SAVE</PrimaryButton>
                    </Flex>
                ) : null}
            </PrimaryDrawer>
        </>
    );
};

export default UpdateModal;
