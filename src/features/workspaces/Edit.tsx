import React, { useState } from 'react';
import { Text, Flex, Input, Spacer, useDisclosure, MenuItem } from '@chakra-ui/react';
import { TWorkspace } from '../../types';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { PiPencilSimple } from 'react-icons/pi';

interface IProps {
    workspace: TWorkspace;
    updateWorkspace: any;
    workspaces: any;
}

/**
 * This serves as a drawer component to update individual workspaces
 * @param {IWorkspace} workspace - provided by workspace View.tsx
 * @param {function} updateWorkspace - provided by workspace View.tsx
 * @returns {JSX}
 */
const Edit = ({ workspace, updateWorkspace, workspaces }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    /**
     * State management for checked items that turn on and off the
     * tools that will be available in the workspace
     */
    // const [checkedItems, setCheckedItems] = React.useState([
    //     workspace.tools.dataCollections.access > 0 ? true : false,
    //     workspace.tools.taskLists.access > 0 ? true : false,
    //     workspace.tools.docs.access > 0 ? true : false,
    //     workspace.tools.messageBoard.access > 0 ? true : false,
    // ]);
    /**
     * Data is set to the workspace passed in from the main view component.
     * This will be updated when the form is updated and then passed back to
     * the main component to be part of the workspace update request.
     */
    const [data, setData] = useState<TWorkspace>(workspace);

    const [inputError, setInputError] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);

    /**
     * Sets tools based on the checkboxes and sets updates the workspace with
     * the update workspace prop
     */
    const editData = async () => {
        let newWorkspace: TWorkspace = data;
        newWorkspace = {
            ...data,
            // tools: {
            //     dataCollections: { access: checkedItems[0] ? 2 : 0 },
            //     taskLists: { access: checkedItems[1] ? 2 : 0 },
            //     docs: { access: checkedItems[2] ? 2 : 0 },
            //     messageBoard: { access: checkedItems[3] ? 2 : 0 },
            // },
        };
        updateWorkspace(newWorkspace);
        onClose();
    };

    /**
     * Handles input changes
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        if (value.length > 30) {
            setInputError(true);
        } else {
            setInputError(false);
        }

        const workspaceNames = workspaces.map((ws: any) => {
            if (workspace.name !== ws.name) {
                return ws.name;
            } else {
                return null;
            }
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

    return (
        <>
            {/* <Button flex="1" variant="ghost" leftIcon={<AiOutlineEdit />} color={'#b3b8cf'} onClick={onOpen} zIndex={10}></Button> */}
            <MenuItem icon={<PiPencilSimple />} onClick={onOpen}>
                Edit Workspace
            </MenuItem>
            <PrimaryDrawer isOpen={isOpen} onClose={onClose} title="Edit workspace">
                <Flex>
                    <Text pb={'5px'} color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                        Name
                    </Text>
                    <Text ml={'8px'} pt={'2px'} fontSize={'14px'} color={'#e53e3e'}>
                        {inputError ? '* Name exceeds character limit' : ''}
                        {isError ? '* Name already exists' : ''}
                    </Text>
                </Flex>
                <Input
                    name="name"
                    value={data?.name}
                    placeholder="Please workspace name"
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                    color={'rgb(123, 128, 154)'}
                    size={'sm'}
                />
                <Text pb={'5px'} color={'rgb(123, 128, 154)'} fontSize={'14px'}>
                    Description
                </Text>
                <Input
                    name="description"
                    value={data?.description}
                    placeholder="Please enter workspace description"
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                    color={'rgb(123, 128, 154)'}
                    size={'sm'}
                />
                {/* <Text pb={'5px'}>Tools</Text>
                <Stack mt={1} spacing={1}>
                    <Checkbox
                        isChecked={checkedItems[0]}
                        onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2], checkedItems[3]])}
                        color={'rgb(123, 128, 154)'}
                        fontSize={'14px'}
                    >
                        <Text fontSize={'14px'}>Data Collections</Text>
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[1]}
                        onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2], checkedItems[3]])}
                        color={'rgb(123, 128, 154)'}
                        fontSize={'14px'}
                    >
                        <Text fontSize={'14px'}>Tasks</Text>
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[2]}
                        onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked, checkedItems[3]])}
                        color={'rgb(123, 128, 154)'}
                        fontSize={'14px'}
                    >
                        <Text fontSize={'14px'}>Docs</Text>
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[3]}
                        onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], e.target.checked])}
                        color={'rgb(123, 128, 154)'}
                        fontSize={'14px'}
                    >
                        <Text fontSize={'14px'}>Message Board</Text>
                    </Checkbox>
                </Stack> */}
                {/* <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="0" /> */}
                <Flex mt={'10px'} width={'full'}>
                    <Spacer />
                    <PrimaryButton onClick={editData} isDisabled={inputError || isError}>
                        SAVE
                    </PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default Edit;
