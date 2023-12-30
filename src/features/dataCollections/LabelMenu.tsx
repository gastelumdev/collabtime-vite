import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from "@chakra-ui/react";
import { getTextColor } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { TCell } from "../../types";

interface IProps {
    cell: TCell;
    handleLabelSelectChange: any;
    value: string;
    label?: string;
    bgColor?: string;
    options: { value: string; label: string; color: string }[] | undefined;
}

const LabelMenu = ({
    cell,
    handleLabelSelectChange,
    value = "",
    label = "Select",
    bgColor = "white",
    options = [],
}: IProps) => {
    const [labelValue, setLabelValue] = useState<string>(value);
    const [labelLabel, setLabelLabel] = useState<string>(label);
    const [labelColor, setLabelColor] = useState<string>(bgColor);

    useEffect(() => {
        setLabelValue(value);
        setLabelLabel(value);
        setLabelColor(bgColor);
    }, [value]);

    return (
        <Menu matchWidth={true}>
            <Tooltip
                label={cell.value}
                openDelay={500}
                // isDisabled={isFocused}
                placement={"top"}
            >
                <MenuButton
                    as={Button}
                    w={"100%"}
                    bgColor={labelColor}
                    color={bgColor == "white" ? "black" : getTextColor(labelColor)}
                    borderRadius={"none"}
                    variant={"ghost"}
                    fontSize={"14px"}
                    fontWeight={"normal"}
                    _hover={{ bgColor: "none" }}
                    _active={{ bgColor: "none" }}
                >
                    {labelLabel || labelValue}
                </MenuButton>
            </Tooltip>
            <MenuList px={"5px"}>
                {options.map((item, index) => {
                    return (
                        <Box
                            key={index}
                            bgColor={item.color}
                            p={"6px"}
                            onClick={() => {
                                handleLabelSelectChange({ value: item.value, color: item.color }, cell);
                                setLabelValue(item.value);
                                setLabelColor(item.color);
                                setLabelLabel(item.label);
                            }}
                        >
                            <MenuItem bgColor={item.color}>
                                <Text color={getTextColor(item.color)}>{item.label}</Text>
                            </MenuItem>
                        </Box>
                    );
                })}
            </MenuList>
        </Menu>
    );
};

export default LabelMenu;
