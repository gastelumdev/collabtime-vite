import { Box, Flex, Input, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useCreateDocumentMutation } from '../../app/services/api';
import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface IProps {
    getDocs: any;
    documents: any;
}

const DocDrawer = ({ getDocs, documents }: IProps) => {
    const editorRef = useRef<any>(null);
    const { isOpen: createIsOpen, onOpen: createOnOpen, onClose: createOnClose } = useDisclosure();

    const [createDocument] = useCreateDocumentMutation();
    // const [updateCell] = useUpdateCellMutation();

    const [createdDocName, setCreatedDocName] = useState<string>('');
    const [editorValue, setEditorValue] = useState<string>('');

    const [isError, setIsError] = useState(false);

    const handleDocumentClick = async () => {
        createOnClose();
        const documentCreated: any = await createDocument({
            workspace: localStorage.getItem('workspaceId') || '',
            filename: createdDocName,
            type: 'created',
            value: editorValue,
            ext: 'created',
            tags: [],
        });

        getDocs([documentCreated.data]);

        setCreatedDocName('');
        setEditorValue('');

        // if (addToCell) {
        //     const cellCopy: any = cell;
        //     const docsCopy: any = cell?.docs;
        //     updateCell({ ...cellCopy, docs: [...docsCopy, documentCreated.data] });
        // }

        // if (create) {
        //     handleDocsChange(columnName, [documentCreated.data]);
        // }
    };

    const handleOnClose = () => {
        setCreatedDocName('');
        setEditorValue('');
        setIsError(false);
        createOnClose();
    };
    return (
        <>
            <PrimaryButton onClick={createOnOpen}>CREATE</PrimaryButton>
            <PrimaryDrawer isOpen={createIsOpen} onClose={handleOnClose} title={'Create doc'} size="full">
                <Box pb={'20px'}>
                    <Flex>
                        <Text mb={'5px'}>Document name</Text>
                        <Text ml={'10px'} color={'red'} fontSize={'14px'}>
                            {isError ? '* Doc name already exists.' : ''}
                        </Text>
                    </Flex>
                    <Input
                        value={createdDocName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCreatedDocName(event.target.value);

                            const documentNames = documents.map((doc: any) => {
                                return doc.filename;
                            });

                            if (documentNames.includes(event.target.value)) {
                                setIsError(true);
                            } else {
                                setIsError(false);
                            }
                        }}
                    />
                </Box>
                <Text mb={'5px'}>Content</Text>
                <Editor
                    apiKey={import.meta.env.VITE_EDITOR_KEY}
                    onInit={(evt, editor) => {
                        editorRef.current = editor;
                        evt;
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
                        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify',
                        // toolbar:
                        //     "undo redo | casechange blocks | bold italic backcolor | " +
                        //     "alignleft aligncenter alignright alignjustify | " +
                        //     "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                        content_style: ' .tox-menu {z-index: 10000000000 !important} ',
                    }}
                />
                <Flex mt={'10px'}>
                    <Spacer />
                    <PrimaryButton onClick={handleDocumentClick} isDisabled={isError}>
                        SAVE
                    </PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default DocDrawer;
