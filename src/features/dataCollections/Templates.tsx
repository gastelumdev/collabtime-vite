import { useEffect, useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Text,
    useDisclosure,
    Box,
    Flex,
    Spacer,
    Button,
} from '@chakra-ui/react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { useGetDataCollectionsQuery, useUpdateDataCollectionMutation } from '../../app/services/api';
import { TDataCollection } from '../../types';
import { DeleteIcon } from '@chakra-ui/icons';
import { BiBookAdd } from 'react-icons/bi';

interface IRemoveTemplateProps {
    dataCollection: TDataCollection;
    updateDataCollection: any;
}

const RemoveTemplate = ({ dataCollection, updateDataCollection }: IRemoveTemplateProps) => {
    const { onOpen, isOpen, onClose } = useDisclosure();
    const cancelRef = useRef<any>();

    const removeAsTemplate = () => {
        onClose();
        updateDataCollection({ ...dataCollection, asTemplate: { name: '', active: false } });
    };
    return (
        <>
            <Box px={'5px'} cursor={'pointer'} onClick={onOpen}>
                <Text fontSize={'12px'} pt={'2px'} color={'white'}>
                    <DeleteIcon />
                </Text>
            </Box>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Customer
                        </AlertDialogHeader>

                        <AlertDialogBody>Are you sure you want to remove the template?</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button colorScheme="red" onClick={() => removeAsTemplate()}>
                                REMOVE TEMPLATE
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

const Templates = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const [updateDataCollection] = useUpdateDataCollectionMutation();

    const [templates, setTemplates] = useState<TDataCollection[]>([]);

    useEffect(() => {
        const dataCollectionRes = [];
        for (const dataCollection of dataCollections || []) {
            const dataCollectionCopy: any = dataCollection;
            if (dataCollectionCopy.asTemplate !== undefined && dataCollectionCopy.asTemplate?.active) {
                dataCollectionRes.push(dataCollection);
            }
        }
        setTemplates(dataCollectionRes);
    }, [dataCollections]);
    return (
        <>
            <PrimaryButton onClick={onOpen} size="sm">
                <BiBookAdd style={{ marginRight: '4px' }} /> Templates
            </PrimaryButton>
            <PrimaryDrawer isOpen={isOpen} onClose={onClose} title={'Templates'}>
                {templates.length > 0 ? (
                    <Box>
                        <Text color={'gray'} fontSize={'sm'}>
                            Click on the delete icon to delete templates. Deleting a template will not affect data collections that were created using the
                            template. Once the template is deleted, visit the data collection and set it as a template if you wish to recreate the template.
                        </Text>
                        <Box mt={'20px'}>
                            {templates.map((dataCollection, index) => {
                                return (
                                    <Box key={index} p={'10px'} bgColor={'#24a2f0'} mb={'3px'}>
                                        <Flex>
                                            <Text color={'white'}>{dataCollection?.asTemplate?.name}</Text>
                                            <Spacer />
                                            <RemoveTemplate dataCollection={dataCollection} updateDataCollection={updateDataCollection} />
                                        </Flex>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Text color={'gray'} fontSize={'sm'}>
                            Templates allow you to create data collections with the save data types or columns.
                        </Text>
                        <Text color={'gray'} fontSize={'sm'}>
                            To create a template, go to a data collection and click the "Template" button.
                        </Text>
                        <Box mt={'30px'}>
                            <Text color={'gray'} fontSize={'sm'}>
                                There are no existing templates.
                            </Text>
                        </Box>
                    </Box>
                )}
            </PrimaryDrawer>
        </>
    );
};

export default Templates;
