import { useNavigate } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

const ResetPasswordEmailSent = () => {
    const navigate = useNavigate();
    const redirect = () => {
        navigate("/workspaces");
    };
    return (
        <Box textAlign="center" py={10} px={6}>
            <Text fontSize="18px" mt={3} mb={2}>
                Email Sent
            </Text>
            <Text color={"gray.500"} mb={6}>
                Check your email to reset password.
            </Text>

            <PrimaryButton onClick={redirect}>Go to Home</PrimaryButton>
        </Box>
    );
};

export default ResetPasswordEmailSent;
