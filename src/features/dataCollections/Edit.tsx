import React, { useEffect, useState } from 'react';
import { Input, Text, useDisclosure, Flex, Spacer, Card, CardBody, Box, Checkbox, Stack } from '@chakra-ui/react';
import { TDataCollection } from '../../types';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useGetColumnsQuery, useGetDataCollectionsQuery, useGetUserGroupsQuery } from '../../app/services/api';
import { FilterModal } from '../dataCollectionViews/Create';
import { GoPencil } from 'react-icons/go';

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

    const { data: columns } = useGetColumnsQuery(dataCollection._id as string);
    const [userGroupAccess, setUserGroupAccess] = useState(dataCollection.userGroupAccess as []);

    const { data: userGroups } = useGetUserGroupsQuery(null);

    useEffect(() => {
        setData(dataCollection);
        if (dataCollection.userGroupAccess !== undefined) {
            setUserGroupAccess(dataCollection.userGroupAccess as []);
        }
    }, [dataCollection]);

    const editData = async () => {
        updateDataCollection({ ...data, userGroupAccess });
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        if (name === 'name' && value.length > 30) {
            setInputError(true);
        } else {
            setInputError(false);
        }

        const dataCollectionNames = dataCollections?.map((dc) => {
            if (!dc.main) return null;
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
            {/* <Button flex="1" variant="unstyled" h={'10px'} w={'5px'} leftIcon={<AiOutlineEdit />} color={'#b3b8cf'} onClick={onOpen} zIndex={10}></Button> */}
            <Box onClick={onOpen}>
                <Text color={'#b3b8cf'} fontSize={'md'}>
                    <GoPencil />
                </Text>
            </Box>
            <PrimaryDrawer onClose={handleOnClose} isOpen={isOpen} title={'Create a new data colletion'}>
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
                <Text pb={'5px'}>Description</Text>
                <Input
                    name="description"
                    value={data.description}
                    placeholder="Please enter description"
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
                {dataCollection.inParentToDisplay ? (
                    <>
                        <Text>User Groups with full access</Text>
                        <Box my={'10px'} mb={'20px'}>
                            <Stack>
                                {userGroups.map((ug: any) => {
                                    return (
                                        <Checkbox
                                            key={ug.name}
                                            isChecked={userGroupAccess.includes(ug.name as never)}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                if (event.target.checked) {
                                                    setUserGroupAccess((prev) => {
                                                        return [...prev, ug.name] as any;
                                                    });
                                                } else {
                                                    const filteredUserGroupAccess: any = userGroupAccess.filter((item: any) => {
                                                        return item !== ug.name;
                                                    });
                                                    setUserGroupAccess(filteredUserGroupAccess);
                                                }
                                            }}
                                        >
                                            {ug.name}
                                        </Checkbox>
                                    );
                                })}
                            </Stack>
                        </Box>
                        <Text>Filters</Text>
                        {columns?.map((col: any) => {
                            return (
                                <Card key={col.name} mb={'5px'}>
                                    <CardBody>
                                        <Flex>
                                            <Text>{`${col?.name[0].toUpperCase()}${col?.name.slice(1, col?.name.length).split('_').join(' ')}`}</Text>
                                            <Text ml={'20px'} fontSize={'10px'} mt={'6px'}>
                                                {data.filters && Object.keys(data.filters).includes(col.name)
                                                    ? `Filter by: ${data.filters[col.name].includes('__user__') ? 'User' : data.filters[col.name]}`
                                                    : ''}
                                            </Text>
                                            <Spacer />
                                            <FilterModal
                                                column={col}
                                                onChange={(newValues: any) => {
                                                    setData({
                                                        ...data,
                                                        filters: {
                                                            ...data.filters,
                                                            [col.name]: newValues,
                                                        },
                                                    });
                                                }}
                                                filterValues={data.filters ? data?.filters[col.name] : []}
                                                handleRemoveFilter={(columnName: string) => {
                                                    let filters = data.filters;
                                                    if (filters[columnName] !== undefined) {
                                                        filters = Object.fromEntries(Object.entries(filters).filter(([key]) => key !== columnName));
                                                        setData({ ...data, filters: filters });
                                                    }
                                                }}
                                            />
                                        </Flex>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </>
                ) : null}
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
