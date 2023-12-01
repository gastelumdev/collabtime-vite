import { ReactNode } from "react";
import { Button } from "@chakra-ui/react";

interface IButtonProps {
    type?: string;
    fontSize?: string | number;
    onClick?: () => void;
    float?: string;
    px?: string;
    isDisabled?: boolean;
    size?: string;
    children: ReactNode;
}

const PrimaryButton = ({
    type = "primary",
    fontSize = 12,
    float = "none",
    px = "16px",
    isDisabled = false,
    size = "md",
    onClick,
    children,
}: IButtonProps) => {
    return type === "primary" ? (
        <Button
            colorScheme="twitter"
            fontSize={fontSize}
            px={px}
            _hover={{
                boxShadow: "lg",
            }}
            bgGradient="linear(195deg, rgb(73, 163, 241), rgb(26, 115, 232))"
            boxShadow={"md"}
            onClick={onClick}
            float={float as any}
            isDisabled={isDisabled}
            size={size}
        >
            {children}
        </Button>
    ) : null;
};

export default PrimaryButton;
