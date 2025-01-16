import {
    Box,
    Center,
    Divider,
    Flex,
    Grid,
    GridItem,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Progress,
    Spacer,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
    useCreateDocumentMutation,
    // useDeleteDocumentMutation,
    useGetDocumentsQuery,
    useUploadDocsMutation,
    useUploadPersistedDocsMutation,
} from '../../app/services/api';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { FaRegFileAlt, FaRegFileExcel, FaRegImage } from 'react-icons/fa';
import { TDocument } from '../../types';
import { RiAttachmentLine } from 'react-icons/ri';
import { CloseIcon } from '@chakra-ui/icons';
import DocDrawer from './DocDrawer';
import UpdateDocumentModal from './UpdateDocumentModal';
import { emptyDataCollectionPermissions } from '../../features/workspaces/UserGroups';
import DeleteFileAlert from '../../features/documents/DeleteFileAlert';
// import DeleteFileAlert from '../../features/documents/DeleteFileAlert';

interface IProps {
    rowDocuments: TDocument[];
    getDocs: any;
    getUpdatedDoc: any;
    removeDoc?: any;
    permissions?: any;
}

const UploadModal = ({ rowDocuments, getDocs, getUpdatedDoc, removeDoc, permissions = emptyDataCollectionPermissions }: IProps) => {
    const { data: documents } = useGetDocumentsQuery(null);
    const { isOpen: uploadIsOpen, onOpen: uploadOnOpen, onClose: uploadOnClose } = useDisclosure();

    const [createDocument, { isLoading: createIsLoading }] = useCreateDocumentMutation();
    // const [updateCell] = useUpdateCellMutation();
    const [uploadPersistedDocs] = useUploadPersistedDocsMutation();
    const [uploadDocs] = useUploadDocsMutation();

    const [files, setFiles] = useState<FileList | []>([]);
    const [duplicateFiles, setDuplicateFiles] = useState<string[]>([]);

    const [currentFiles, setCurrentFiles] = useState(rowDocuments);
    const [existingFiles, setExistingFiles] = useState(documents);

    useEffect(() => {
        setCurrentFiles(rowDocuments);
    }, [rowDocuments]);

    useEffect(() => {
        const currentFileIds = currentFiles.map((currentFile) => {
            return currentFile._id;
        });

        const filteredFiles = documents?.filter((document) => {
            return !currentFileIds.includes(document._id);
        });
        setExistingFiles(filteredFiles);
    }, [documents]);

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

                // uploadOnClose();

                setCurrentFiles((prev) => {
                    return [...prev, ...documentsCreated];
                });

                getDocs(documentsCreated);
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

    const addExistingFile = (document: TDocument) => {
        setCurrentFiles((prev) => {
            return [...prev, document];
        });

        setExistingFiles((prev) => {
            return prev?.filter((prevFile: any) => {
                return prevFile._id !== document._id;
            });
        });

        getDocs([document]);
    };

    const updateDoc = (document: TDocument) => {
        setCurrentFiles((prev) =>
            prev.map((prevDoc) => {
                return prevDoc._id === document._id ? document : prevDoc;
            })
        );

        getUpdatedDoc(document);
    };

    const handleRemoveDoc = (document: TDocument) => {
        setCurrentFiles((prev) =>
            prev.filter((prevDoc) => {
                return prevDoc._id !== document._id;
            })
        );

        setExistingFiles((prevDocs: any) => {
            return [...prevDocs, document];
        });

        removeDoc(document);
    };

    return (
        <>
            {/* <MenuItem
                onClick={() => {
                    uploadOnOpen();
                    setDuplicateFiles([]);
                }}
            >
                Upload files
            </MenuItem> */}
            <Box
                cursor={'pointer'}
                onClick={() => {
                    uploadOnOpen();
                    setDuplicateFiles([]);
                }}
            >
                <Text color={currentFiles.length < 1 || !permissions.docs.view ? '#cccccc' : '#16b2fc'}>
                    <RiAttachmentLine />
                </Text>
            </Box>
            <Modal isOpen={uploadIsOpen} onClose={uploadOnClose} size={'6xl'}>
                <ModalOverlay onClick={handleUploadOnClose} />
                <ModalContent>
                    <ModalCloseButton onClick={handleUploadOnClose} />
                    <ModalHeader fontSize={'16px'}>Files</ModalHeader>
                    <ModalBody>
                        {currentFiles !== undefined && permissions.docs.view ? (
                            currentFiles !== undefined && currentFiles.length > 0 ? (
                                currentFiles.map((rowDoc, index) => {
                                    return (
                                        <Flex key={index}>
                                            <Box mb={'6px'} cursor={'pointer'}>
                                                {rowDoc.type === 'upload' ? (
                                                    <Text fontSize={'14px'} textOverflow={'ellipsis'} overflow={'hidden'}>
                                                        <a href={rowDoc.url} target="_blank">
                                                            {rowDoc.filename}
                                                        </a>
                                                    </Text>
                                                ) : (
                                                    <UpdateDocumentModal document={rowDoc} updateDoc={updateDoc} />
                                                )}
                                            </Box>
                                            <Spacer />
                                            {permissions.docs.delete ? (
                                                <>
                                                    <Box pt={'4px'} cursor={'pointer'} onClick={() => handleRemoveDoc(rowDoc)}>
                                                        <Text fontSize={'10px'}>
                                                            <CloseIcon />
                                                        </Text>
                                                    </Box>
                                                    <DeleteFileAlert document={rowDoc} fromRow={true} handleRemoveDoc={handleRemoveDoc} />
                                                </>
                                            ) : null}
                                        </Flex>
                                    );
                                })
                            ) : (
                                <Text>This row has no files.</Text>
                            )
                        ) : (
                            <Text>No access.</Text>
                        )}
                    </ModalBody>
                    {/* <ModalHeader fontSize={'16px'}>Upload Files</ModalHeader> */}

                    {permissions.docs.create ? (
                        <>
                            <Divider mt={'20px'} mb={'20px'} />
                            <ModalBody>
                                <Grid templateColumns={'50% 48%'} gap={3}>
                                    <GridItem h={'260px'} border={'1px solid #edf1f6'} borderRadius={'5px'} p={'10px'}>
                                        <Box>
                                            {createIsLoading ? <Progress size="xs" isIndeterminate /> : null}
                                            <Center>
                                                <Box>
                                                    <Input
                                                        type="file"
                                                        // accept="image/png, image/jpeg, image/jpg"
                                                        size={'sm'}
                                                        p={'1px'}
                                                        mt={'6px'}
                                                        mb={'10px'}
                                                        // border={'none'}
                                                        onChange={handleFileChange}
                                                        multiple={true}
                                                        onClick={() => {
                                                            setDuplicateFiles([]);
                                                        }}
                                                    />
                                                </Box>
                                            </Center>
                                            <Center>
                                                <Box pt={'5px'} mb={'20px'}>
                                                    {duplicateFiles.length > 0 ? (
                                                        <Text color={'rgb(123, 128, 154)'} mb={'10px'}>
                                                            The following files have already been uploaded:
                                                        </Text>
                                                    ) : (
                                                        <Text color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                                                            Limit: 50 per upload
                                                        </Text>
                                                    )}
                                                    {documents?.map((document: TDocument, index) => {
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
                                            </Center>
                                            <Center>
                                                <PrimaryButton onClick={() => handleUploadClick()} isDisabled={duplicateFiles.length > 0}>
                                                    UPLOAD
                                                </PrimaryButton>
                                            </Center>
                                        </Box>
                                    </GridItem>
                                    <GridItem h={'160px'} border={'1px solid #edf1f6'} borderRadius={'5px'} p={'10px'} pt={'30px'}>
                                        <Center mb={'20px'}>
                                            <Text>Create Document</Text>
                                        </Center>
                                        <Center>
                                            <DocDrawer getDocs={getDocs} documents={documents} />
                                        </Center>
                                    </GridItem>
                                </Grid>
                                <Divider mt={'20px'} />
                            </ModalBody>
                        </>
                    ) : null}

                    {permissions.docs.update ? (
                        <>
                            <ModalHeader fontSize={'16px'}>Add existing files</ModalHeader>
                            <ModalBody mb={'10px'}>
                                {existingFiles?.map((document, index) => {
                                    return (
                                        <Box key={index} mb={'6px'} onClick={() => addExistingFile(document)} cursor={'pointer'}>
                                            <Text fontSize={'14px'}>{document.filename}</Text>
                                        </Box>
                                    );
                                })}
                            </ModalBody>
                        </>
                    ) : null}
                </ModalContent>
            </Modal>
        </>
    );
};

export default UploadModal;
