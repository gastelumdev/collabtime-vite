import { useEffect, useRef, useState } from 'react';
import {
    useAcknowledgeRowMutation,
    useGetColumnsQuery,
    useGetDataCollectionQuery,
    useGetDataCollectionsQuery,
    useGetOneWorkspaceQuery,
    useGetRowsQuery,
    useGetUserQuery,
    useSendFormMutation,
    useUpdateColumnMutation,
    useUpdateDataCollectionMutation,
} from '../../app/services/api';
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Container,
    Divider,
    Flex,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Spacer,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import Select from 'react-select';

import LinkItems from '../../utils/linkItems';

import SideBarLayout from '../../components/Layouts/SideBarLayout';
import DataCollection from './DataCollection';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { cellColorStyles } from './select.styles';
import { TColumn } from '../../types';
import LinksMenu from './LinksMenu';
import { MdContentCopy } from 'react-icons/md';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { CSVLink } from 'react-csv';

const ViewOne = () => {
    const { id, dataCollectionId } = useParams();
    const { pathname } = useLocation();
    const [queryParameters] = useSearchParams();
    const { onClose, onOpen, isOpen } = useDisclosure();
    const { onClose: onCloseFormDrawer, onOpen: onOpenFormDrawer, isOpen: isOpenFormDrawer } = useDisclosure();
    const toast = useToast();
    const finalRef = useRef<any>(null);

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: dataCollection } = useGetDataCollectionQuery(dataCollectionId || '');
    const { data: workspace, isFetching: workspaceIsFetching } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');
    const { data: rows } = useGetRowsQuery({ dataCollectionId: dataCollectionId || '', limit: 0, skip: 0, sort: 1, sortBy: 'createdAt' });
    const { data: dataCollections } = useGetDataCollectionsQuery(null);
    const { data: columnsData } = useGetColumnsQuery(localStorage.getItem('dataCollectionId') || '');
    const [updateColumn] = useUpdateColumnMutation();

    const [updateDataCollection] = useUpdateDataCollectionMutation();
    const [sendForm] = useSendFormMutation();

    const [columns, setColumns] = useState(columnsData);

    const [acknowledgeRow] = useAcknowledgeRowMutation();

    const [isTemplate, setIsTemplate] = useState<boolean>(false);
    const [templateNameValue, setTemplateNameValue] = useState<string>('');

    const [existingTemplateNames, setExistingTemplateNames] = useState<string[]>([]);
    const [templateExists, setTemplateExists] = useState<boolean>(false);

    const [recipientValue, setRecipientValue] = useState<string>('');

    const [valuesForExport, setValuesForExport] = useState<any>('');

    const [checkBoxes, setCheckBoxes] = useState<any>(
        Array(columns?.length)
            .fill(null)
            .map((_: any) => {
                return true;
            })
    );

    const [showDoneRows, setShowDoneRows] = useState<boolean>(true);

    const [permissions, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    useEffect(() => {
        for (const column of columns || []) {
            if (column.type === 'status') {
                setShowDoneRows(true);
            }
        }
        setColumns(columnsData);
    }, [columnsData]);

    useEffect(() => {
        setCheckBoxes(
            Array(columns?.length)
                .fill(null)
                .map((_: any, index: number) => {
                    const columnsCopy: any = columns;
                    const column: any = columnsCopy !== undefined ? columnsCopy[index] : {};
                    return column.includeInForm;
                })
        );
    }, [columns]);

    useEffect(() => {
        localStorage.setItem('workspaceId', id || '');
        localStorage.setItem('dataCollectionId', dataCollectionId || '');

        const dataCollectionCopy: any = dataCollection;

        if (dataCollectionCopy?.asTemplate !== undefined && dataCollectionCopy?.asTemplate?.active == true) {
            setIsTemplate(true);
        }
    }, [dataCollection]);

    useEffect(() => {
        const templateNames = [];
        for (const dataCollection of dataCollections || []) {
            if (dataCollection.asTemplate !== undefined && dataCollection.asTemplate.active) {
                templateNames.push(dataCollection.asTemplate.name.toLowerCase());
            }
        }
        setExistingTemplateNames(templateNames);
    }, [dataCollections]);

    useEffect(() => {
        const acknowledgedRowId = queryParameters.get('acknowledgedRow');
        if (acknowledgedRowId && acknowledgedRowId !== undefined) {
            acknowledgeRow(acknowledgedRowId || '');
        }
    }, [queryParameters]);

    useEffect(() => {
        const valsForExport: any = [];
        const rowsCopy: any = rows;
        const columnsCopy: any = columnsData;

        if (columnsCopy !== undefined) {
            const key: any = columnsCopy[0].name;
            for (const row of rowsCopy || []) {
                let values: any = {};

                for (const column of columnsCopy || []) {
                    if (column.type === 'reference') {
                        if (row.refs !== undefined && row.refs[column.name] !== undefined) {
                            const refs: any = row.refs[column.name];
                            let refsString = '';
                            for (const ref of refs) {
                                refsString += `${ref.values[key]}, `;
                            }
                            values[column.name] = refsString;
                        } else {
                            values[column.name] = '';
                        }
                    } else {
                        values[column.name] = row.values[column.name];
                    }
                }

                valsForExport.push(values);
            }
            setValuesForExport(valsForExport);
        }
    }, [rows, columnsData]);

    const handleAddAsTemplateClick = () => {
        if (templateNameValue === '') return;
        const dataCollectionCopy: any = dataCollection;
        updateDataCollection({
            ...dataCollectionCopy,
            asTemplate: { active: true, name: templateNameValue },
        });
        onClose();

        toast({
            title: `Your template has been created.`,
            description: `Click "NEW COLLECTION" in the Data Collections page and select "${templateNameValue}" in the template dropdown to use this template.`,
            status: 'info',
            duration: 9000,
            isClosable: true,
        });
    };

    const handleAddRecipientClick = () => {
        const dataCollectionCopy: any = dataCollection;
        const formRecipientsCopy: any = dataCollection?.formRecipients;

        sendForm({ email: recipientValue });

        updateDataCollection({
            ...dataCollectionCopy,
            formRecipients: [...formRecipientsCopy, { email: recipientValue, sent: false }],
        });

        setRecipientValue('');
    };

    const handleDeleteRecipientClick = (formRecipient: any) => {
        const dataCollectionCopy: any = dataCollection;
        const formRecipientsCopy: any = dataCollection?.formRecipients;

        const filteredFormRecipients = formRecipientsCopy.filter((item: any) => {
            return item.email !== formRecipient.email;
        });

        updateDataCollection({
            ...dataCollectionCopy,
            formRecipients: filteredFormRecipients,
        });
    };

    return (
        <>
            <SideBarLayout linkItems={LinkItems}>
                <Box>
                    {/* <Flex
                        minH={'100vh'}
                        // justify={"center"}
                        bg={'#eff2f5'}
                    > */}
                    <Container
                        maxW={'full'}
                        // w={"100%"}
                        mt={{ base: 4, sm: 0 }}
                        p={1}
                        // px={'20px'}
                    >
                        {/* <SimpleGrid
                                spacing={6}
                                // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                                columns={{ base: 1, sm: 2 }}
                                pb={"30px"}
                            >
                                <Flex>
                                    <Box>
                                        <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                            Data Collections
                                        </Heading>
                                        <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                            Create data collection tables to visualize and manage your data.
                                        </Text>
                                    </Box>
                                </Flex>
                            </SimpleGrid> */}
                        <Card w={'100%'}>
                            <CardHeader>
                                <SimpleGrid
                                    spacing={6}
                                    // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                                    columns={{ base: 1, sm: 2 }}
                                    pb={'14px'}
                                >
                                    <Flex>
                                        <Box>
                                            <Heading size={'sm'} mt={'5px'} mb={'4px'} color={'#666666'} fontWeight={'semibold'}>
                                                {!workspaceIsFetching ? `${workspace?.name} - ${dataCollection?.name}` : null}
                                            </Heading>
                                            <Text fontSize={'md'} color={'rgb(123, 128, 154)'}>
                                                {dataCollection?.description}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    {(permissions || 0) > 1 ? (
                                        <Flex>
                                            <Spacer />
                                            {/* <Box mr={'5px'}>
                                                <PrimaryButton
                                                    onClick={() => {
                                                        console.log(showDoneRows);
                                                        setShowDoneRows(!showDoneRows);
                                                    }}
                                                    size="sm"
                                                >
                                                    {`${showDoneRows ? 'Hide' : 'Show'} Done`}
                                                </PrimaryButton>
                                            </Box> */}
                                            <Box mr={'5px'}>
                                                <PrimaryButton onClick={onOpenFormDrawer} size="sm">
                                                    Form
                                                </PrimaryButton>
                                            </Box>
                                            {!isTemplate ? (
                                                <Box mr={'5px'}>
                                                    <PrimaryButton onClick={onOpen} size="sm">
                                                        <AddIcon style={{ marginRight: '4px' }} /> Template
                                                    </PrimaryButton>
                                                </Box>
                                            ) : null}
                                            <Box>
                                                {valuesForExport !== undefined ? (
                                                    <PrimaryButton size="sm">
                                                        <CSVLink data={valuesForExport}>Export</CSVLink>
                                                    </PrimaryButton>
                                                ) : null}
                                            </Box>
                                        </Flex>
                                    ) : null}
                                </SimpleGrid>
                            </CardHeader>
                            <CardBody p={'0'}>
                                <DataCollection showDoneRows={showDoneRows} />
                            </CardBody>
                        </Card>

                        {/* </SimpleGrid> */}
                    </Container>
                    {/* </Flex> */}
                </Box>
                <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size={'2xl'}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create template</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text mb={'30px'}>
                                Creating a template will allow you to create a data collection with the same columns. After naming and creating it, go to create
                                a new data collection and your new template will be available under the template options.
                            </Text>
                            <Text mb={'5px'}>Template Name</Text>
                            <Input
                                value={templateNameValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    if (existingTemplateNames.includes(event.target.value.toLowerCase())) {
                                        setTemplateExists(true);
                                    } else {
                                        setTemplateExists(false);
                                    }
                                    setTemplateNameValue(event.target.value);
                                }}
                            />
                            <Box h={'15px'}>{templateExists ? <Text color={'red'}>A template with that name already exists.</Text> : null}</Box>
                        </ModalBody>

                        <ModalFooter>
                            <PrimaryButton onClick={handleAddAsTemplateClick} isDisabled={templateExists}>
                                CREATE
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <PrimaryDrawer title={`${dataCollection?.name} Form`} isOpen={isOpenFormDrawer} onClose={onCloseFormDrawer} size="full">
                    <Box w={{ md: '100%', lg: '50%' }} float={{ lg: 'left' }} pr={{ lg: '20px' }}>
                        <Text fontSize={'14px'} mb={'5px'}>
                            Form link
                        </Text>
                        <Box p={'10px'} h={'44px'} border={'1px solid #e2e8f0'} mb={'20px'}>
                            <Flex>
                                <Box overflow={'hidden'} h={'20px'} mr={'10px'} textOverflow={'ellipsis'}>
                                    <Text fontSize={'14px'} overflow={'hidden'} textOverflow={'ellipsis'}>
                                        <a
                                            href={`${import.meta.env.VITE_HOST_URL}${pathname}/form`}
                                            target="_blank"
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >{`${import.meta.env.VITE_HOST_URL}${pathname}/form`}</a>
                                    </Text>
                                </Box>
                                <Box
                                    pt={'3px'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${import.meta.env.VITE_HOST_URL}${pathname}/form`);
                                        toast({
                                            title: `Copied to clipboard`,
                                            position: 'top-right',
                                            status: 'info',
                                        });
                                    }}
                                >
                                    <MdContentCopy />
                                </Box>
                            </Flex>
                        </Box>
                        <Box>
                            <Text fontSize={'14px'}>Send by email</Text>
                            <Flex mt={'5px'}>
                                <Box mr={'5px'} w={'100%'}>
                                    <Input
                                        value={recipientValue}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRecipientValue(event.target.value)}
                                    />
                                </Box>
                                <PrimaryButton onClick={handleAddRecipientClick}>ADD</PrimaryButton>
                            </Flex>
                        </Box>
                        <Box mt={'20px'}>
                            {(dataCollection?.formRecipients?.length || 0) > 0 ? (
                                dataCollection?.formRecipients?.map((formRecipient: any, index: number) => {
                                    return (
                                        <Box key={index}>
                                            <Flex>
                                                <Text
                                                    fontSize={'12px'}
                                                    pt={'4px'}
                                                    mr={'10px'}
                                                    onClick={() => handleDeleteRecipientClick(formRecipient)}
                                                    cursor={'pointer'}
                                                >
                                                    <CloseIcon />
                                                </Text>
                                                <Text>{formRecipient.email}</Text>
                                            </Flex>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Text>No Recipients</Text>
                            )}
                        </Box>
                    </Box>
                    <Box w={{ md: '100%', lg: '50%' }} float={{ lg: 'right' }} pl={{ lg: '20px' }}>
                        <Box>
                            <Box mb={'20px'} fontSize={'14px'}>
                                <Text>This form is not functional and only used to dispaly the form elements.</Text>
                                <Text>Checkmark all the form elements to include in the form.</Text>
                            </Box>

                            <Box>
                                {columns?.map((column: TColumn, index: number) => {
                                    let bgColor: string = '';
                                    const labels: any = column?.labels || [];
                                    const label: any = labels[0] || null;
                                    bgColor = label ? label.color : '';

                                    const options: any = column.labels?.map((item) => {
                                        return {
                                            value: item.title,
                                            label: item.title,
                                            color: item.color,
                                        };
                                    });
                                    const peopleOptions: any = column.people?.map((item) => {
                                        return {
                                            value: item._id,
                                            label: `${item.firstname} ${item.lastname}`,
                                            color: '#ffffff',
                                        };
                                    });

                                    let option = options[0];
                                    // let peopleOption = peopleOptions[0];

                                    return (
                                        <Box mb={'20px'} key={index}>
                                            <Divider mb={'25px'} mt={'10px'} />
                                            <Flex>
                                                <Text mb={'6px'}>{(column.name[0].toUpperCase() + column.name.slice(1)).split('_').join(' ')}</Text>
                                                <Spacer />
                                                <Checkbox
                                                    mb={'6px'}
                                                    isChecked={checkBoxes[index]}
                                                    onChange={() => {
                                                        setCheckBoxes((prev: any) =>
                                                            prev.map((checkBox: boolean, checkboxIndex: number) => {
                                                                if (index === checkboxIndex) return !checkBox;
                                                                return checkBox;
                                                            })
                                                        );
                                                        updateColumn({
                                                            ...column,
                                                            includeInForm: !column.includeInForm,
                                                        });
                                                    }}
                                                />
                                            </Flex>
                                            {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                                <Box w={'100%'}>
                                                    <Select
                                                        options={options}
                                                        styles={cellColorStyles({
                                                            bgColor,
                                                            padding: '7px',
                                                        })}
                                                        defaultValue={option}
                                                        // onChange={(newValue) => handleLabelSelectChange(newValue, cell)}
                                                        // isDisabled={rowsLoading || rowsFetching || !((permissions || 0) > 1)}
                                                    />
                                                </Box>
                                            ) : column.type === 'people' ? (
                                                <Select
                                                    options={peopleOptions}
                                                    styles={cellColorStyles({
                                                        bgColor: '#ffffff',
                                                        padding: '7px',
                                                        border: '1px solid #e2e8f0',
                                                    })}
                                                    // defaultValue={peopleOption}
                                                    // onChange={(newValue) => handleLabelSelectChange(newValue, cell)}
                                                    // isDisabled={rowsLoading || rowsFetching || !((permissions || 0) > 1)}
                                                />
                                            ) : column.type === 'date' ? (
                                                <input
                                                    type="datetime-local"
                                                    // defaultValue={column.value.slice(0, 16)}
                                                    style={{
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '5px',
                                                        width: '100%',
                                                        padding: '6px',
                                                    }}
                                                    name={column.name}
                                                    // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    //     handleUpdateRowInputChange(event);
                                                    // }}
                                                    // onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                    //     handleUpdateRowOnFocus(event, cell)
                                                    // }
                                                    // onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                    //     handleUpdateRowOnBlur(event, cell)
                                                    // }
                                                />
                                            ) : column.type === 'number' ? (
                                                <input
                                                    type="number"
                                                    // defaultValue={cell.value}
                                                    name={column.name}
                                                    // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    //     handleUpdateRowInputChange(event);
                                                    // }}
                                                    // onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                    //     handleUpdateRowOnFocus(event, cell)
                                                    // }
                                                    // onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                    //     handleUpdateRowOnBlur(event, cell)
                                                    // }
                                                    // disabled={
                                                    //     rowsLoading || rowsFetching || !((permissions || 0) > 1)
                                                    // }
                                                    style={{
                                                        outline: 'none',
                                                        paddingLeft: '15px',
                                                        paddingTop: '6px',
                                                        paddingBottom: '6px',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '5px',
                                                        width: '100%',
                                                    }}
                                                />
                                            ) : column.type === 'upload' ? (
                                                <Box>
                                                    {/* <UploadMenu
                                                        // cell={cell}
                                                        // docs={cell.docs}
                                                        addToCell={false}
                                                        // handleDocsChange={handleCellDocsChange}
                                                        // handleAddExistingDoc={handleAddExistingDoc}
                                                        // handleAddExistingDocToCell={handleAddExistingDocToCell}
                                                        create={false}
                                                        columnName={column.name}
                                                        topPadding="7px"
                                                        border={true}
                                                    /> */}
                                                </Box>
                                            ) : column.type === 'link' ? (
                                                <Box>
                                                    <LinksMenu
                                                        // cell={cell}
                                                        topPadding="7px"
                                                        border={true}
                                                        // handleAddLinkClick={handleAddLinkClick}
                                                    />
                                                </Box>
                                            ) : (
                                                <Input
                                                    value={''}
                                                    size={'md'}
                                                    w={'100%'}
                                                    // variant={"unstyled"}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        event;
                                                    }}
                                                    // onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                    //     handleUpdateRowOnFocus(event, cell)
                                                    // }
                                                    // onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                    //     handleUpdateRowOnBlur(event, cell)
                                                    // }
                                                    // // isDisabled={rowsLoading || deletingRows || creatingRow || rowsFetching}
                                                    // isReadOnly={!((permissions || 0) > 1)}
                                                />
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </PrimaryDrawer>
            </SideBarLayout>
        </>
        // </Layout>
    );
};

export default ViewOne;
