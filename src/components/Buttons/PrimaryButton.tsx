import { ReactNode } from "react";
import { Button } from "@chakra-ui/react";

interface IButtonProps {
    type?: string;
    onClick?: () => void;
    children: ReactNode;
}

const PrimaryButton = ({
    type = "primary",
    onClick,
    children,
}: IButtonProps) => {
    return type === "primary" ? (
        <Button
            colorScheme="twitter"
            fontSize={12}
            px={6}
            _hover={{
                boxShadow: "lg",
            }}
            bgGradient="linear(195deg, rgb(73, 163, 241), rgb(26, 115, 232))"
            boxShadow={"md"}
            onClick={onClick}
        >
            {children}
        </Button>
    ) : null;
};

export default PrimaryButton;
