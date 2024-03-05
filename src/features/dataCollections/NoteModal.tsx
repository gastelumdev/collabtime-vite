import React, { useEffect, useState } from 'react';
import { INote, TRow } from '../../types';
import {
    Box,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { FaRegStickyNote } from 'react-icons/fa';
import { CgAttachment } from 'react-icons/cg';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { IconContext } from 'react-icons';
import { formatTime } from '../../utils/helpers';
import { useGetOneWorkspaceQuery, useGetUserQuery, useUploadDocsMutation, useUploadPersistedDocsMutation } from '../../app/services/api';
import { io } from 'socket.io-client';

interface IProps {
    row: TRow;
    updateRow?: any;
    rowCallUpdate?: any;
}

const NoteModal = ({ row, updateRow }: IProps) => {
    const { isOpen: notesIsOpen, onOpen: notesOnOpen, onClose: notesOnClose } = useDisclosure();
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: workspace } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');

    const [uploadDocs] = useUploadDocsMutation();
    const [uploadPersistedDocs] = useUploadPersistedDocsMutation();

    // const [data, setData] = useState<TRow>(row);
    const [note, setNote] = useState<INote>({
        content: '',
        owner: `${user?.firstname} ${user?.lastname}`,
        createdAt: '',
        read: false,
        people: [],
        images: [],
    });
    const [files, setFiles] = useState<FileList | []>([]);
    const [hasUnreadItems, setHasUnreadItems] = useState<boolean>();

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update row', () => {
            setHasUnreadItems(false);
            setUnreadItems();
            // rowCallUpdate(null);
            // setNotifications(callNotificationsUpdate(priority) as any);
        });

        return () => {
            socket.disconnect();
        };
    }, [row]);

    useEffect(() => {
        setUnreadItems();
    }, [row]);

    const setUnreadItems = () => {
        for (const note of row.notesList || []) {
            for (const people of note.people) {
                if (people.email == user?.email) {
                    setHasUnreadItems(true);
                }
            }
        }
    };

    const handleOpen = () => {
        notesOnOpen();

        if (hasUnreadItems) {
            const rowCopy = row;
            let filteredPeople: any = [];
            let newNote = [];
            for (const note of rowCopy.notesList || []) {
                filteredPeople = note.people.filter((item) => {
                    return item.email != user?.email;
                });
                newNote.push({ ...note, people: filteredPeople });
            }

            const result = { ...rowCopy, notesList: newNote };

            updateRow(result);

            setHasUnreadItems(false);
        }
    };

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote({ ...note, content: event.target.value });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(event.target.files);
            // const images = note.images;
            // setNote({ ...note, images: [...images, event.target.files[0].name] });
        }
    };

    const onClose = () => {
        setNote({
            content: '',
            owner: `${user?.firstname} ${user?.lastname}`,
            createdAt: '',
            read: false,
            people: [],
            images: [],
        });
        setFiles([]);
        notesOnClose();
    };

    const handleNoteClick = async () => {
        const formdata: FormData = new FormData();
        for (let i = 0; i < (files?.length || 0); i++) {
            formdata.append('docs', files[i]);
        }
        const res: any = await uploadDocs(formdata);
        const persistedRes: any = await uploadPersistedDocs(formdata);

        const fileUrls = [];

        for (let i = 0; i < res.data.files.length; i++) {
            if (res.data.files[i].url && persistedRes.data.files[i].url && res.data.files[i].url === persistedRes.data.files[i].url) {
                fileUrls.push(res.data.files[i].url);
            }
        }

        setNote({
            ...note,
            createdAt: new Date().toISOString(),
            people: workspace?.members || [],
            images: fileUrls,
        });

        const dataCopy = row;
        const notesList = dataCopy.notesList;

        const result = [
            ...notesList,
            {
                ...note,
                createdAt: new Date().toISOString(),
                people: workspace?.members || [],
                images: fileUrls,
            },
        ];

        updateRow({ ...row, notesList: result });

        setNote({
            content: '',
            owner: `${user?.firstname} ${user?.lastname}`,
            createdAt: '',
            read: false,
            people: [],
            images: [],
        });
        setFiles([]);
        notesOnClose();
    };

    return (
        <>
            <Box ml={'10px'} pt={'1px'} onClick={handleOpen} cursor={'pointer'}>
                <IconContext.Provider
                    // value={{ color: data.notesList.length > 0 ? "#cccccc" : "#16b2fc", size: "16px" }}
                    value={{
                        color: row?.notesList.length < 1 ? '#cccccc' : hasUnreadItems ? '#ffa507' : '#16b2fc',
                        size: '15px',
                    }}
                >
                    <FaRegStickyNote
                        style={{
                            color: row?.notesList.length < 1 ? '#cccccc' : hasUnreadItems ? '#ffa507' : '#16b2fc',
                            size: '30px',
                        }}
                    />
                </IconContext.Provider>
            </Box>
            <Modal isOpen={notesIsOpen} onClose={notesOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Notes</ModalHeader>
                    <ModalCloseButton onClick={onClose} />
                    <ModalBody>
                        <>{console.log(row)}</>
                        {row.notesList.map((note, index) => {
                            return (
                                <Box key={index} mb={'20px'} px={'6px'}>
                                    <Flex mb={'5px'}>
                                        <Text fontSize={'14px'}>{`${note.owner} - `}</Text>
                                        <Text ml={'3px'} fontSize={'12px'} pt={'2px'}>
                                            {formatTime(new Date(note.createdAt))}
                                        </Text>
                                        <Spacer />
                                        {(note.images || []).map((image, index) => {
                                            if (image) {
                                                return (
                                                    <a key={index} href={`${image}`} target="_blank">
                                                        <Flex>
                                                            <Text pt={'5px'} mr={'3px'}>
                                                                <CgAttachment color={'#16b2fc'} fontSize={'12px'} />
                                                            </Text>
                                                            <Text fontSize={'12px'} color={'#16b2fc'} mt={'2px'}>
                                                                Attachment
                                                            </Text>
                                                        </Flex>
                                                    </a>
                                                );
                                            }
                                            return null;
                                        })}
                                    </Flex>
                                    <Text fontSize={'14px'}>{note.content}</Text>
                                </Box>
                            );
                        })}
                        <Textarea
                            value={note.content}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleNoteChange(event)}
                            placeholder={'Enter notes...'}
                            size={'sm'}
                            rows={10}
                        />
                        <Input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            size={'md'}
                            p={'1px'}
                            mt={'6px'}
                            border={'none'}
                            onChange={handleFileChange}
                            // multiple
                        />
                    </ModalBody>

                    <ModalFooter>
                        <PrimaryButton onClick={() => handleNoteClick()}>SAVE</PrimaryButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NoteModal;
