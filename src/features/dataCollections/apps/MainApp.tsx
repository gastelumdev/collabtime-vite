import { useEffect, useState } from 'react';
import { TColumn, TDataCollection, TDocument, TRow } from '../../../types';
import { useGetColumnsQuery, useGetRowsQuery, useGetUserGroupsQuery, useUpdateRowMutation } from '../../../app/services/api';
import { emptyDataCollectionPermissions, emptyPermissions } from '../../workspaces/UserGroups';
import RowDetails from './RowDetails';

const MainApp = ({ row, values, dataCollection, refetchRow }: { row: TRow; values: any; dataCollection: TDataCollection; refetchRow: any }) => {
    const { refetch: refetch } = useGetRowsQuery({
        dataCollectionId: dataCollection._id || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        showEmptyRows: false,
        // filters: JSON.stringify(dataCollectionView.filters),
    });
    const { data: columns } = useGetColumnsQuery(dataCollection._id as string);

    const [projectState, setProjectState] = useState(row);

    const [updateRow] = useUpdateRowMutation();

    const { data: userGroups, refetch: _refetchUserGroups } = useGetUserGroupsQuery(null);
    const [_userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });
    const [dataCollectionPermissions, setDataCollectionPermissions] = useState(emptyDataCollectionPermissions);

    useEffect(() => {
        if (userGroups !== undefined) {
            // Find the user group that the current user is in
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });

            let dcPermissions;
            if (ug !== undefined) {
                // Find the current data collection being viewed
                dcPermissions = ug.permissions.dataCollections.find((item: any) => {
                    return item.dataCollection === dataCollection._id;
                });

                if (dcPermissions !== undefined) {
                    // Set the user group and data collection
                    setUserGroup(ug);
                    setDataCollectionPermissions(dcPermissions.permissions);
                } else {
                    refetch();
                }
            } else {
                refetch();
            }
        } else {
            refetch();
        }
    }, [userGroups]);

    const handleChange = async (project: TRow) => {
        setProjectState(project);
        await updateRow(project);
        refetchRow();
    };

    const getDocs = (documents: any[]) => {
        handleChange({ ...row, docs: [...row.docs, ...documents] });
    };

    const getUpdatedDoc = (document: TDocument) => {
        const newDocs: any = row.docs.map((rowDoc: any) => {
            return rowDoc._id === document._id ? document : rowDoc;
        });
        handleChange({ ...row, docs: newDocs });
    };

    const removeDoc = (document: TDocument) => {
        const newDocs: any = row.docs.filter((rowDoc: any) => {
            return rowDoc._id !== document._id;
        });

        handleChange({ ...row, docs: newDocs });
    };

    const onRefChange = (columnName: string, ref: any) => {
        const refs: any = [];
        if (row.refs === undefined) {
            refs.push(ref);
            handleChange({ ...row, refs: { [columnName]: refs } });
        } else {
            if (row.refs[columnName] === undefined) {
                handleChange({ ...row, refs: { ...row.refs, [columnName]: [ref] } });
            } else {
                handleChange({ ...row, refs: { ...row.refs, [columnName]: [...row.refs[columnName], ref] } });
            }
        }

        // handleChange({ ...row, refs: {...row.refs, [columnName]: [...row.refs[columnName], row]} });
    };

    const onRemoveRef = (columnName: string, ref: any) => {
        const rowCopy: any = row;
        const refs: any = rowCopy.refs;
        const refTarget: any = refs[columnName];

        const filteredRefs = refTarget.filter((r: any) => {
            return r._id !== ref._id;
        });

        handleChange({ ...row, refs: { ...row.refs, [columnName]: filteredRefs } });
    };

    const onChange = (columnName: string, value: string) => {
        // if (columnName === 'status' && value === 'Done') {
        //     setShowRow(false);
        // } else {
        //     setShowRow(true);
        // }
        handleChange({ ...row, values: { ...row.values, [columnName]: value }, isEmpty: false });
        // refetchRows();
    };

    return (
        <RowDetails
            rowState={projectState}
            handleChange={handleChange}
            dataCollectionPermissions={dataCollectionPermissions}
            row={row}
            getDocs={getDocs}
            getUpdatedDoc={getUpdatedDoc}
            removeDoc={removeDoc}
            columns={columns as TColumn[]}
            values={values}
            onChange={onChange}
            onRefChange={onRefChange}
            onRemoveRef={onRemoveRef}
        />
    );
};

export default MainApp;
