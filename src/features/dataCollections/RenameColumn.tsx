import { useEffect, useState } from "react";
import { useUpdateColumnMutation } from "../../app/services/api";
import { Flex, Input, MenuItem, Spacer, Text, useDisclosure } from "@chakra-ui/react";

import { TColumn } from "../../types";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

interface IProps {
    column: TColumn;
}

const RenameColumn = ({ column }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updateColumn] = useUpdateColumnMutation();
    const [data, setData] = useState<TColumn>({
        dataCollectionId: "",
        name: "",
        type: "",
        permanent: true,
        people: [],
        labels: [],
        includeInForm: true,
        includeInExport: true,
    });

    useEffect(() => {
        setData(column);
    }, [column]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...column,
            [name]: value,
        });
    };

    const updateData = () => {
        updateColumn(data);
        onClose();
    };

    return (
        <>
            <MenuItem onClick={onOpen}>Rename</MenuItem>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={"Rename column"}>
                <Text pb={"5px"}>Name</Text>
                <Input
                    name="name"
                    value={data.name.split("_").join(" ")}
                    placeholder="Please enter column name"
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
                <Flex mt={"10px"} width={"full"}>
                    <Spacer />
                    <PrimaryButton onClick={updateData}>SAVE</PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default RenameColumn;
