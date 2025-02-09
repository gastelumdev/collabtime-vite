import { useEffect, useState } from 'react';
import { TColumn, TDataCollection, TDocument, TRow } from '../../../types';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useGetColumnsQuery, useGetRowsQuery, useGetUserGroupsQuery, useUpdateRowMutation } from '../../../app/services/api';
import { emptyDataCollectionPermissions, emptyPermissions } from '../../workspaces/UserGroups';
import ProjectDetails from './resourcePlanningAppComponents/ProjectDetails';
import BillOfMaterials from './resourcePlanningAppComponents/BillOfMaterials';
import PurchaseOrders from './resourcePlanningAppComponents/PurchaseOrders';

const ResourcePlanningApp = ({
    project,
    values,
    dataCollection,
    refetchProject,
}: {
    project: TRow;
    values: any;
    dataCollection: TDataCollection;
    refetchProject: any;
}) => {
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

    const [projectState, setProjectState] = useState(project);

    const [updateRow] = useUpdateRowMutation();

    const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    const [userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });
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
        refetchProject();
    };

    const getDocs = (documents: any[]) => {
        handleChange({ ...project, docs: [...project.docs, ...documents] });
    };

    const getUpdatedDoc = (document: TDocument) => {
        const newDocs: any = project.docs.map((rowDoc: any) => {
            return rowDoc._id === document._id ? document : rowDoc;
        });
        handleChange({ ...project, docs: newDocs });
    };

    const removeDoc = (document: TDocument) => {
        const newDocs: any = project.docs.filter((rowDoc: any) => {
            return rowDoc._id !== document._id;
        });

        handleChange({ ...project, docs: newDocs });
    };

    const onRefChange = (columnName: string, ref: any) => {
        const refs: any = [];
        if (project.refs === undefined) {
            refs.push(ref);
            handleChange({ ...project, refs: { [columnName]: refs } });
        } else {
            if (project.refs[columnName] === undefined) {
                handleChange({ ...project, refs: { ...project.refs, [columnName]: [ref] } });
            } else {
                handleChange({ ...project, refs: { ...project.refs, [columnName]: [...project.refs[columnName], ref] } });
            }
        }

        // handleChange({ ...row, refs: {...row.refs, [columnName]: [...row.refs[columnName], row]} });
    };

    const onRemoveRef = (columnName: string, ref: any) => {
        const rowCopy: any = project;
        const refs: any = rowCopy.refs;
        const refTarget: any = refs[columnName];

        const filteredRefs = refTarget.filter((r: any) => {
            return r._id !== ref._id;
        });

        handleChange({ ...project, refs: { ...project.refs, [columnName]: filteredRefs } });
    };

    const onChange = (columnName: string, value: string) => {
        // if (columnName === 'status' && value === 'Done') {
        //     setShowRow(false);
        // } else {
        //     setShowRow(true);
        // }
        handleChange({ ...project, values: { ...project.values, [columnName]: value }, isEmpty: false });
        // refetchRows();
    };

    const [refetchBom, setRefetchBom] = useState(true);

    return (
        <>
            <Tabs
                onChange={(index: number) => {
                    if (index === 2) {
                        setRefetchBom(!refetchBom);
                    }
                }}
            >
                <TabList>
                    {/* <Tab>Project Details</Tab> */}
                    <Tab>Bill of Materials</Tab>
                    <Tab isDisabled={project.values.proposal_status !== 'Approved'}>Purchase Orders</Tab>
                </TabList>
                <TabPanels>
                    {/* <TabPanel>
                        <ProjectDetails
                            projectState={projectState}
                            handleChange={handleChange}
                            dataCollectionPermissions={dataCollectionPermissions}
                            project={project}
                            getDocs={getDocs}
                            getUpdatedDoc={getUpdatedDoc}
                            removeDoc={removeDoc}
                            columns={columns as TColumn[]}
                            values={values}
                            onChange={onChange}
                            onRefChange={onRefChange}
                            onRemoveRef={onRemoveRef}
                        />
                    </TabPanel> */}
                    <TabPanel>
                        <BillOfMaterials project={project} handleChange={handleChange} userGroup={userGroup} refetchUserGroups={refetchUserGroups} />
                    </TabPanel>
                    {project.values.proposal_status === 'Approved' ? (
                        <TabPanel>
                            <PurchaseOrders project={project} refetchBom={refetchBom} />
                        </TabPanel>
                    ) : null}
                </TabPanels>
            </Tabs>
        </>
    );
};

export default ResourcePlanningApp;
