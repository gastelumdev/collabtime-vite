import { Box } from "@chakra-ui/react";
import React from "react";

interface IDividerProps {
    color?: string;
    gradient?: string;
    marginBottom?: string;
    marginTop?: string;
}

const Divider = ({
    color,
    gradient,
    marginBottom,
    marginTop,
}: IDividerProps) => {
    return (
        <Box
            backgroundImage={gradient}
            bg={color}
            h={"1px"}
            mt={marginTop || "20px"}
            mb={marginBottom || "20px"}
        ></Box>
    );
};

export default Divider;
