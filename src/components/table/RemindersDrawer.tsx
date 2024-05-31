import { CloseIcon } from '@chakra-ui/icons';
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
    useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { useUpdateRowMutation } from '../../app/services/api';

interface IProps {
    row: any;
    handleChange: any;
    allowed: boolean;
}

const RemindersDrawer = ({ row, handleChange, allowed }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [updateRow] = useUpdateRowMutation();

    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [isDateError, setIsDateError] = useState(false);
    const [isTimeError, setIsTimeError] = useState(false);

    const checkDateStatus = (dateString: string) => {
        console.log(dateString);
        const newDate = new Date(dateString);
        const now = new Date();
        const today = new Date(now.toISOString().split('T')[0]);
        console.log(newDate.toISOString());
        console.log(now.toISOString());
        // if (newDate.toISOString().split('T')[0] == now.toISOString().split('T')[0]) {
        //     return 1;
        // }

        if (newDate.getTime() >= today.getTime()) {
            return 1;
        }

        return -1;
    };

    const checkTimeStatus = (dateString: string) => {
        console.log(dateString);
        const newDate = new Date(dateString);
        const now = new Date();
        console.log(newDate.toISOString());
        console.log(now.toISOString());

        if (newDate.getTime() > now.getTime()) {
            return 1;
        }

        return -1;
    };

    const formatTime = (isoString: string) => {
        return isoString.split('T').join(' ');
    };

    const handleSave = () => {
        console.log({ date, time });
        const fullTime = `${date}T${time}`;
        const timeStatus = checkTimeStatus(fullTime);

        if (timeStatus == 1) {
            console.log('Date is in the future');
            handleChange({ ...row, reminders: [...row.reminders, fullTime] });
            setIsDateError(false);
        } else {
            console.log('Date is in the past');
            setIsDateError(true);
        }

        setDate(null);
        setTime(null);
        setIsDateError(false);
        setIsTimeError(false);

        onClose();
    };

    const handleDeleteReminder = (reminder: string) => {
        const remindersCopy = row.reminders;

        const newReminders = remindersCopy.filter((rem: string) => {
            return rem !== reminder;
        });

        updateRow({ ...row, reminders: newReminders });
    };

    const handleOnClose = () => {
        setDate(null);
        setTime(null);
        setIsDateError(false);
        setIsTimeError(false);

        onClose();
    };

    return (
        <>
            <Text fontSize={'15px'} onClick={onOpen} color={row.reminders !== undefined && row.reminders.length > 0 && allowed ? '#16b2fc' : '#cccccc'}>
                <FaRegBell />
            </Text>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={handleOnClose}
                size={'xs'}
                // finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Reminders</DrawerHeader>

                    <DrawerBody>
                        <Box>
                            <Box mb={'14px'}>
                                <Text>Date</Text>
                                <Input
                                    type={'date'}
                                    placeholder="Type here..."
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
                                <Text>Time</Text>
                                <Input
                                    type={'time'}
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
                                    <Button colorScheme="blue" onClick={handleSave} isDisabled={date == null || time == null || isDateError || isTimeError}>
                                        Save
                                    </Button>
                                </Box>
                            </Flex>
                        </Box>

                        <Box mt={'50px'}>
                            {row.reminders !== undefined
                                ? row.reminders.map((reminder: any, index: number) => {
                                      return (
                                          <Flex key={index} color={'white'} bgColor={'#24a2f0'} mb={'5px'} borderRadius={'3px'} pt={'3px'} pl={'10px'}>
                                              <Text mb={'10px'} mt={'3px'}>
                                                  {formatTime(reminder)}
                                              </Text>
                                              <Spacer />
                                              <Text
                                                  fontSize={'12px'}
                                                  ml={'16px'}
                                                  mr={'14px'}
                                                  mt={'5px'}
                                                  cursor={'pointer'}
                                                  onClick={() => handleDeleteReminder(reminder)}
                                              >
                                                  <CloseIcon />
                                              </Text>
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
