import DataCollection from '../dataCollections/DataCollection';
import { useDeleteDataCollectionViewMutation, useGetDataCollectionsQuery, useGetRowsQuery } from '../../app/services/api';
import { useEffect } from 'react';
import { Box, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import Create from './Create';

const View = ({ dataCollectionView }: { dataCollectionView: any }) => {
    const { data: rows } = useGetRowsQuery({
        dataCollectionId: dataCollectionView.dataCollection || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        showEmptyRows: false,
    });
    const [deleteDataCollectionView] = useDeleteDataCollectionViewMutation();
    const { data } = useGetDataCollectionsQuery(null);
    useEffect(() => {
        // console.log(rows);
    }, [rows]);
    return (
        <Box>
            <Divider />
            <Box pt={'25px'} pb={'4px'} mt={'20px'}>
                <Flex>
                    <Text fontSize={'20px'} className="dmsans-400">
                        {dataCollectionView.name}
                    </Text>
                    <Spacer />
                    <Menu>
                        <MenuButton>
                            <Text fontSize={'24px'}>
                                <PiDotsThreeVerticalBold />
                            </Text>
                        </MenuButton>
                        <MenuList fontSize={'14px'}>
                            <Create
                                dataCollections={data!}
                                view={dataCollectionView}
                                dataCollection={data?.find((dc) => {
                                    return dc._id == dataCollectionView.dataCollection;
                                })}
                            />
                            <MenuItem
                                onClick={() => {
                                    deleteDataCollectionView(dataCollectionView._id);
                                }}
                            >
                                <Text>Delete View</Text>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Box>
            <DataCollection
                showDoneRows={true}
                rowsProp={rows}
                dataCollectionView={dataCollectionView}
                rowsAreDraggable={false}
                hasCheckboxOptions={false}
                hasColumnOptions={false}
                columnsAreDraggable={false}
                hasCreateColumn={false}
            />
        </Box>
    );
};

export default View;
