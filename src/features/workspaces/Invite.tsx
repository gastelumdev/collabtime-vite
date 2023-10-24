import React, { useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import {
    Box,
    Button,
    Flex,
    HStack,
    Input,
    Radio,
    RadioGroup,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import Divider from "../../components/Divider/Divider";
import { AiOutlineClose } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";
import { IInvitee } from "../../types";
import PrimaryDrawer from "../../components/PrimaryDrawer";

interface InviteProps {
    getInvitees: any;
}

const Invite = ({ getInvitees }: InviteProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [invitee, setInvitee] = useState<IInvitee>({
        email: "",
        permissions: 2,
    });
    const [invitees, setInvitees] = useState<IInvitee[]>([]);

    // const sendInvite = (email: string) => {
    //     // Call the invite team members endpoint
    // }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInvitee({ ...invitee, email: value });
    };

    const handleRadioChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = event.target;
        console.log(value);
        setInvitee({ ...invitee, permissions: Number(value) });
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
        console.log(event.key);
        if (event.key === "Enter") addEmail();
    };

    const addEmail = () => {
        setInvitees([...invitees, invitee]);
        setInvitee({ email: "", permissions: 2 });
    };

    const removeEmail = (email: string) => {
        const newInvitees = invitees.filter((item: IInvitee) => {
            return item.email !== email;
        });

        setInvitees(newInvitees);
    };

    const handleGetInvitees = () => {
        getInvitees(invitees);
        setInvitees([]);
        onClose();
    };

    return (
        <>
            <PrimaryButton onClick={onOpen} px="0">
                <HiPlus size={"18px"} />
            </PrimaryButton>
            <PrimaryDrawer
                isOpen={isOpen}
                onClose={onClose}
                title="Invite a team member"
            >
                <Text pb={"5px"} color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                    Team Member Email
                </Text>
                <HStack>
                    <Input
                        type="email"
                        placeholder="Please enter email"
                        value={invitee.email}
                        required={true}
                        onChange={handleChange}
                        onKeyUp={handleKeyPress}
                        _placeholder={{ color: "rgb(123, 128, 154)" }}
                        mb={"0"}
                        size={"sm"}
                    />

                    <Button size={"sm"} onClick={addEmail}>
                        <Text fontSize={"12px"} color={"rgb(123, 128, 154)"}>
                            ADD
                        </Text>
                    </Button>
                </HStack>
                <Box mt={"15px"}>
                    <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                        Permissions
                    </Text>
                </Box>
                <RadioGroup
                    defaultValue={String(invitee.permissions)}
                    pt={"5px"}
                >
                    <Stack direction={"row"} spacing={5} mb={"5px"}>
                        <Radio
                            colorScheme="blue"
                            value="2"
                            size={"sm"}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => handleRadioChange(event)}
                        >
                            <Text
                                fontSize={"14px"}
                                color={"rgb(123, 128, 154)"}
                            >
                                Read/Write
                            </Text>
                        </Radio>
                        <Radio
                            colorScheme="blue"
                            value="1"
                            size={"sm"}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => handleRadioChange(event)}
                        >
                            <Text
                                fontSize={"14px"}
                                color={"rgb(123, 128, 154)"}
                            >
                                Read-Only
                            </Text>
                        </Radio>
                    </Stack>
                </RadioGroup>
                <Stack>
                    {invitees.length > 0 ? (
                        <Divider
                            gradient="radial-gradient(#eceef1 40%, white 60%)"
                            marginBottom="0"
                        />
                    ) : null}

                    {invitees.map((invitee: IInvitee, index: number) => {
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
                    })}
                    <Divider
                        gradient="radial-gradient(#eceef1 40%, white 60%)"
                        marginBottom="0"
                    />
                    <Flex mt={"10px"} width={"full"}>
                        <Spacer />
                        <PrimaryButton onClick={() => handleGetInvitees()}>
                            INVITE
                        </PrimaryButton>
                    </Flex>
                </Stack>
            </PrimaryDrawer>
        </>
    );
};

export default Invite;
