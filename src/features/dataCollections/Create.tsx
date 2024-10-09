import React, { useEffect, useState } from 'react';
import { Input, Text, Flex, Spacer } from '@chakra-ui/react';
import Select from 'react-select';
import { TDataCollection } from '../../types';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { useGetDataCollectionsQuery } from '../../app/services/api';
import { HiPlus } from 'react-icons/hi';

let defaultValues: TDataCollection = {
    name: '',
    description: '',
    workspace: '',
    template: 'default',
    form: {
        active: false,
        type: 'null',
        emails: [],
    },
    columns: [],
    rows: [],
    tags: [],
};

interface IProps {
    addNewDataCollection: any;
}

const Create = ({ addNewDataCollection }: IProps) => {
    const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<TDataCollection>(defaultValues);
    const [inputError, setInputError] = useState<boolean>(false);
    const [selectFormattedDataCollections, setSelectFormattedDataCollections] = useState<any[]>([]);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const formattedDC = [];
        for (const dataCollection of dataCollections || []) {
            // if (dataCollection.asTemplate !== undefined && dataCollection.asTemplate.active) {
            formattedDC.push({ value: dataCollection._id, label: dataCollection.name });
            // }
        }
        setSelectFormattedDataCollections(formattedDC);
    }, [dataCollections]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const createData = async () => {
        const newDataCollection = data;
        addNewDataCollection(newDataCollection);
        setData(defaultValues);
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;

        const dataCollectionNames = dataCollections?.map((dataCollection) => {
            return dataCollection.name;
        });

        if (value.length > 30) {
            setInputError(true);
        } else {
            setInputError(false);
        }

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

    const handleTemplateChange = (selectedOption: any) => {
        console.log(data);
        setData({
            ...data,
            template: selectedOption.value,
        });
    };

    const handleOnClose = () => {
        setData(defaultValues);
        setIsError(false);
        setInputError(false);
        onClose();
    };

    return (
        <>
            <PrimaryButton onClick={showDrawer} px="0" size="sm">
                <HiPlus size={'18px'} />
            </PrimaryButton>
            <PrimaryDrawer title="Create a new data collection" onClose={handleOnClose} isOpen={open}>
                <Flex>
                    <Text pb={'5px'}>Name</Text>
                    <Text ml={'8px'} pt={'2px'} fontSize={'14px'} color={'#e53e3e'}>
                        {inputError ? '* Name exceeds character limit' : ''}
                        {isError ? '* Name already exists' : ''}
                    </Text>
                </Flex>
                <Input
                    name="name"
                    placeholder="Please enter data collection name"
                    value={data.name}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
                <Text pb={'5px'}>Template</Text>
                <Select
                    id="columnType"
                    name="columnType"
                    placeholder="Please select template"
                    onChange={(selectedOption: any) => handleTemplateChange(selectedOption)}
                    options={[
                        { value: 'default', label: 'Default' },
                        { value: 'tasks', label: 'Task List' },
                    ].concat(selectFormattedDataCollections)}
                    styles={
                        {
                            control: (styles: any) => {
                                return { ...styles, borderColor: '#e2e8f0', marginBottom: '20px' };
                            },
                        } as any
                    }
                />
                <Flex>
                    <Spacer />
                    <PrimaryButton onClick={createData} isDisabled={inputError || isError}>
                        SAVE
                    </PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default Create;
