import { CloseIcon, InfoIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Input,
    Spacer,
    Text,
    Textarea,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { formatTime } from '../../utils/helpers';
import { useRowCallUpdateMutation } from '../../app/services/api';
import { io } from 'socket.io-client';
// import { useUpdateRowMutation } from '../../app/services/api';

interface IProps {
    row: any;
    handleChange: any;
    allowed: boolean;
}

const RemindersDrawer = ({ row, handleChange, allowed }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const [updateRow] = useUpdateRowMutation();

    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [isDateError, setIsDateError] = useState(false);
    const [isTimeError, setIsTimeError] = useState(false);

    const [rowCallUpdate] = useRowCallUpdateMutation();

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update row', () => {
            rowCallUpdate(null);
            // setNotifications(callNotificationsUpdate(priority) as any);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const checkDateStatus = (dateString: string) => {
        const newDate = new Date(dateString);
        const now = new Date();
        const today = new Date(now.toISOString().split('T')[0]);
        // if (newDate.toISOString().split('T')[0] == now.toISOString().split('T')[0]) {
        //     return 1;
        // }

        if (newDate.getTime() >= today.getTime()) {
            return 1;
        }

        return -1;
    };

    const checkTimeStatus = (dateString: string) => {
        const newDate = new Date(dateString);
        const now = new Date();

        if (newDate.getTime() > now.getTime()) {
            return 1;
        }

        return -1;
    };

    // const formatTime = (isoString: string) => {
    //     return isoString.split('T').join(' ');
    // };

    const handleSave = () => {
        const fullTime = `${date}T${time}`;
        const timeStatus = checkTimeStatus(fullTime);

        if (timeStatus == 1) {
            handleChange({ ...row, reminder: true, reminders: [...row.reminders, { title, comments, date: fullTime }] });
            setIsDateError(false);
        } else {
            setIsDateError(true);
        }

        setDate(null);
        setTime(null);
        setTitle('');
        setComments('');
        setIsDateError(false);
        setIsTimeError(false);

        // onClose();
    };

    const handleDeleteReminder = (reminder: { title: string; comments: string; date: string }) => {
        const remindersCopy = row.reminders;

        const newReminders = remindersCopy.filter((rem: { title: string; comments: string; date: string }) => {
            return rem.date !== reminder.date;
        });

        handleChange({ ...row, reminder: newReminders.length > 0, reminders: newReminders });
    };

    const handleOnClose = () => {
        setDate(null);
        setTime(null);
        setTitle('');
        setComments('');
        setIsDateError(false);
        setIsTimeError(false);

        onClose();
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleCommentsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComments(event.target.value);
    };

    return (
        <>
            <Text
                fontSize={'15px'}
                onClick={allowed ? onOpen : () => {}}
                color={row.reminders !== undefined && row.reminders.length > 0 && allowed ? '#16b2fc' : '#cccccc'}
            >
                <FaRegBell />
            </Text>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={handleOnClose}
                size={'sm'}
                // finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Reminders</DrawerHeader>

                    <DrawerBody>
                        <Box>
                            <Box mb={'14px'}>
                                <Text mb={'4px'}>Title</Text>
                                <Input type={'text'} size={'sm'} value={title} onChange={handleTitleChange} />
                            </Box>
                            <Box mb={'14px'}>
                                <Text mb={'4px'}>Comments</Text>
                                <Textarea size={'sm'} value={comments} onChange={handleCommentsChange} />
                            </Box>
                            <Box mb={'14px'}>
                                <Text mb={'4px'}>Date</Text>
                                <Input
                                    type={'date'}
                                    size={'sm'}
                                    value={date === null ? '' : date}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setDate(event.target.value);

                                        if (checkDateStatus(event.target.value) == -1) {
                                            setIsDateError(true);
                                        } else {
                                            setIsDateError(false);
                                        }
                                    }}
                                />
                            </Box>
                            <Box>
                                <Text mb={'4px'} color={date == null || isDateError ? 'lightgray' : 'inherit'}>
                                    Time
                                </Text>
                                <Input
                                    type={'time'}
                                    size={'sm'}
                                    value={time === null ? '' : time}
                                    placeholder="Type here..."
                                    isDisabled={date == null || isDateError}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setTime(event.target.value);

                                        if (checkTimeStatus(`${date}T${event.target.value}`) == -1) {
                                            setIsTimeError(true);
                                        } else {
                                            setIsTimeError(false);
                                        }
                                    }}
                                />
                            </Box>
                            <Flex mt={'20px'}>
                                <Box>{isDateError || isTimeError ? <Text color={'red'}>Select a future date</Text> : null}</Box>
                                <Spacer />
                                <Box>
                                    <Button
                                        colorScheme="blue"
                                        onClick={handleSave}
                                        isDisabled={date == null || time == null || isDateError || isTimeError || title === ''}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Flex>
                        </Box>

                        <Box mt={'50px'} color={'#3b3f4a'}>
                            {row.reminders !== undefined
                                ? row.reminders.map((reminder: any, index: number) => {
                                      return (
                                          <Flex
                                              key={index}
                                              //   color={'white'}
                                              // bgColor={'#24a2f0'}
                                              mb={'5px'}
                                              border={'1px solid lightgray'}
                                              borderRadius={'3px'}
                                              py={'6px'}
                                              pl={'10px'}
                                          >
                                              <Box>
                                                  <Flex h={'20px'}>
                                                      <Text as={'b'} fontWeight={'semibold'} mb={'20px'} mt={'2px'} mr={'12px'}>
                                                          {reminder.title}
                                                      </Text>
                                                      {reminder.comments !== '' ? (
                                                          <Box h={'10px'}>
                                                              <Tooltip label={reminder.comments} fontSize="sm">
                                                                  <Text color={'#1ea1f2'}>
                                                                      <InfoIcon />
                                                                  </Text>
                                                              </Tooltip>
                                                          </Box>
                                                      ) : null}
                                                  </Flex>
                                                  <Text fontSize={'sm'} mt={'8px'}>
                                                      {formatTime(reminder.date)}
                                                  </Text>
                                              </Box>
                                              <Spacer />
                                              <Box ml={'16px'} mr={'16px'} mt={'12px'} cursor={'pointer'} onClick={() => handleDeleteReminder(reminder)}>
                                                  <Text fontSize={'12px'}>
                                                      <CloseIcon />
                                                  </Text>
                                              </Box>
                                          </Flex>
                                      );
                                  })
                                : null}
                        </Box>
                    </DrawerBody>

                    <DrawerFooter></DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default RemindersDrawer;
