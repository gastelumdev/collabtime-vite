import {
    Box,
    Flex,
    Input,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Progress,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useCreateDocumentMutation, useUpdateCellMutation, useUploadDocsMutation, useUploadPersistedDocsMutation } from '../../app/services/api';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { FaRegFileAlt, FaRegFileExcel, FaRegImage } from 'react-icons/fa';
import { TCell, TDocument } from '../../types';

interface IProps {
    documents: TDocument[];
}

const UploadModal = ({ documents }: IProps) => {
    const { isOpen: uploadIsOpen, onOpen: uploadOnOpen, onClose: uploadOnClose } = useDisclosure();

    const [createDocument, { isLoading: createIsLoading }] = useCreateDocumentMutation();
    // const [updateCell] = useUpdateCellMutation();
    const [uploadPersistedDocs] = useUploadPersistedDocsMutation();
    const [uploadDocs] = useUploadDocsMutation();

    const [files, setFiles] = useState<FileList | []>([]);
    const [duplicateFiles, setDuplicateFiles] = useState<string[]>([]);

    const getIcon = (type: string) => {
        if (type === 'jpg' || type === 'png' || type === 'jpeg') return <FaRegImage color={'rgb(123, 128, 154)'} />;
        if (type === 'xlsx') return <FaRegFileExcel color={'rgb(123, 128, 154)'} />;
        return <FaRegFileAlt />;
    };

    const handleUploadOnClose = () => {
        uploadOnClose();
        setDuplicateFiles([]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuplicateFiles([]);
        if (event.target.files) {
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

            setFiles(event.target.files);
            // const images = note.images;
            // setNote({ ...note, images: [...images, event.target.files[0].name] });
        }
    };

    const handleUploadClick = async () => {
        const formdata: FormData = new FormData();
        for (let i = 0; i < (files?.length || 0); i++) {
            formdata.append('docs', files[i]);
        }

        const res: any = await uploadDocs(formdata);
        const persistedRes: any = await uploadPersistedDocs(formdata);

        const documentsCreated: any = [];

        for (let i = 0; i < res.data.files.length; i++) {
            if (res.data.files[i].url && persistedRes.data.files[i].url && res.data.files[i].url === persistedRes.data.files[i].url) {
                let splitFilename = res.data.files[i].file.filename.split('.');
                let ext = splitFilename[splitFilename.length - 1];
                const doc: any = await createDocument({
                    workspace: localStorage.getItem('workspaceId') || '',
                    filename: res.data.files[i].originalname,
                    type: 'upload',
                    originalname: res.data.files[i].originalname,
                    url: res.data.files[i].url,
                    file: res.data.files[i].file,
                    ext: ext,
                    tags: [],
                });

                documentsCreated.push(doc.data);

                uploadOnClose();
            }
        }

        // if (addToCell) {
        //     const cellCopy: any = cell;
        //     const docsCopy: any = cell?.docs;
        //     updateCell({ ...cellCopy, docs: docsCopy.concat(documentsCreated) });
        // }

        // if (create) {
        //     handleDocsChange(columnName, documentsCreated);
        // }
    };

    return (
        <>
            <MenuItem
                onClick={() => {
                    uploadOnOpen();
                    setDuplicateFiles([]);
                }}
            >
                Upload files
            </MenuItem>
            <Modal isOpen={uploadIsOpen} onClose={uploadOnClose}>
                <ModalOverlay onClick={handleUploadOnClose} />
                <ModalContent>
                    <ModalHeader>Upload Files</ModalHeader>
                    <ModalCloseButton onClick={handleUploadOnClose} />
                    <ModalBody>
                        {createIsLoading ? <Progress size="xs" isIndeterminate /> : null}
                        <Input
                            type="file"
                            // accept="image/png, image/jpeg, image/jpg"
                            size={'md'}
                            p={'1px'}
                            mt={'6px'}
                            border={'none'}
                            onChange={handleFileChange}
                            multiple={true}
                            onClick={() => {
                                setDuplicateFiles([]);
                            }}
                        />

                        <Box pt={'5px'}>
                            {duplicateFiles.length > 0 ? (
                                <Text color={'rgb(123, 128, 154)'} mb={'10px'}>
                                    The following files have already been uploaded:
                                </Text>
                            ) : (
                                <Text color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                                    Limit: 50 per upload
                                </Text>
                            )}
                            {documents?.map((document, index) => {
                                return (
                                    <Box key={index}>
                                        {duplicateFiles.includes(document.filename) ? (
                                            <Flex>
                                                <Box pt={'6px'} mr={'5px'} fontSize={'14px'}>
                                                    <Text color={'rgb(123, 128, 154)'}>{getIcon(document.type)}</Text>
                                                </Box>
                                                <Text color={'rgb(123, 128, 154)'}>{document.filename}</Text>
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
        </>
    );
};

export default UploadModal;
