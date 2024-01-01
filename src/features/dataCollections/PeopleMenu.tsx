import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from "@chakra-ui/react";
import { getTextColor } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { TCell } from "../../types";
import { useUpdateCellMutation } from "../../app/services/api";

interface ILabel {
    value: string;
    label: string;
    color: string;
}

interface IProps {
    cell: TCell;
    // handleLabelSelectChange: any;
    value: string;
    // label?: string;
    // bgColor?: string;
    // options: { value: string; label: string; color: string }[] | undefined;
}

const PeopleMenu = ({ cell, value = "" }: IProps) => {
    const [updateCell] = useUpdateCellMutation();

    const [labelValue, setLabelValue] = useState<string>("");
    const [labelLabel, setLabelLabel] = useState<string>("");
    const [labelColor, setLabelColor] = useState<string>("");
    const [options, setOptions] = useState<ILabel[] | undefined>([]);

    useEffect(() => {
        // let bgColor: string = "";
        // for (const label of cell.labels || []) {
        //     if (cell.value == label.title) {
        //         bgColor = label.color;
        //     }
        // }
        const cellOptions: ILabel[] | undefined = cell.people?.map((item) => {
            return {
                value: item._id,
                label: `${item.firstname} ${item.lastname}`,
                color: "#ffffff",
            };
        });

        setLabelValue(value);
        setLabelLabel(value);
        setLabelColor("#ffffff");
        setOptions(cellOptions);
    }, [cell, value]);

    const handleLabelClick = (label: ILabel) => {
        updateCell({ ...cell, value: label.value });

        setLabelValue(label.value);
        setLabelColor(label.color);
        setLabelLabel(label.label);
    };

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
                    color={labelColor == "white" ? "black" : getTextColor(labelColor)}
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
                {options?.map((label, index) => {
                    return (
                        <Box key={index} bgColor={label.color} p={"6px"} onClick={() => handleLabelClick(label)}>
                            <MenuItem bgColor={"white"}>
                                <Text color={getTextColor(label.color)}>{label.label}</Text>
                            </MenuItem>
                        </Box>
                    );
                })}
            </MenuList>
        </Menu>
    );
};

export default PeopleMenu;
