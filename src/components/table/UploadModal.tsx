import {
    Box,
    Center,
    Container,
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
import { FaFileAlt, FaFileCsv, FaFileExcel, FaFileImage, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { TDocument } from '../../types';
import { RiAttachmentLine } from 'react-icons/ri';
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
    Icon?: any;
    iconSize?: string;
    allowed?: boolean;
}

const UploadModal = ({
    rowDocuments,
    getDocs,
    getUpdatedDoc,
    removeDoc,
    permissions = emptyDataCollectionPermissions,
    Icon = null,
    iconSize = '14px',
    allowed = false,
}: IProps) => {
    const { data: documents } = useGetDocumentsQuery(null);
    const { isOpen: uploadIsOpen, onOpen: uploadOnOpen, onClose: uploadOnClose } = useDisclosure();

    const [createDocument, { isLoading: createIsLoading }] = useCreateDocumentMutation();
    // const [updateCell] = useUpdateCellMutation();
    const [uploadPersistedDocs] = useUploadPersistedDocsMutation();
    const [uploadDocs] = useUploadDocsMutation();

    const [files, setFiles] = useState<FileList | []>([]);
    const [duplicateFiles, setDuplicateFiles] = useState<string[]>([]);

    const [currentFiles, setCurrentFiles] = useState(rowDocuments);
    // const [existingFiles, setExistingFiles] = useState(documents);
    // const [fileInputIsEmpty, setFileInputIsEmpty] = useState(true);

    useEffect(() => {
        setCurrentFiles(rowDocuments);
    }, [rowDocuments]);

    // useEffect(() => {
    //     const currentFileIds = currentFiles.map((currentFile) => {
    //         return currentFile._id;
    //     });

    //     const filteredFiles = documents?.filter((document) => {
    //         return !currentFileIds.includes(document._id);
    //     });
    //     setExistingFiles(filteredFiles);
    // }, [documents]);

    const getIcon = (extension: string) => {
        const color = 'rgb(35, 148, 234)';
        if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') return <FaFileImage color={color} size={'34px'} />;
        if (extension === 'xlsx') return <FaFileExcel color={color} size={'34px'} />;
        if (extension === 'csv') return <FaFileCsv color={color} size={'34px'} />;
        if (extension === 'docx') return <FaFileWord color={color} size={'34px'} />;
        if (extension === 'pdf') return <FaFilePdf color={color} size={'34px'} />;
        return <FaFileAlt color={color} size={'34px'} />;
    };

    const handleUploadOnClose = () => {
        uploadOnClose();
        setDuplicateFiles([]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuplicateFiles([]);
        const newFiles = [];
        if (event.target.files) {
            let fileMap = {};
            for (const file of event.target.files) {
                fileMap = { ...fileMap, [file.name]: file.name };
            }

            const duplicateFilesCopy = duplicateFiles;

            for (const i in rowDocuments || []) {
                if (rowDocuments) {
                    if (fileMap.hasOwnProperty(rowDocuments[i].filename)) {
                        duplicateFilesCopy.push(rowDocuments[i].filename);
                    }
                }
            }

            for (const file of event.target.files) {
                if (duplicateFilesCopy.includes(file.name)) {
                    newFiles.push(file);
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

    // const addExistingFile = (document: TDocument) => {
    //     setCurrentFiles((prev) => {
    //         return [...prev, document];
    //     });

    //     setExistingFiles((prev) => {
    //         return prev?.filter((prevFile: any) => {
    //             return prevFile._id !== document._id;
    //         });
    //     });

    //     getDocs([document]);
    // };

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

        // setExistingFiles((prevDocs: any) => {
        //     return [...prevDocs, document];
        // });

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
                cursor={allowed ? 'pointer' : 'default'}
                onClick={
                    allowed
                        ? () => {
                              uploadOnOpen();
                              setDuplicateFiles([]);
                          }
                        : () => {}
                }
            >
                <Text color={!permissions.docs.view || !allowed ? 'gray.200' : currentFiles.length < 1 ? 'gray.300' : '#16b2fc'} fontSize={iconSize}>
                    {Icon ? Icon : <RiAttachmentLine />}
                </Text>
            </Box>
            <Modal isOpen={uploadIsOpen} onClose={uploadOnClose} size={'full'}>
                <ModalOverlay onClick={handleUploadOnClose} />
                <ModalContent>
                    <ModalCloseButton onClick={handleUploadOnClose} />
                    <ModalHeader fontSize={'16px'} bgColor={'#f6f8fa'}>
                        Files
                    </ModalHeader>
                    <ModalBody bgColor={'#f6f8fa'}>
                        <Container maxW={'container.xl'}>
                            {permissions.docs.create || allowed ? (
                                <Grid templateColumns={'50% 48%'} gap={3}>
                                    <GridItem h={'300px'} border={'1px solid rgb(226, 234, 243)'} borderRadius={'5px'} p={'10px'} pt={'30px'} bgColor={'white'}>
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
                                                        <Center>
                                                            <Text fontSize={'14px'} color={'rgb(255, 57, 57)'} mb={'10px'}>
                                                                The files below already exist. Choose files again.
                                                            </Text>
                                                        </Center>
                                                    ) : null}
                                                    <Box maxH={'118px'} overflowY={duplicateFiles.length >= 5 ? 'scroll' : 'auto'}>
                                                        {documents?.map((document: TDocument, index) => {
                                                            return (
                                                                <Box key={index} mb={'4px'} borderRadius={'md'}>
                                                                    {duplicateFiles.includes(document.filename) ? (
                                                                        <Flex border={'1px solid rgb(197, 200, 218)'} px={'8px'} py={'2px'}>
                                                                            <Box pt={'6px'} mr={'5px'} fontSize={'14px'}>
                                                                                <Text color={'rgb(123, 128, 154)'}>{getIcon(document.type)}</Text>
                                                                            </Box>
                                                                            <Box h={'24px'} w={'400px'} overflow={'hidden'} fontSize={'12px'} pt={'2px'}>
                                                                                <Text
                                                                                    color={'rgb(0, 0, 0)'}
                                                                                    overflow={'hidden'}
                                                                                    whiteSpace={'nowrap'}
                                                                                    textOverflow={'ellipsis'}
                                                                                >
                                                                                    {document.filename}
                                                                                </Text>
                                                                            </Box>
                                                                        </Flex>
                                                                    ) : null}
                                                                </Box>
                                                            );
                                                        })}
                                                    </Box>
                                                </Box>
                                            </Center>
                                            <Center>
                                                <PrimaryButton onClick={() => handleUploadClick()} isDisabled={duplicateFiles.length > 0 ? true : false}>
                                                    UPLOAD
                                                </PrimaryButton>
                                            </Center>
                                        </Box>
                                    </GridItem>
                                    <GridItem h={'300px'} border={'1px solid rgb(226, 234, 243)'} borderRadius={'5px'} p={'10px'} pt={'30px'} bgColor={'white'}>
                                        <Center mb={'20px'}>
                                            <Text>Create Document</Text>
                                        </Center>
                                        <Center>
                                            <DocDrawer getDocs={getDocs} documents={documents} />
                                        </Center>
                                    </GridItem>
                                </Grid>
                            ) : null}
                            <Grid templateColumns={'50% 48%'} gap={3} mt={3}>
                                <GridItem p={'10px'}>
                                    <Text fontWeight={'semibold'} mb={'10px'}>
                                        Uploads
                                    </Text>
                                    {currentFiles !== undefined && (permissions.docs.view || allowed) ? (
                                        currentFiles !== undefined && currentFiles.length > 0 ? (
                                            currentFiles.map((rowDoc, index) => {
                                                console.log(rowDoc);
                                                if (rowDoc.type !== 'upload') return null;
                                                return (
                                                    <Flex bgColor={'white'} mb={'8px'} p={'12px'} key={index} boxShadow={'xs'}>
                                                        <Box pt={'6px'} mr={'5px'} fontSize={'34px'} marginRight={'20px'}>
                                                            <Text color={'rgb(123, 128, 154)'}>{getIcon(rowDoc.ext as string)}</Text>
                                                        </Box>
                                                        <Box>
                                                            <Box cursor={'pointer'} mb={'3px'}>
                                                                <Text
                                                                    fontSize={'14px'}
                                                                    fontWeight={'semibold'}
                                                                    // color={'rgb(0, 128, 219)'}
                                                                    // textDecor={'underline'}
                                                                    textOverflow={'ellipsis'}
                                                                    overflow={'hidden'}
                                                                    _hover={{ textDecor: 'underline' }}
                                                                >
                                                                    <a href={rowDoc.url} target="_blank">
                                                                        {rowDoc.filename}
                                                                    </a>
                                                                </Text>
                                                            </Box>
                                                            <Text
                                                                fontSize={'12px'}
                                                                color={'gray'}
                                                            >{`Created by: ${rowDoc.createdBy.firstname} ${rowDoc.createdBy.lastname}`}</Text>
                                                        </Box>
                                                        <Spacer />
                                                        {permissions.docs.delete || allowed ? (
                                                            <Box pt={'14px'} pr={'8px'}>
                                                                {/* <Box cursor={'pointer'} onClick={() => handleRemoveDoc(rowDoc)}>
                                                                <Text fontSize={'10px'}>
                                                                    <CloseIcon />
                                                                </Text>
                                                            </Box> */}
                                                                <DeleteFileAlert document={rowDoc} fromRow={true} handleRemoveDoc={handleRemoveDoc} />
                                                            </Box>
                                                        ) : null}
                                                    </Flex>
                                                );
                                            })
                                        ) : (
                                            <Box pt={'30px'}>
                                                <Center>
                                                    <Text>This row has no files.</Text>
                                                </Center>
                                                <Center>
                                                    <Text color={'gray'}>Upload a file below to add a file to this row.</Text>
                                                </Center>
                                            </Box>
                                        )
                                    ) : (
                                        <Text>No access.</Text>
                                    )}
                                </GridItem>
                                <GridItem h={'500px'} p={'10px'}>
                                    <Text fontWeight={'semibold'} mb={'10px'}>
                                        Documents
                                    </Text>
                                    {currentFiles !== undefined && (permissions.docs.view || allowed) ? (
                                        currentFiles !== undefined && currentFiles.length > 0 ? (
                                            currentFiles.map((rowDoc, index) => {
                                                if (rowDoc.type !== 'created') return null;
                                                return (
                                                    <Flex key={index} bgColor={'white'} mb={'8px'} p={'12px'} boxShadow={'xs'}>
                                                        <Box pt={'6px'} mr={'5px'} fontSize={'34px'} marginRight={'20px'}>
                                                            <Text color={'rgb(123, 128, 154)'} fontSize={'lg'}>
                                                                {getIcon(rowDoc.ext as string)}
                                                            </Text>
                                                        </Box>
                                                        <Box>
                                                            <Box mb={'6px'} cursor={'pointer'}>
                                                                <UpdateDocumentModal document={rowDoc} updateDoc={updateDoc} />
                                                            </Box>
                                                            <Text
                                                                fontSize={'12px'}
                                                                color={'gray'}
                                                            >{`Created by: ${rowDoc.createdBy.firstname} ${rowDoc.createdBy.lastname}`}</Text>
                                                        </Box>
                                                        <Spacer />
                                                        {permissions.docs.delete || allowed ? (
                                                            <Box pt={'14px'} pr={'8px'}>
                                                                {/* <Box pt={'4px'} cursor={'pointer'} onClick={() => handleRemoveDoc(rowDoc)}>
                                                                <Text fontSize={'10px'}>
                                                                    <CloseIcon />
                                                                </Text>
                                                            </Box> */}
                                                                <DeleteFileAlert document={rowDoc} fromRow={true} handleRemoveDoc={handleRemoveDoc} />
                                                            </Box>
                                                        ) : null}
                                                    </Flex>
                                                );
                                            })
                                        ) : (
                                            <Box pt={'30px'}>
                                                <Center>
                                                    <Text>This row has no documents.</Text>
                                                </Center>
                                                <Center>
                                                    <Text color={'gray'}>Click create below to create your first document.</Text>
                                                </Center>
                                            </Box>
                                        )
                                    ) : (
                                        <Text>No access.</Text>
                                    )}
                                </GridItem>
                            </Grid>
                        </Container>
                    </ModalBody>
                    {/* <ModalHeader fontSize={'16px'}>Upload Files</ModalHeader> */}

                    {/* {permissions.docs.update ? (
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
                    ) : null} */}
                </ModalContent>
            </Modal>
        </>
    );
};

export default UploadModal;
