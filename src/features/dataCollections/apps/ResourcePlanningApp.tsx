import { useEffect, useState } from 'react';
import { TDataCollection, TRow } from '../../../types';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useGetRowsQuery, useGetUserGroupsQuery, useUpdateRowMutation } from '../../../app/services/api';
import { emptyDataCollectionPermissions, emptyPermissions } from '../../workspaces/UserGroups';
// import ProjectDetails from './resourcePlanningAppComponents/ProjectDetails';
import BillOfMaterials from './resourcePlanningAppComponents/BillOfMaterials';
import PurchaseOrders from './resourcePlanningAppComponents/PurchaseOrders';

const ResourcePlanningApp = ({
    project,
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
    // const { data: columns } = useGetColumnsQuery(dataCollection._id as string);

    const [_projectState, setProjectState] = useState(project);

    const [updateRow] = useUpdateRowMutation();

    const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    const [userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });
    const [_dataCollectionPermissions, setDataCollectionPermissions] = useState(emptyDataCollectionPermissions);

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
