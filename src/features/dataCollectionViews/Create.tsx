import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { HiPlus } from 'react-icons/hi';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { Box, Flex, FormControl, FormLabel, Input, MenuItem, Select, Spacer, Switch, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TDataCollection } from '../../types';
import { useCreateDataCollectionViewsMutation, useGetWorkspaceColumnsQuery, useUpdateDataCollectionViewMutation } from '../../app/services/api';

const Create = ({ dataCollections, view = null, dataCollection }: { dataCollections: TDataCollection[]; view?: any; dataCollection?: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const { data: dataCollection } = useGetDataCollectionQuery(view?.dataCollection);
    const { data: workspaceColumns } = useGetWorkspaceColumnsQuery(null);
    const [updateDataCollectionView] = useUpdateDataCollectionViewMutation();
    const [createDataCollectionView] = useCreateDataCollectionViewsMutation();

    // const { data: dataCollectionColumns } = useGetColumnsQuery(dataCollection?._id);

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
              }
    );

    const [columns, setColumns] = useState([]);

    const [inputError, setInputError] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const newColumns: any = workspaceColumns?.filter((workspaceColumn) => {
            return workspaceColumn.dataCollection === view?.dataCollection;
        });

        setColumns(newColumns);

        console.log(dataCollection);

        // const newViewColumns = view?.columns.map((col: any) => {
        //     return col._id;
        // });

        // setDataCollectionView({ ...dataCollectionView, columns: newViewColumns });
    }, [view, workspaceColumns, dataCollection]);

    const handleOnOpen = () => {
        onOpen();

        console.log(dataCollection);
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

    const createData = () => {
        if (view) {
            console.log('Call update');
            updateDataCollectionView(dataCollectionView);
        } else {
            createDataCollectionView(dataCollectionView);
        }
        onClose();
        setDataCollectionView({
            name: '',
            description: '',
            workspace: localStorage.getItem('workspaceId'),
            dataCollection: '',
            columns: [],
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
                              console.log(dataCollectionView.columns);
                              return (
                                  <>
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
                                                      console.log(dataCollectionView);
                                                      if (event.target.checked) {
                                                          setDataCollectionView({ ...dataCollectionView, columns: [...dataCollectionView.columns, col] });
                                                      } else {
                                                          const filteredSelectedColumns: any = dataCollectionView.columns.filter((selectedColumn: any) => {
                                                              console.log(selectedColumn);
                                                              return selectedColumn._id !== col._id;
                                                          });
                                                          console.log(filteredSelectedColumns);
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
                                  </>
                              );
                          })
                        : null}
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
