import React, { useEffect, useState } from 'react';
import { Button, Input, Text, useDisclosure, Flex, Spacer } from '@chakra-ui/react';
import { TDataCollection } from '../../types';
import { AiOutlineEdit } from 'react-icons/ai';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useGetDataCollectionsQuery } from '../../app/services/api';

interface IProps {
    dataCollection: TDataCollection;
    updateDataCollection: any;
}

const Edit = ({ dataCollection, updateDataCollection }: IProps) => {
    const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<TDataCollection>(dataCollection);
    const [inputError, setInputError] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setData(dataCollection);
    }, [dataCollection]);

    const editData = async () => {
        updateDataCollection(data);
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        if (value.length > 30) {
            setInputError(true);
        } else {
            setInputError(false);
        }

        const dataCollectionNames = dataCollections?.map((dc) => {
            if (dataCollection.name !== dc.name) {
                return dc.name;
            } else {
                return null;
            }
        });

        if (dataCollectionNames?.includes(value)) {
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
        setData(dataCollection);
        setIsError(false);
        setInputError(false);
        onClose();
    };

    return (
        <>
            <Button flex="1" variant="unstyled" h={'10px'} w={'5px'} leftIcon={<AiOutlineEdit />} color={'#b3b8cf'} onClick={onOpen} zIndex={10}></Button>
            <PrimaryDrawer onClose={handleOnClose} isOpen={isOpen} title={'Create a new workspace'}>
                <Flex>
                    <Text pb={'5px'}>Name</Text>
                    <Text ml={'8px'} pt={'2px'} fontSize={'14px'} color={'#e53e3e'}>
                        {inputError ? '* Name exceeds character limit' : ''}
                        {isError ? '* Name already exists' : ''}
                    </Text>
                </Flex>
                <Input
                    name="name"
                    value={data.name}
                    placeholder="Please enter user name"
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
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
