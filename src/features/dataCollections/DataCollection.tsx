import { useEffect, useState } from "react";
import { useGetUserQuery } from "../../app/services/api";
import { useParams } from "react-router-dom";
import DataCollectionTable from "./DataCollectionTable";
import { Box } from "@chakra-ui/react";

const DataCollection = () => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");

    // const { data: columns } = useGetColumnsQuery(dataCollectionId || "");

    // const [limit, setLimit] = useState<number>(20);
    // const [skip, setSkip] = useState<number>(0);
    // const [pageNumber, setPageNumber] = useState<number>((skip + limit) / limit);

    // const [sort, setSort] = useState<number>(1);

    // const {
    //     data: rows,
    //     isLoading: rowsLoading,
    //     isFetching: rowsFetching,
    //     isSuccess: rowsSuccess,
    // } = useGetRowsQuery({ dataCollectionId: dataCollectionId || "", limit: limit, skip: skip, sort: sort });
    // const [dataCollectionRows, setDataCollectionRows] = useState(rows);
    // const { data: totalRows } = useGetTotalRowsQuery({ dataCollectionId: dataCollectionId || "", limit: limit });

    // const [pages, setPages] = useState<number[]>(totalRows || []);

    const [permissions, setPermissions] = useState<number>();

    // useEffect(() => {
    //     setDataCollectionRows(rows);
    // }, [rows]);

    // useEffect(() => {
    //     setPages(totalRows);
    // }, [totalRows]);

    useEffect(() => {
        getPermissions();
    }, [user]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem("workspaceId")) {
                setPermissions(workspace.permissions);
            }
        }
    };

    // const handleLimitValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setLimit(Number(event.target.value));
    // };

    return (
        <Box>
            {/* {rows?.map((row, index) => {
                return (
                    <Box>
                        {row.cells.map((cell: any, index: number) => {
                            return <Text>{cell.value}</Text>;
                        })}
                    </Box>
                );
            })} */}

            <DataCollectionTable
                // columns={columns || []}
                // rows={dataCollectionRows || []}
                // rowsLoading={rowsLoading}
                // rowsFetching={rowsFetching}
                dataCollectionId={dataCollectionId || ""}
                permissions={permissions || 0}
            />
        </Box>
    );
};

export default DataCollection;
