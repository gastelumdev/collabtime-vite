import { useEffect, useState } from "react";
import { useGetColumnsQuery, useGetRowsQuery, useGetUserQuery } from "../../app/services/api";
import { useParams } from "react-router-dom";
import DataCollectionTable from "./DataCollectionTable";
import { TDataCollection } from "../../types";

const DataCollection = () => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");

    const { data: columns } = useGetColumnsQuery(dataCollectionId || "");

    const {
        data: rows,
        isLoading: rowsLoading,
        isFetching: rowsFetching,
        isSuccess: rowsSuccess,
    } = useGetRowsQuery(dataCollectionId || "");

    const [permissions, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    useEffect(() => {
        console.log(columns);
    }, [columns]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem("workspaceId")) {
                setPermissions(workspace.permissions);
            }
        }
    };

    useEffect(() => {
        localStorage.setItem("dataCollectionId", dataCollectionId || "");
        // setData(rows as TRow[]);
    }, [rowsSuccess, rows]);

    return (
        <DataCollectionTable
            columns={columns || []}
            rows={rows || []}
            rowsLoading={rowsLoading}
            rowsFetching={rowsFetching}
            dataCollectionId={dataCollectionId || ""}
            permissions={permissions || 0}
        />
    );
};

export default DataCollection;
