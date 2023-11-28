import React, { useEffect, useState } from "react";
import { Button, Input, Text, useDisclosure, Flex, Spacer } from "@chakra-ui/react";
import { TDataCollection } from "../../types";
import { AiOutlineEdit } from "react-icons/ai";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

interface IProps {
    dataCollection: TDataCollection;
    updateDataCollection: any;
}

const Edit = ({ dataCollection, updateDataCollection }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<TDataCollection>(dataCollection);

    useEffect(() => {
        setData(dataCollection);
    }, [dataCollection]);

    const editData = async () => {
        updateDataCollection(data);
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    return (
        <>
            <Button
                flex="1"
                variant="ghost"
                leftIcon={<AiOutlineEdit />}
                color={"rgb(123, 128, 154)"}
                onClick={onOpen}
                zIndex={10}
            ></Button>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={"Create a new workspace"}>
                <Text pb={"5px"}>Name</Text>
                <Input
                    name="name"
                    value={data.name}
                    placeholder="Please enter user name"
                    required={true}
                    onChange={handleChange}
                    style={{ marginBottom: "15px" }}
                />
                <Flex mt={"10px"} width={"full"}>
                    <Spacer />
                    <PrimaryButton onClick={editData}>SAVE</PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default Edit;
