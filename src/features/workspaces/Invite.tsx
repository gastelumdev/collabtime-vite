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
    HStack,
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
import Select, { ActionMeta } from "react-select";
import { AiOutlineClose } from "react-icons/ai";

interface InviteProps {
    getInvitees?: any;
}

const Invite = ({}: InviteProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { id } = useParams();
    const [invitee, setInvitee] = useState<TInvitee>({
        email: "",
        permissions: 2,
    });
    const [invitees] = useState<TInvitee[]>([]);
    const { data: workspaceUsers } = useGetWorkspaceUsersQuery(id as string);
    const { data: workspace } = useGetOneWorkspaceQuery(id as string);
    const [inviteTeamMember] = useInviteTeamMemberMutation();
    const [removeMember] = useRemoveMemberMutation();
    const [newWorkspace, setNewWorkspace] = useState<TWorkspace>();

    // const sendInvite = (email: string) => {
    //     // Call the invite team members endpoint
    // }

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event.target;
    //     setInvitee({ ...invitee, email: value });
    // };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        console.log(value);
        setInvitee({ ...invitee, permissions: Number(value) });
    };

    // const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    //     console.log(event.key);
    //     if (event.key === "Enter") addEmail();
    // };

    // const addEmail = () => {
    //     setInvitees([...invitees, invitee]);
    //     setInvitee({ email: "", permissions: 2 });
    // };

    // const removeEmail = (email: string) => {
    //     const newInvitees = invitees.filter((item: TInvitee) => {
    //         return item.email !== email;
    //     });

    //     setInvitees(newInvitees);
    // };

    // const handleGetInvitees = () => {
    //     getInvitees(invitees);
    //     setInvitees([]);
    //     onClose();
    // };

    const handleSelectChange = async (option: readonly any[], actionMeta: ActionMeta<any>) => {
        console.log(option);
        console.log(actionMeta);
        let inviteesCopy = invitees;

        if (actionMeta.action === "select-option") {
            inviteesCopy.push({ ...invitee, email: actionMeta.option.value });
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
        const existingInvitess = workspaceCopy?.invitees;

        const _newWorkspace = {
            ...workspaceCopy,
            invitees: existingInvitess?.concat(inviteesCopy),
        };

        console.log(_newWorkspace);

        setNewWorkspace(_newWorkspace as TWorkspace);
    };

    const handleSubmit = () => {
        inviteTeamMember(newWorkspace as TWorkspace);
        // onClose();
    };

    const confirmRemoveMember = (userId: string) => {
        console.log(userId);
        removeMember({ userId });
    };

    return (
        <>
            <PrimaryButton onClick={onOpen} px="0">
                <HiPlus size={"18px"} />
            </PrimaryButton>
            <PrimaryDrawer isOpen={isOpen} onClose={onClose} title="Invite a team member">
                <Text pb={"5px"} color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                    Team Members
                </Text>
                <Select
                    options={workspaceUsers?.reactSelectOptions}
                    isMulti
                    name="invitees"
                    onChange={handleSelectChange}
                />
                <HStack>
                    {/* <Input
                        type="email"
                        placeholder="Please enter email"
                        value={invitee.email}
                        required={true}
                        onChange={handleChange}
                        onKeyUp={handleKeyPress}
                        _placeholder={{ color: "rgb(123, 128, 154)" }}
                        mb={"0"}
                        size={"sm"}
                    /> */}

                    {/* <Button size={"sm"} onClick={addEmail}>
                        <Text fontSize={"12px"} color={"rgb(123, 128, 154)"}>
                            ADD
                        </Text>
                    </Button> */}
                </HStack>
                <Box mt={"15px"}>
                    <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                        Allow the selected team members to
                    </Text>
                </Box>
                <RadioGroup defaultValue={String(invitee.permissions)} pt={"5px"}>
                    <Stack direction={"row"} spacing={5} mb={"5px"}>
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
                    </Stack>
                </RadioGroup>
                <Stack>
                    {/* {invitees.length > 0 ? (
                        <Divider
                            gradient="radial-gradient(#eceef1 40%, white 60%)"
                            marginBottom="0"
                        />
                    ) : null} */}

                    {/* {invitees.map((invitee: TInvitee, index: number) => {
                        return (
                            <Box key={index} bg={"gray.100"} pl={"12px"}>
                                <HStack>
                                    <Button
                                        variant={"unstyled"}
                                        p={"0"}
                                        h={"30px"}
                                        minW={"20px"}
                                        onClick={() =>
                                            removeEmail(invitee.email)
                                        }
                                    >
                                        <AiOutlineClose
                                            style={{
                                                color: "rgb(123, 128, 154)",
                                            }}
                                        />
                                    </Button>
                                    <Text
                                        color={"rgb(123, 128, 154)"}
                                        fontSize={"14px"}
                                    >
                                        {invitee.email}
                                    </Text>
                                </HStack>
                            </Box>
                        );
                    })} */}
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" />

                    <Flex mt={"10px"} width={"full"}>
                        <Spacer />
                        <PrimaryButton onClick={handleSubmit}>INVITE</PrimaryButton>
                    </Flex>
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" />
                    <Text fontSize={"16px"}>Team members</Text>
                    {workspaceUsers?.members.length || 0 > 0 ? (
                        workspaceUsers?.members.map((item: TUser, index: number) => {
                            return (
                                <Box key={index}>
                                    <Flex>
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
                                                        <PrimaryButton onClick={() => confirmRemoveMember(item._id)}>
                                                            Delete
                                                        </PrimaryButton>
                                                    </Flex>
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Popover>

                                        <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                                            {`${item.firstname} ${item.lastname}`}
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
                    <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" />
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
