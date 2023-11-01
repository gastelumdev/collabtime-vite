import { useJoinWorkspaceMutation } from "../../app/services/api";
import { Box, Text } from "@chakra-ui/react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Join() {
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    const [joinWorkspace] = useJoinWorkspaceMutation();

    const handleJoinWorkspace = () => {
        joinWorkspace({
            workspaceId: queryParameters.get("workspaceId") || "",
            userId: queryParameters.get("id") || "",
        });
        navigate("/workspaces");
    };

    return (
        <Box textAlign="center" py={10} px={6}>
            <Text fontSize="18px" mt={3} mb={2}>
                Welcome to Collabtime
            </Text>
            <Text color={"gray.500"} mb={6}>
                Click below to join Workspace
            </Text>

            <PrimaryButton onClick={handleJoinWorkspace}>Join</PrimaryButton>
        </Box>
    );
}
