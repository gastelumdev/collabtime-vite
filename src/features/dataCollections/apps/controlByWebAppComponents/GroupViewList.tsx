import { Box, Container } from '@chakra-ui/react';
import View from '../../../dataCollectionViews/View';
import { useEffect, useState } from 'react';
import { useGetDataCollectionViewByIdQuery, useGetUserGroupsQuery } from '../../../../app/services/api';
import { emptyPermissions } from '../../../workspaces/UserGroups';
import { useParams } from 'react-router-dom';

const GroupViewList = () => {
    const { viewId } = useParams();
    console.log(viewId);
    const { data: dataCollectionView } = useGetDataCollectionViewByIdQuery(viewId);
    const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    const [userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });

    const [view, setView] = useState(null);

    useEffect(() => {
        console.log(dataCollectionView);
        setView(dataCollectionView);
    }, [dataCollectionView]);

    useEffect(() => {
        if (userGroups !== undefined) {
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });

            setUserGroup(ug);
        } else {
            refetchUserGroups();
        }
    }, [userGroups]);
    return (
        <Container maxW={'container.xl'}>
            <Box>{view ? <View dataCollectionView={view} userGroup={userGroup} refetchUserGroup={refetchUserGroups} active={true} /> : null}</Box>
        </Container>
    );
};

export default GroupViewList;
