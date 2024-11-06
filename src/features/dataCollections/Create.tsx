import React, { useEffect, useState } from 'react';
import { Input, Text, Flex, Spacer, Checkbox } from '@chakra-ui/react';
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
    primaryColumnName: '',
    form: {
        active: false,
        type: 'null',
        emails: [],
    },
    columns: [],
    rows: [],
    tags: [],
    appModel: null,
    main: true,
    belongsToAppModel: false,
    inParentToDisplay: null,
    appType: null,
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
    const [autoIncrementCheckboxChecked, setAutoIncrementCheckboxChecked] = useState(false);
    const [appModelChecked, setAppModelChecked] = useState(false);
    const [inParentToDisplaySelection, setInParentToDisplaySelection] = useState<string | null>(null);
    const [appType, setAppType] = useState<string | null>(null);

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
        addNewDataCollection({ ...newDataCollection, inParentToDisplay: inParentToDisplaySelection, appType: appType });
        setData(defaultValues);
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;

        console.log(data);

        const dataCollectionNames = dataCollections?.map((dataCollection) => {
            if (!dataCollection.main) {
                return '';
            }
            return dataCollection.name;
        });

        if (name === 'name' && value.length > 30) {
            setInputError(true);
        } else {
            setInputError(false);
        }

        if (name === 'description' && value.length > 100) {
            setInputError(true);
        } else {
            setInputError(false);
        }

        console.log(dataCollectionNames, value);

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
        setAppModelChecked(false);
        setAutoIncrementCheckboxChecked(false);
        setAppType(null);
        setInParentToDisplaySelection(null);
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
                <Text pb={'5px'}>Description</Text>
                <Input
                    name="description"
                    placeholder="Please enter a description"
                    value={data.description}
                    required={false}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
                <Flex>
                    <Text pb={'5px'}>Primary Column Name</Text>
                    <Spacer />
                    <Checkbox
                        isChecked={autoIncrementCheckboxChecked}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (event.target.checked) {
                                setAutoIncrementCheckboxChecked(true);
                                setData({ ...data, autoIncremented: true });
                            } else {
                                setAutoIncrementCheckboxChecked(false);
                                setData({ ...data, autoIncremented: false });
                            }
                        }}
                    >
                        Auto Increment
                    </Checkbox>
                </Flex>
                <Input
                    name="primaryColumnName"
                    placeholder="Please enter primary column name"
                    value={data.primaryColumnName}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
                <>
                    {autoIncrementCheckboxChecked ? (
                        <>
                            <Text pb={'5px'}>Auto Generated Value Prefix</Text>
                            <Input
                                name="autoIncrementPrefix"
                                placeholder="Please enter a prefix"
                                value={data.autoIncrementPrefix}
                                // required={true}
                                onChange={handleChange}
                                style={{ marginBottom: '15px' }}
                            />
                        </>
                    ) : null}
                </>
                <Flex>
                    <Text pb={'5px'}>Template</Text>
                </Flex>
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
                    <Text pb={'5px'}>Row App</Text>
                    <Spacer />
                    <Checkbox
                        isChecked={appModelChecked}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (event.target.checked) {
                                setAppModelChecked(true);
                                setAppType('planner');
                            } else {
                                setAppModelChecked(false);
                                setInParentToDisplaySelection(null);
                                setAppType(null);
                            }
                        }}
                    >
                        For row interface
                    </Checkbox>
                </Flex>
                <Select
                    id={'appModelDataCollection'}
                    name={'appModelDataCollection'}
                    placeholder={'Please select data collection'}
                    isDisabled={!appModelChecked}
                    onChange={(selectedOption: any) => {
                        setInParentToDisplaySelection(selectedOption.value);
                    }}
                    options={dataCollections
                        ?.filter((dc: any) => {
                            return dc.main === true;
                        })
                        .map((dc: any) => {
                            return { value: dc._id, label: dc.name };
                        })}
                    styles={
                        {
                            control: (styles: any) => {
                                return { ...styles, borderColor: '#e2e8f0', marginBottom: '20px' };
                            },
                        } as any
                    }
                />
                <Select
                    id={'appType'}
                    name={'appType'}
                    placeholder={'Please select type of row app'}
                    isDisabled={!appModelChecked}
                    onChange={(selectedOption: any) => {
                        console.log(selectedOption.value);
                        setAppType(selectedOption.value);
                    }}
                    options={[{ value: 'planner', label: 'Planner' }]}
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
