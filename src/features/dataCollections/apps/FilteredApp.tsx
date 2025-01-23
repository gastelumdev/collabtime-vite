import { Box, Text } from '@chakra-ui/react';
import { useGetRowByIdQuery, useGetRowsQuery } from '../../../app/services/api';
import DataCollection from '../DataCollection';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FilteredApp = ({
    dataCollection,
    dataCollectionId,
    // appModel,
    userGroup,
}: {
    dataCollection: any;
    dataCollectionId?: string;
    appModel: string;
    userGroup: any;
}) => {
    const { rowId } = useParams();
    const {
        data: rowsData,
        refetch,
        // isFetching: rowsAreFetching,
        // isLoading: rowsAreLoading,
    } = useGetRowsQuery({
        dataCollectionId: dataCollectionId || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        // filters: JSON.stringify(dataCollection.filters),
    });
    const { data: row } = useGetRowByIdQuery(rowId);

    const [data, setData] = useState(
        rowsData?.filter((item: any) => {
            return !item.isEmpty;
        })
    );

    useEffect(() => {
        const filter = Object.keys(dataCollection.filters)[0];
        if (rowsData !== undefined) {
            const filteredData = rowsData?.filter((item: any) => {
                if (item.refs !== undefined) {
                    const refs = item.refs[filter];

                    for (const ref of refs) {
                        if (row !== undefined) {
                            if (ref._id == row._id) {
                                return true;
                            }
                        }
                    }
                } else {
                    return false;
                }

                // return !item.isEmpty;
            });
            if (filteredData !== undefined) {
                setData(filteredData as any);
            }
        }
    }, [rowsData, row]);

    const [dataCollectionPermissions, setDataCollectionPermissions] = useState(null);

    useEffect(() => {
        const dcPermissions = userGroup.permissions.dataCollections.find((item: any) => {
            return item.dataCollection === dataCollection.appModel || item.dataCollection === dataCollection._id;
        });

        setDataCollectionPermissions(dcPermissions.permissions);
    }, [rowsData, userGroup]);
    return (
        <Box key={dataCollection.name} mb={'30px'}>
            <Text fontSize={'xl'}>{`${dataCollection.name} ${dataCollection.appType}`}</Text>
            <DataCollection
                showDoneRows={true}
                rowsProp={data}
                hideEmptyRows={true}
                dcId={dataCollectionId}
                appModel={dataCollectionId}
                dataCollectionPermissions={dataCollectionPermissions}
                refetchRowsForApp={refetch}
            />
        </Box>
    );
};

export default FilteredApp;
