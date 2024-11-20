import React, { useState } from 'react';
import { Flex, Input, MenuItem, Spacer, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { TWorkspace } from '../../types';

import PrimaryButton from '../../components/Buttons/PrimaryButton';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { AddIcon } from '@chakra-ui/icons';
import Select from 'react-select';

/**
 * Workspace default values should be deleted once RTK is implemented
 */
let defaultValues: TWorkspace = {
    // _id: "1",
    name: '',
    description: '',
    owner: localStorage.getItem('userId') || '',
    tools: {
        dataCollections: { access: 2 },
        taskLists: { access: 2 },
        docs: { access: 2 },
        messageBoard: { access: 2 },
    },
    invitees: [],
    members: [],
    tags: [],
    workspaceTags: [],
    type: 'basic',
};

interface IProps {
    addNewWorkspace: any;
    workspaces: any;
}

/**
 * This serves as a view for the create workspace drawer
 * @param {IProps} {addNewWorkspace}
 * @returns {JSX}
 */
const Create = ({ addNewWorkspace, workspaces }: IProps) => {
    /**
     * ChakraUI drawer disclosure
     */
    const { isOpen, onOpen, onClose } = useDisclosure();
    /**
     * State management for the tools checkboxes
     */
    // const [checkedItems, setCheckedItems] = React.useState([true, true, true, true]);
    /**
     * Workspace data set for creating a new workspace
     */
    const [data, setData] = useState<TWorkspace>(defaultValues);

    const [inputError, setInputError] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);
    /**
     * This function updates the workspace data and create a new workspace
     */
    const createData = async () => {
        let newWorkspace: TWorkspace;
        newWorkspace = {
            ...data,
            // tools: {
            //     dataCollections: { access: checkedItems[0] ? 2 : 0 },
            //     taskLists: { access: checkedItems[1] ? 2 : 0 },
            //     docs: { access: checkedItems[2] ? 2 : 0 },
            //     messageBoard: { access: checkedItems[3] ? 2 : 0 },
            // },
            tools: {
                dataCollections: { access: 2 },
                taskLists: { access: 2 },
                docs: { access: 2 },
                messageBoard: { access: 2 },
            },
        };
        addNewWorkspace(newWorkspace);
        setData(defaultValues);
        onClose();
    };

    /**
     * Handles input changes
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;

        if (name === 'name') {
            if (value.length > 30) {
                setInputError(true);
            } else {
                setInputError(false);
            }
        }

        const workspaceNames = workspaces.map((workspace: any) => {
            return workspace.name;
        });

        if (workspaceNames.includes(value)) {
            setIsError(true);
        } else {
            setIsError(false);
        }
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleOnClose = () => {
        setData(defaultValues);
        setIsError(false);
        setInputError(false);
        onClose();
    };

    /**
     * Updates the workspace tools based on the checkboxes selected
     */
    // const setTools = () => {
    //     let newWorkspace: TWorkspace;
    //     newWorkspace = {
    //         ...data,
    //         tools: {
    //             dataCollections: { access: checkedItems[0] ? 2 : 0 },
    //             taskLists: { access: checkedItems[1] ? 2 : 0 },
    //             docs: { access: checkedItems[2] ? 2 : 0 },
    //             messageBoard: { access: checkedItems[3] ? 2 : 0 },
    //         },
    //     };
    //     setData(newWorkspace);
    // };

    const handleOnOpen = () => {
        console.log('OPEN CLICK');
        onOpen();
    };

    return (
        <>
            <MenuItem onClick={handleOnOpen} icon={<AddIcon />}>
                Create Workspace
            </MenuItem>
            <PrimaryDrawer isOpen={isOpen} onClose={handleOnClose} size={'md'} title={'Create a new workspace'}>
                <Flex>
                    <Text pb={'5px'} color={'rgb(123, 128, 154)'}>
                        Name
                    </Text>
                    <Text ml={'8px'} pt={'2px'} fontSize={'14px'} color={'#e53e3e'}>
                        {inputError ? '* Name exceeds character limit' : ''}
                        {isError ? '* Name already exists' : ''}
                    </Text>
                </Flex>
                <Input
                    name="name"
                    placeholder="Please enter workspace name"
                    value={data.name}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                    _placeholder={{ color: 'rgb(123, 128, 154)' }}
                />
                <Text pb={'5px'} color={'rgb(123, 128, 154)'}>
                    Description
                </Text>
                <Input
                    name="description"
                    placeholder="Please enter a description"
                    value={data.description}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
                <Text pb={'5px'} color={'rgb(123, 128, 154)'}>
                    Template
                </Text>
                <Select
                    id={'appType'}
                    name={'appType'}
                    placeholder={'Please select type of row app'}
                    // isDisabled={!appModelChecked}
                    onChange={(selectedOption: any) => {
                        console.log(selectedOption.value);
                        setData({ ...data, type: selectedOption.value });
                    }}
                    options={[
                        { value: 'basic', label: 'Basic' },
                        { value: 'integration', label: 'Integration' },
                    ]}
                    styles={
                        {
                            control: (styles: any) => {
                                return { ...styles, borderColor: '#e2e8f0', marginBottom: '20px' };
                            },
                        } as any
                    }
                />
                <Stack mt={1} spacing={1}>
                    <Flex mt={'10px'} width={'full'}>
                        <Spacer />
                        <PrimaryButton onClick={createData} isDisabled={inputError || isError}>
                            SAVE
                        </PrimaryButton>
                    </Flex>
                </Stack>
            </PrimaryDrawer>
        </>
    );
};

export default Create;
