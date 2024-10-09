import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { HiPlus } from 'react-icons/hi';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import {
    Box,
    Card,
    CardBody,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Spacer,
    Switch,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { TDataCollection } from '../../types';
import { useCreateDataCollectionViewsMutation, useGetWorkspaceColumnsQuery, useUpdateDataCollectionViewMutation } from '../../app/services/api';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import { CloseIcon } from '@chakra-ui/icons';

const Create = ({ dataCollections, view = null, dataCollection }: { dataCollections: TDataCollection[]; view?: any; dataCollection?: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const { data: dataCollection } = useGetDataCollectionQuery(view?.dataCollection);
    const { data: workspaceColumns } = useGetWorkspaceColumnsQuery(null);
    const [updateDataCollectionView] = useUpdateDataCollectionViewMutation();
    const [createDataCollectionView] = useCreateDataCollectionViewsMutation();

    // const { data: dataCollectionColumns } = useGetColumnsQuery(dataCollection?._id);
    const [columns, setColumns] = useState([]);
    const [isPublic, setIsPublic] = useState(view ? view.public : false);

    const [dataCollectionView, setDataCollectionView] = useState<any>(
        view
            ? view
            : {
                  name: '',
                  description: '',
                  workspace: localStorage.getItem('workspaceId'),
                  dataCollection: '',
                  columns: [],
                  viewers: [localStorage.getItem('userId')],
                  filters: null,
                  public: false,
              }
    );

    const [inputError, setInputError] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (view !== null) {
            setDataCollectionView(view);
        } else {
            setDataCollectionView({
                name: '',
                description: '',
                workspace: localStorage.getItem('workspaceId'),
                dataCollection: '',
                columns: [],
                viewers: [localStorage.getItem('userId')],
                filters: null,
                public: false,
            });
        }
    }, []);

    useEffect(() => {
        const newColumns: any = workspaceColumns?.filter((workspaceColumn) => {
            return workspaceColumn.dataCollection === view?.dataCollection;
        });

        if (newColumns !== undefined) {
            setColumns(newColumns);
        }

        // const newViewColumns = view?.columns.map((col: any) => {
        //     return col._id;
        // });

        // setDataCollectionView({ ...dataCollectionView, columns: newViewColumns });
    }, [view, workspaceColumns, dataCollection]);

    useEffect(() => {
        const newColumns: any = workspaceColumns?.filter((workspaceColumn) => {
            return workspaceColumn.dataCollection === view?.dataCollection;
        });

        const filters: any = {};

        if (newColumns !== undefined) {
            for (const col of newColumns) {
                filters[col.name] = [];
            }

            setDataCollectionView({ ...dataCollectionView, filters: filters });
        }

        // const newViewColumns = view?.columns.map((col: any) => {
        //     return col._id;
        // });

        // setDataCollectionView({ ...dataCollectionView, columns: newViewColumns });
    }, [workspaceColumns]);

    const handleOnOpen = () => {
        onOpen();

        const newColumns: any = workspaceColumns?.filter((workspaceColumn) => {
            return workspaceColumn.dataCollection === view?.dataCollection;
        });

        setColumns(newColumns);

        if (view) setDataCollectionView({ ...view });
    };

    const handleOnClose = () => {
        // setData(defaultValues);
        setIsError(false);
        setInputError(false);
        onClose();
    };

    const createData = async () => {
        if (view) {
            updateDataCollectionView(dataCollectionView);
        } else {
            await createDataCollectionView(dataCollectionView);
        }
        onClose();
        setDataCollectionView({
            name: '',
            description: '',
            workspace: localStorage.getItem('workspaceId'),
            dataCollection: '',
            columns: [],
            public: false,
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setDataCollectionView({ ...dataCollectionView, [name]: value });
    };
    return (
        <>
            {view ? (
                <MenuItem onClick={handleOnOpen}>
                    <Text>Edit view</Text>
                </MenuItem>
            ) : (
                <PrimaryButton onClick={handleOnOpen} px="0" size="sm">
                    <HiPlus size={'18px'} />
                </PrimaryButton>
            )}
            <PrimaryDrawer title="Create a new view" onClose={handleOnClose} isOpen={isOpen}>
                <Flex>
                    <Text pb={'5px'}>Name</Text>
                    <Text ml={'8px'} pt={'2px'} fontSize={'14px'} color={'#e53e3e'}>
                        {inputError ? '* Name exceeds character limit' : ''}
                        {isError ? '* Name already exists' : ''}
                    </Text>
                    <Spacer />
                    <Checkbox
                        isChecked={isPublic}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (event.target.checked) {
                                setIsPublic(true);
                                setDataCollectionView({ ...dataCollectionView, public: true });
                            } else {
                                setIsPublic(false);
                                setDataCollectionView({ ...dataCollectionView, public: false });
                            }
                        }}
                    >
                        Public
                    </Checkbox>
                </Flex>
                <Input
                    name="name"
                    placeholder="Please enter view name"
                    value={dataCollectionView.name}
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
                <Flex>
                    <Text pb={'5px'}>Description</Text>
                    <Text ml={'8px'} pt={'2px'} fontSize={'14px'} color={'#e53e3e'}>
                        {inputError ? '* Name exceeds character limit' : ''}
                    </Text>
                </Flex>
                <Input
                    name="description"
                    placeholder="Please enter view description"
                    value={dataCollectionView.description}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                />
                <Text pb={'5px'}>Data Colletion</Text>
                <Select
                    id="dataCollection"
                    name="dataCollection"
                    placeholder={dataCollection !== undefined ? dataCollection?.name : 'Please select a data collection'}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                        setDataCollectionView({ ...dataCollectionView, dataCollection: event.target.value, columns: [] });
                        const newColumns: any = workspaceColumns?.filter((workspaceColumn) => {
                            return workspaceColumn.dataCollection === event.target.value;
                        });

                        setColumns(newColumns);
                    }}
                >
                    {dataCollections?.map((dc) => {
                        return (
                            <option key={dc.name} value={dc._id}>
                                {dc.name}
                            </option>
                        );
                    })}
                </Select>
                <Box mt={'20px'} mb={'20px'}>
                    {columns?.length > 0
                        ? columns?.map((col: any) => {
                              return (
                                  <Box key={col.name}>
                                      <Flex>
                                          <FormControl display="flex" alignItems="center">
                                              <Switch
                                                  id="email-alerts"
                                                  isChecked={dataCollectionView.columns
                                                      .map((c: any) => {
                                                          return c._id;
                                                      })
                                                      .includes(col._id)}
                                                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                      if (event.target.checked) {
                                                          setDataCollectionView({ ...dataCollectionView, columns: [...dataCollectionView.columns, col] });
                                                      } else {
                                                          const filteredSelectedColumns: any = dataCollectionView.columns.filter((selectedColumn: any) => {
                                                              return selectedColumn._id !== col._id;
                                                          });
                                                          setDataCollectionView({ ...dataCollectionView, columns: filteredSelectedColumns });
                                                      }
                                                  }}
                                                  mr={'12px'}
                                                  size={'sm'}
                                              />
                                              <FormLabel htmlFor="email-alerts" mb="0" fontWeight={'normal'}>
                                                  {`${col?.name[0].toUpperCase()}${col?.name.slice(1, col?.name.length).split('_').join(' ')}`}
                                              </FormLabel>
                                          </FormControl>
                                          <Spacer />
                                          {/* {dataCollectionView.columns
                                              .map((c: any) => {
                                                  return c._id;
                                              })
                                              .includes(col._id) ? (
                                              <Text>Something</Text>
                                          ) : null} */}
                                      </Flex>
                                  </Box>
                              );
                          })
                        : null}
                </Box>
                <Box mb={'10px'}>
                    {dataCollectionView.columns.map((col: any) => {
                        return (
                            <Card key={col.name} mb={'5px'}>
                                <CardBody>
                                    <Flex>
                                        <Text>{`${col?.name[0].toUpperCase()}${col?.name.slice(1, col?.name.length).split('_').join(' ')}`}</Text>
                                        <Text ml={'20px'} fontSize={'10px'} mt={'6px'}>
                                            {dataCollectionView.filters && Object.keys(dataCollectionView.filters).includes(col.name)
                                                ? `Filter by: ${dataCollectionView.filters[col.name]}`
                                                : ''}
                                        </Text>
                                        <Spacer />
                                        <Box pt={'5px'}>
                                            <FilterModal
                                                column={col}
                                                onChange={(newValues: any) => {
                                                    setDataCollectionView({
                                                        ...dataCollectionView,
                                                        filters: {
                                                            ...dataCollectionView.filters,
                                                            [col.name]: newValues,
                                                        },
                                                    });
                                                }}
                                                filterValues={dataCollectionView.filters ? dataCollectionView?.filters[col.name] : []}
                                                handleRemoveFilter={(columnName: string) => {
                                                    let filters = dataCollectionView.filters;
                                                    if (filters[columnName] !== undefined) {
                                                        filters = Object.fromEntries(Object.entries(filters).filter(([key]) => key !== columnName));
                                                        setDataCollectionView({ ...dataCollectionView, filters: filters });
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Flex>
                                </CardBody>
                            </Card>
                        );
                    })}
                </Box>
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

const FilterModal = ({
    column,
    onChange,
    filterValues = [],
    handleRemoveFilter,
}: {
    column: any;
    onChange: any;
    filterValues: any;
    handleRemoveFilter: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef(null);
    const finalRef = useRef(null);

    const [value, setValue] = useState('');
    const [values, setValues] = useState(filterValues);

    const handleRemoveFilterClick = (v: any) => {
        const newFilters = values.filter((val: any) => {
            return val !== v;
        });

        setValues(newFilters);
        onChange(newFilters);

        if (newFilters.length === 0) {
            handleRemoveFilter(column.name);
        }
    };
    return (
        <>
            <Box cursor={'pointer'} ref={finalRef} tabIndex={-1}>
                <Text fontSize={'20px'} onClick={onOpen}>
                    <PiDotsThreeVerticalBold />
                </Text>
            </Box>
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Filter</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={'5px'}>{`Value to filter '${column?.name[0].toUpperCase()}${column?.name
                            .slice(1, column?.name.length)
                            .split('_')
                            .join(' ')}' by`}</Text>
                        <Flex>
                            <Input
                                ref={initialRef}
                                value={value}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setValue(event.target.value);
                                }}
                                mr={'6px'}
                            />
                            <PrimaryButton
                                onClick={() => {
                                    const newValues = [...values, value];
                                    setValues(newValues);
                                    onChange(newValues);
                                    setValue('');
                                }}
                            >
                                Add
                            </PrimaryButton>
                        </Flex>
                        <Box mt={'10px'}>
                            {values.length > 0
                                ? values.map((val: any, index: number) => {
                                      return (
                                          <Card mb={'6px'} key={index}>
                                              <CardBody p={'3px'} px={'10px'}>
                                                  <Flex>
                                                      <Text mt={'5px'} fontSize={'14px'}>
                                                          {val}
                                                      </Text>
                                                      <Spacer />
                                                      <Box onClick={() => handleRemoveFilterClick(val)} cursor={'pointer'}>
                                                          <Text fontSize={'10px'} mt={'6px'}>
                                                              <CloseIcon />
                                                          </Text>
                                                      </Box>
                                                  </Flex>
                                              </CardBody>
                                          </Card>
                                      );
                                  })
                                : null}
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        {/* {filterValues.length > 0 ? (
                            <Button
                                mr={'5px'}
                                onClick={() => {
                                    handleRemoveFilter(column.name);
                                    onClose();
                                }}
                            >
                                Remove Filter
                            </Button>
                        ) : null} */}
                        {/* <PrimaryButton onClick={onClose}>Save</PrimaryButton> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
