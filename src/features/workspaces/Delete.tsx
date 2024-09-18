import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    MenuItem,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { TWorkspace } from '../../types';
import { useGetWorkspacesQuery } from '../../app/services/api';

interface IProps {
    workspace: TWorkspace;
    deleteWorkspace: any;
}

const Delete = ({ workspace, deleteWorkspace }: IProps) => {
    const { data: workspaces } = useGetWorkspacesQuery(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<any>(null);
    const [redirectWorkspaceId, setRedirectWorkspaceId] = useState('');

    useEffect(() => {
        const redirectWorkspace: any = workspaces?.find((ws: any) => {
            return workspace._id !== ws._id;
        });

        console.log(redirectWorkspace);
        if (redirectWorkspace !== undefined) setRedirectWorkspaceId(redirectWorkspace._id);
    }, [workspaces]);
    return (
        <>
            <MenuItem onClick={onOpen}>Delete Workspace</MenuItem>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Workspace
                        </AlertDialogHeader>

                        <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                as={'a'}
                                href={'/workspaces/' + redirectWorkspaceId}
                                onClick={() => {
                                    deleteWorkspace(workspace._id as string);
                                    onClose();
                                    localStorage.setItem('workspaceId', redirectWorkspaceId);
                                    // navigate('/workspaces/' + redirectWorkspaceId);
                                }}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default Delete;
