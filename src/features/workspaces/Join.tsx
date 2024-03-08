import { useJoinWorkspaceMutation, useGetWorkspaceUsersQuery } from '../../app/services/api';
import { Box, Text, useToast } from '@chakra-ui/react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function Join() {
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    const [joinWorkspace, { isLoading }] = useJoinWorkspaceMutation();
    const { data: workspaceUsers } = useGetWorkspaceUsersQuery(queryParameters.get('workspaceId') || '');

    const toast = useToast();

    useEffect(() => {
        for (const member of workspaceUsers?.members || []) {
            if (member._id === queryParameters.get('id')) navigate(`/workspaces/${queryParameters.get('workspaceId')}`);
        }
    }, [workspaceUsers]);

    const handleJoinWorkspace = async () => {
        const res: any = await joinWorkspace({
            workspaceId: queryParameters.get('workspaceId') || '',
            userId: queryParameters.get('id') || '',
        });

        if (res.error) {
            toast({
                title: 'Invitation Error',
                description: 'Either you are already a member or your invitation was removed. Please contact the workspace admin for more information.',
                status: 'info',
                position: 'top',
                duration: 9000,
            });
        } else {
            navigate(`/workspaces/${queryParameters.get('workspaceId')}`);
        }
    };

    return (
        <Box textAlign="center" py={10} px={6}>
            <Text fontSize="18px" mt={3} mb={2}>
                Welcome to Collabtime
            </Text>
            <Text color={'gray.500'} mb={6}>
                Click below to join Workspace
            </Text>

            <PrimaryButton onClick={handleJoinWorkspace} isLoading={isLoading}>
                Join
            </PrimaryButton>
        </Box>
    );
}
