import React, { useState } from "react";
import {
    useGetOneWorkspaceQuery,
    useGetWorkspaceUsersQuery,
    useInviteTeamMemberMutation,
    useRemoveMemberMutation,
} from "../../app/services/api";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
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
    Radio,
    RadioGroup,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import Divider from "../../components/Divider/Divider";
import { HiPlus } from "react-icons/hi";
import { TInvitee, TUser, TWorkspace } from "../../types";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import { useParams } from "react-router-dom";
import Select, { ActionMeta, MultiValue } from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { LockIcon } from "@chakra-ui/icons";

interface InviteProps {
    getInvitees?: any;
}

const Invite = ({}: InviteProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { id } = useParams();
    const [permissions, setPermissions] = useState<number>(1);
    const [invitees, setInvitees] = useState<TInvitee[]>([]);
    const { data: workspaceUsers } = useGetWorkspaceUsersQuery(id as string);
    const { data: workspace } = useGetOneWorkspaceQuery(id as string);
    const [inviteTeamMember] = useInviteTeamMemberMutation();
    const [removeMember] = useRemoveMemberMutation();
    const [newWorkspace, setNewWorkspace] = useState<TWorkspace>();
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<{ value: string; label: string }>>([]);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPermissions(Number(value));

        const inviteesCopy = invitees.map((item) => {
            return { ...item, permissions: Number(value) };
        });

        setInvitees(inviteesCopy);

        const newWorkspaceCopy = { ...newWorkspace };
        newWorkspaceCopy.invitees = invitees;
        setNewWorkspace(newWorkspaceCopy as TWorkspace);
    };

    const handleSelectChange = async (
        newValue: MultiValue<{ value: string; label: string }>,
        actionMeta: ActionMeta<any>
    ) => {
        setSelectedOptions(newValue);
        let inviteesCopy = invitees;

        if (actionMeta.action === "select-option") {
            inviteesCopy.push({ email: actionMeta.option.value, permissions: permissions || 1 });
        }

        if (actionMeta.action === "remove-value") {
            inviteesCopy = inviteesCopy.filter((item) => {
                return actionMeta.removedValue.value !== item.email;
            });
        }

        if (actionMeta.action === "clear") {
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
        removeMember({ userId });
    };

    const getPermissions = (user: TUser) => {
        for (const workspace of user.workspaces) {
            if (workspace.id === localStorage.getItem("workspaceId")) {
                return workspace.permissions;
            }
        }
        return 0;
    };

    return (
        <>
            <PrimaryButton onClick={onOpen} px="0">
                <HiPlus size={"18px"} />
            </PrimaryButton>
            <PrimaryDrawer isOpen={isOpen} onClose={onClose} title="Invite a team member">
                <Box>
                    <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                        Allow the selected team members to
                    </Text>
                </Box>
                <RadioGroup defaultValue={String(permissions)} pt={"5px"}>
                    <Stack direction={"row"} spacing={5} mb={"5px"}>
                        <Radio
                            colorScheme="blue"
                            value="1"
                            size={"sm"}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleRadioChange(event)}
                        >
                            <Text fontSize={"14px"} color={"rgb(123, 128, 154)"}>
                                Read-Only
                            </Text>
                        </Radio>
                        <Radio
                            colorScheme="blue"
                            value="2"
                            size={"sm"}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleRadioChange(event)}
                        >
                            <Text fontSize={"14px"} color={"rgb(123, 128, 154)"}>
                                Read/Write
                            </Text>
                        </Radio>
                    </Stack>
                </RadioGroup>
                <Text pb={"5px"} mt={"15px"} color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                    Team Members
                </Text>
                <Select
                    options={workspaceUsers?.reactSelectOptions}
                    isMulti
                    name="invitees"
                    onChange={handleSelectChange}
                    value={selectedOptions}
                />

                <Stack>
                    {/* <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" /> */}

                    <Flex mt={"10px"} width={"full"}>
                        <Spacer />
                        <PrimaryButton onClick={handleSubmit}>INVITE</PrimaryButton>
                    </Flex>
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="20px" />
                    <Text fontSize={"16px"}>Team members</Text>
                    {workspaceUsers?.members.length || 0 > 0 ? (
                        workspaceUsers?.members.map((item: TUser, index: number) => {
                            return (
                                <Box key={index}>
                                    <Flex>
                                        {item._id == localStorage.getItem("userId") ? (
                                            <Box w={"25px"}>
                                                <LockIcon
                                                    fontSize={"11px"}
                                                    mb={"7px"}
                                                    ml={"1px"}
                                                    color={"rgb(123, 128, 154)"}
                                                />
                                            </Box>
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger>
                                                    <IconButton
                                                        size={"xs"}
                                                        variant={"unstyled"}
                                                        aria-label=""
                                                        icon={<AiOutlineClose size={"12px"} />}
                                                    ></IconButton>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <PopoverArrow />
                                                    <PopoverCloseButton />
                                                    <PopoverHeader>
                                                        Are you sure you want to delete{" "}
                                                        {`${item.firstname} ${item.lastname}`}?
                                                    </PopoverHeader>
                                                    <PopoverBody>
                                                        <Flex>
                                                            <Spacer />
                                                            <PrimaryButton
                                                                onClick={() => confirmRemoveMember(item._id)}
                                                            >
                                                                Delete
                                                            </PrimaryButton>
                                                        </Flex>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                        <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                                            {`${item.firstname} ${item.lastname}`}
                                        </Text>
                                        <Text ml={"10px"} pt={"2px"} color={"#afb3c9"} fontSize={"12px"}>
                                            {getPermissions(item) > 1 ? "Read/Write" : "Read-Only"}
                                        </Text>
                                    </Flex>
                                </Box>
                            );
                        })
                    ) : (
                        <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                            You have no team members at this time.
                        </Text>
                    )}
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="20px" />
                    <Text fontSize={"16px"}>Invited team members</Text>
                    {workspaceUsers?.invitees.length || 0 > 0 ? (
                        workspaceUsers?.invitees.map((item: TUser, index: number) => {
                            return (
                                <Text key={index} color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                                    {`${item.firstname} ${item.lastname}`}
                                </Text>
                            );
                        })
                    ) : (
                        <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                            There is no one invited to this workspace.
                        </Text>
                    )}
                </Stack>
            </PrimaryDrawer>
        </>
    );
};

export default Invite;
