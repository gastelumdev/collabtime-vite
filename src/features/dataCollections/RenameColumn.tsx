import { useEffect, useState } from "react";
import { useUpdateColumnMutation } from "../../app/services/api";
import { Box, Flex, HStack, Input, MenuItem, Spacer, Stack, Text, useDisclosure } from "@chakra-ui/react";

import { TColumn, TLabel } from "../../types";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import Divider from "../../components/Divider/Divider";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineColorLens } from "react-icons/md";
import { getTextColor } from "../../utils/helpers";

interface IProps {
    column: TColumn;
}

const RenameColumn = ({ column }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updateColumn] = useUpdateColumnMutation();
    const [data, setData] = useState<TColumn>(column);

    const [labels, setLabels] = useState<TLabel[]>([]);
    const [labelOptions, setLabelOptions] = useState<TLabel>({
        title: "",
        color: "#015796",
    });
    const [labelTitleError, setLabelTitleError] = useState<boolean>(false);

    useEffect(() => {
        console.log(column);
        setData(column);
        setLabels(column.labels || []);
    }, [column]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        console.log(data);
        setData({
            ...column,
            [name]: value,
        });
    };

    const updateData = () => {
        updateColumn(data);
        onClose();
    };

    const handleLabelOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name == "title" && event.target.value == "") {
            setLabelTitleError(true);
        } else {
            setLabelTitleError(false);
        }
        setLabelOptions({
            ...labelOptions,
            [event.target.name]: event.target.value,
        });
    };

    const removeLabel = (label: TLabel) => {
        console.log(labels);
        const newLabels = labels.filter((item: TLabel) => {
            return label.title !== item.title;
        });

        console.log(newLabels);
        setData({ ...data, labels: newLabels });
        setLabels(newLabels);
    };

    const addLabel = () => {
        setLabelTitleError(false);
        if (labelOptions.title === "") {
            setLabelTitleError(true);
        } else {
            const labelsCopy = [...labels, labelOptions];
            setData({ ...data, labels: labelsCopy });
            setLabels(labelsCopy);
            setLabelOptions({ title: "", color: "#015796" });
        }
    };

    return (
        <>
            <MenuItem onClick={onOpen}>Edit Column</MenuItem>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={"Rename column"}>
                <Stack>
                    <Text pb={"5px"}>Name</Text>
                    <Input
                        name="name"
                        value={data.name.split("_").join(" ")}
                        placeholder="Please enter column name"
                        required={true}
                        onChange={handleChange}
                        style={{ marginBottom: "15px" }}
                    />
                    {data.labels?.length || 0 > 0 ? (
                        <>
                            <Divider
                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                marginBottom="10px"
                                marginTop="10px"
                            />
                            <Flex>
                                <Box mr={"20px"}>
                                    <HStack>
                                        <Text mb={"10px"}>Labels</Text>
                                        {labelTitleError ? (
                                            <Text mb={"5px"} color={"red"} fontSize={"sm"}>
                                                * Required
                                            </Text>
                                        ) : null}
                                    </HStack>
                                    <Input
                                        // ref={firstField}
                                        id="labelName"
                                        name="title"
                                        value={labelOptions.title}
                                        size={"sm"}
                                        placeholder="Please enter label name"
                                        onChange={handleLabelOptionsChange}
                                    />
                                </Box>
                                <Box mb={"10px"} pt={"32px"}>
                                    <HStack>
                                        {/* <Text mb={"5px"}>Label color</Text> */}
                                        <MdOutlineColorLens color={"rgb(123, 128, 154)"} />
                                        <Box pt={"5px"}>
                                            <input
                                                type={"color"}
                                                // ref={firstField}
                                                id="labelColor"
                                                name="color"
                                                height={"300px"}
                                                value={labelOptions.color}
                                                onChange={handleLabelOptionsChange}
                                            />
                                        </Box>
                                    </HStack>
                                </Box>
                                <Spacer />
                                <Box mt={"36px"}>
                                    <PrimaryButton onClick={addLabel} isDisabled={labelOptions.title == ""} size="sm">
                                        Add label
                                    </PrimaryButton>
                                </Box>
                            </Flex>

                            <Box>
                                {labels?.map((label: TLabel, index: number) => {
                                    // console.log(label);
                                    return (
                                        <Box key={index} bg={label.color} p={"5px"} m={"5px"}>
                                            <HStack>
                                                <AiOutlineClose
                                                    color={getTextColor(label.color)}
                                                    onClick={() => removeLabel(label)}
                                                />
                                                <Text color={getTextColor(label.color)}>{label.title}</Text>
                                            </HStack>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </>
                    ) : null}
                </Stack>
                <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="10px" marginTop="20px" />
                <Flex mt={"10px"} width={"full"}>
                    <Spacer />
                    <PrimaryButton onClick={updateData}>SAVE</PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default RenameColumn;
