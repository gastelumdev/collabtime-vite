import { useEffect, useState } from 'react';
import {
    useGetOneWorkspaceQuery,
    useGetWorkspaceUsersQuery,
    useInviteTeamMemberMutation,
    useRemoveMemberMutation,
    useRemoveInviteeMutation,
    useCallUpdateMutation,
} from '../../app/services/api';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {
    Box,
    Flex,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import Divider from '../../components/Divider/Divider';
import { HiPlus } from 'react-icons/hi';
import { TInvitee, TUser, TWorkspace } from '../../types';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { useParams } from 'react-router-dom';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { AiOutlineClose } from 'react-icons/ai';
import { LockIcon } from '@chakra-ui/icons';
import { io } from 'socket.io-client';

interface InviteProps {
    getInvitees?: any;
}

const RemoveMemberWarning = ({ item, confirmRemoveMember }: { item: any; confirmRemoveMember: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const [removeMember] = useRemoveMemberMutation();

    // const confirmRemoveMember = (userId: string) => {
    //     onClose();
    //     removeMember({ userId });
    // };
    return (
        <Popover isOpen={isOpen} onOpen={onOpen}>
            <PopoverTrigger>
                <IconButton size={'xs'} variant={'unstyled'} aria-label="" icon={<AiOutlineClose size={'12px'} />}></IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Are you sure you want to delete {`${item.firstname} ${item.lastname}`}?</PopoverHeader>
                <PopoverBody>
                    <Flex>
                        <Spacer />
                        <PrimaryButton
                            onClick={() => {
                                onClose();
                                confirmRemoveMember(item._id);
                            }}
                        >
                            Delete
                        </PrimaryButton>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

const Invite = ({}: InviteProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const { isOpen: removeMemberIsOpen, onOpen: removeMemberOnOpen, onClose: removeMemberOnClose } = useDisclosure();
    const { id } = useParams();
    const [permissions, _setPermissions] = useState<number>(1);
    const [invitees, _setInvitees] = useState<TInvitee[]>([]);
    const { data: workspaceUsersRes } = useGetWorkspaceUsersQuery(id as string);
    const { data: workspace } = useGetOneWorkspaceQuery(id as string);
    const [inviteTeamMember] = useInviteTeamMemberMutation();
    const [removeMember] = useRemoveMemberMutation();
    const [removeInvitee] = useRemoveInviteeMutation();
    const [callUpdate] = useCallUpdateMutation();
    const [newWorkspace, setNewWorkspace] = useState<TWorkspace>();
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<{ value: string; label: string }>>([]);

    const [workspaceUsers, setWorkspaceUsers] = useState<any>(workspaceUsersRes);

    useEffect(() => {
        setWorkspaceUsers(workspaceUsersRes);
    }, [workspaceUsersRes]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update', () => {
            callUpdate(null);
            // setNotifications(callNotificationsUpdate(priority) as any);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event.target;
    //     setPermissions(Number(value));

    //     const inviteesCopy = invitees.map((item) => {
    //         return { ...item, permissions: Number(value) };
    //     });

    //     setInvitees(inviteesCopy);

    //     const newWorkspaceCopy = { ...newWorkspace };
    //     newWorkspaceCopy.invitees = invitees;
    //     setNewWorkspace(newWorkspaceCopy as TWorkspace);
    // };

    const handleSelectChange = async (newValue: MultiValue<{ value: string; label: string }>, actionMeta: ActionMeta<any>) => {
        setSelectedOptions(newValue);
        let inviteesCopy = invitees;

        if (actionMeta.action === 'select-option') {
            inviteesCopy.push({ email: actionMeta.option.value, permissions: permissions || 1 });
        }

        if (actionMeta.action === 'remove-value') {
            inviteesCopy = inviteesCopy.filter((item) => {
                return actionMeta.removedValue.value !== item.email;
            });
        }

        if (actionMeta.action === 'clear') {
            for (const removedValue of actionMeta.removedValues) {
                inviteesCopy = inviteesCopy.filter((item) => {
                    return removedValue.value !== item.email;
                });
            }
        }

        const workspaceCopy = workspace;
        const existingInvitees = workspaceCopy?.invitees;

        const _newWorkspace = {
            ...workspaceCopy,
            invitees: existingInvitees?.concat(inviteesCopy),
        };

        setNewWorkspace(_newWorkspace as TWorkspace);
    };

    const handleSubmit = () => {
        inviteTeamMember(newWorkspace as TWorkspace);
        setSelectedOptions([]);
        // onClose();
    };

    const confirmRemoveMember = (userId: string) => {
        const workspaceUsersCopy = workspaceUsers;
        const members = workspaceUsersCopy.members;

        const filteredMembers = members.filter((member: any) => {
            return member._id !== userId;
        });

        setWorkspaceUsers({ ...workspaceUsersCopy, members: filteredMembers });
        removeMember({ userId });
    };

    const confirmRemoveInvitee = (userId: string) => {
        removeInvitee({ userId });
    };

    const getPermissions = (user: TUser) => {
        for (const workspace of user.workspaces) {
            if (workspace.id === localStorage.getItem('workspaceId')) {
                return workspace.permissions;
            }
        }
        return 0;
    };

    const isOwner = (user: TUser) => {
        return user._id == workspace?.owner;
    };

    return (
        <>
            <PrimaryButton onClick={onOpen} size="sm">
                <HiPlus size={'18px'} style={{ marginRight: '3px' }} /> Invite
            </PrimaryButton>
            <PrimaryDrawer isOpen={isOpen} onClose={onClose} title="Invite a team member">
                {/* <Box>
                    <Text color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                        Allow the selected team members to
                    </Text>
                </Box> */}
                {/* <RadioGroup defaultValue={String(permissions)} pt={'5px'}>
                    <Stack direction={'row'} spacing={5} mb={'5px'}>
                        <Radio colorScheme="blue" value="1" size={'sm'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleRadioChange(event)}>
                            <Text fontSize={'14px'} color={'rgb(123, 128, 154)'}>
                                Read-Only
                            </Text>
                        </Radio>
                        <Radio colorScheme="blue" value="2" size={'sm'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleRadioChange(event)}>
                            <Text fontSize={'14px'} color={'rgb(123, 128, 154)'}>
                                Read/Write
                            </Text>
                        </Radio>
                    </Stack>
                </RadioGroup> */}
                <Text pb={'5px'} color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                    Team Members
                </Text>
                <Select options={workspaceUsers?.reactSelectOptions} isMulti name="invitees" onChange={handleSelectChange} value={selectedOptions} />

                <Stack>
                    {/* <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" /> */}

                    <Flex mt={'10px'} width={'full'}>
                        <Spacer />
                        <PrimaryButton onClick={handleSubmit}>INVITE</PrimaryButton>
                    </Flex>
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="20px" />
                    <Text fontSize={'16px'}>Team members</Text>
                    {workspaceUsers?.members.length || 0 > 0 ? (
                        workspaceUsers?.members.map((item: TUser, index: number) => {
                            return (
                                <Box key={index}>
                                    <Flex>
                                        {item._id == localStorage.getItem('userId') ? (
                                            <Box w={'25px'}>
                                                <LockIcon fontSize={'11px'} mb={'7px'} ml={'1px'} color={'rgb(123, 128, 154)'} />
                                            </Box>
                                        ) : (
                                            <RemoveMemberWarning item={item} confirmRemoveMember={confirmRemoveMember} />
                                        )}
                                        <Text color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                                            {`${item.firstname} ${item.lastname}`}
                                        </Text>
                                        <Text ml={'10px'} pt={'2px'} color={'#afb3c9'} fontSize={'12px'}>
                                            {isOwner(item) ? 'Owner' : getPermissions(item) > 1 ? 'Read/Write' : 'Read-Only'}
                                        </Text>
                                    </Flex>
                                </Box>
                            );
                        })
                    ) : (
                        <Text color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                            You have no team members at this time.
                        </Text>
                    )}
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="20px" />
                    <Text fontSize={'16px'}>Invited team members</Text>
                    {workspaceUsers?.invitees.length || 0 > 0 ? (
                        workspaceUsers?.invitees.map((item: TUser, index: number) => {
                            return (
                                <Flex key={index}>
                                    <Popover>
                                        <PopoverTrigger>
                                            <IconButton size={'xs'} variant={'unstyled'} aria-label="" icon={<AiOutlineClose size={'12px'} />}></IconButton>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverHeader>
                                                Are you sure you want to remove your invitation to {`${item.firstname} ${item.lastname}`}?
                                            </PopoverHeader>
                                            <PopoverBody>
                                                <Flex>
                                                    <Spacer />
                                                    <PrimaryButton onClick={() => confirmRemoveInvitee(item._id)}>Remove</PrimaryButton>
                                                </Flex>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <Text color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                                        {`${item.firstname} ${item.lastname}`}
                                    </Text>
                                    {/* <Text ml={'10px'} pt={'2px'} color={'#afb3c9'} fontSize={'12px'}>
                                        {getPermissions(item) > 1 ? 'Read/Write' : 'Read-Only'}
                                    </Text> */}
                                </Flex>
                            );
                        })
                    ) : (
                        <Text color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                            There is no one invited to this workspace.
                        </Text>
                    )}
                </Stack>
            </PrimaryDrawer>
        </>
    );
};

export default Invite;
