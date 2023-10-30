import React, { useState } from "react";
import {
    Checkbox,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Input,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { TWorkspace } from "../../types";

import PrimaryButton from "../../components/Buttons/PrimaryButton";
import Divider from "../../components/Divider/Divider";

/**
 * Workspace default values should be deleted once RTK is implemented
 */
let defaultValues: TWorkspace = {
    // _id: "1",
    name: "",
    description: "",
    owner: localStorage.getItem("userId") || "",
    tools: {
        dataCollections: { access: 2 },
        taskLists: { access: 2 },
        docs: { access: 2 },
        messageBoard: { access: 2 },
    },
    invitees: [],
};

interface IProps {
    addNewWorkspace: any;
}

/**
 * This serves as a view for the create workspace drawer
 * @param {IProps} {addNewWorkspace}
 * @returns {JSX}
 */
const Create = ({ addNewWorkspace }: IProps) => {
    /**
     * ChakraUI drawer disclosure
     */
    const { isOpen, onOpen, onClose } = useDisclosure();
    /**
     * State management for the tools checkboxes
     */
    const [checkedItems, setCheckedItems] = React.useState([
        true,
        true,
        true,
        true,
    ]);
    /**
     * Workspace data set for creating a new workspace
     */
    const [data, setData] = useState<TWorkspace>(defaultValues);

    /**
     * This function updates the workspace data and create a new workspace
     */
    const createData = async () => {
        setTools();
        console.log(data);
        addNewWorkspace(data);
        setData(defaultValues);
        onClose();
    };

    /**
     * Handles input changes
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    /**
     * Updates the workspace tools based on the checkboxes selected
     */
    const setTools = () => {
        let newWorkspace: TWorkspace;
        newWorkspace = {
            ...data,
            tools: {
                dataCollections: { access: checkedItems[0] ? 2 : 0 },
                taskLists: { access: checkedItems[1] ? 2 : 0 },
                docs: { access: checkedItems[2] ? 2 : 0 },
                messageBoard: { access: checkedItems[3] ? 2 : 0 },
            },
        };
        setData(newWorkspace);
    };

    return (
        <>
            <PrimaryButton onClick={onOpen}>NEW WORKSPACE</PrimaryButton>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size={"md"}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader fontSize={"16px"}>
                        Create a new workspace
                        <Divider
                            gradient="radial-gradient(#eceef1 40%, white 60%)"
                            marginBottom="0"
                        />
                    </DrawerHeader>
                    <DrawerBody>
                        <Text pb={"5px"} color={"rgb(123, 128, 154)"}>
                            Name
                        </Text>
                        <Input
                            name="name"
                            placeholder="Please enter user name"
                            value={data.name}
                            required={true}
                            onChange={handleChange}
                            style={{ marginBottom: "15px" }}
                            _placeholder={{ color: "rgb(123, 128, 154)" }}
                        />
                        <Text pb={"5px"} color={"rgb(123, 128, 154)"}>
                            Description
                        </Text>
                        <Input
                            name="description"
                            placeholder="please enter url description"
                            value={data.description}
                            onChange={handleChange}
                            style={{ marginBottom: "15px" }}
                        />
                        <Text pb={"5px"}>Tools</Text>
                        <Stack mt={1} spacing={1}>
                            <Checkbox
                                color={"rgb(123, 128, 154)"}
                                isChecked={checkedItems[0]}
                                onChange={(e) =>
                                    setCheckedItems([
                                        e.target.checked,
                                        checkedItems[1],
                                        checkedItems[2],
                                        checkedItems[3],
                                    ])
                                }
                            >
                                <Text fontSize={"14px"}>Data Collections</Text>
                            </Checkbox>
                            <Checkbox
                                color={"rgb(123, 128, 154)"}
                                isChecked={checkedItems[1]}
                                onChange={(e) =>
                                    setCheckedItems([
                                        checkedItems[0],
                                        e.target.checked,
                                        checkedItems[2],
                                        checkedItems[3],
                                    ])
                                }
                            >
                                <Text fontSize={"14px"}>Tasks</Text>
                            </Checkbox>
                            <Checkbox
                                color={"rgb(123, 128, 154)"}
                                isChecked={checkedItems[2]}
                                onChange={(e) =>
                                    setCheckedItems([
                                        checkedItems[0],
                                        checkedItems[1],
                                        e.target.checked,
                                        checkedItems[3],
                                    ])
                                }
                            >
                                <Text fontSize={"14px"}>Docs</Text>
                            </Checkbox>
                            <Checkbox
                                color={"rgb(123, 128, 154)"}
                                isChecked={checkedItems[3]}
                                onChange={(e) =>
                                    setCheckedItems([
                                        checkedItems[0],
                                        checkedItems[1],
                                        checkedItems[2],
                                        e.target.checked,
                                    ])
                                }
                            >
                                <Text fontSize={"14px"}>Message Board</Text>
                            </Checkbox>
                            <Divider
                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                marginBottom="0"
                            />
                            <Flex mt={"10px"} width={"full"}>
                                <Spacer />
                                <PrimaryButton onClick={createData}>
                                    SAVE
                                </PrimaryButton>
                            </Flex>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Create;
