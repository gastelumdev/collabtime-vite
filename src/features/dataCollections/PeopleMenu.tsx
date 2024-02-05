import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { getTextColor } from '../../utils/helpers';
import { memo, useEffect, useState } from 'react';
import { TCell, TRow, TUser } from '../../types';
import { useUpdateCellMutation, useUpdateRowMutation } from '../../app/services/api';

interface ILabel {
    value: string;
    label: string;
    color: string;
}

interface IProps {
    row: TRow;
    columnName: string;
    people: TUser[];
    value: string;
    onChange: any;
    // label?: string;
    // bgColor?: string;
    // options: { value: string; label: string; color: string }[] | undefined;
}

const PeopleMenu = ({ row, columnName, people, value = '', onChange }: IProps) => {
    const { onClose } = useDisclosure();
    const [updateRow] = useUpdateRowMutation();

    const [labelValue, setLabelValue] = useState<string>('');
    const [labelLabel, setLabelLabel] = useState<string>('');
    const [labelColor, setLabelColor] = useState<string>('');
    const [options, setOptions] = useState<ILabel[] | undefined>([]);

    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        const cellOptions: ILabel[] | undefined = people?.map((item) => {
            return {
                value: item._id,
                label: `${item.firstname} ${item.lastname}`,
                color: '#ffffff',
            };
        });

        setLabelValue(value);
        setLabelLabel(value);
        setLabelColor('#ffffff');
        setOptions(cellOptions);
    }, [value]);

    const handleLabelClick = (label: ILabel) => {
        updateRow({ ...row, values: { ...row.values, [columnName]: label.label } });

        setLabelValue(label.value);
        setLabelColor(label.color);
        setLabelLabel(label.label);

        onClose();
        setActive(false);

        onChange(columnName, label.label);
    };

    const handleClose = () => {
        onClose();
        setActive(false);
    };

    return (
        <>
            {active ? (
                <div
                // onBlur={(event: React.FocusEvent<HTMLDivElement, Element>) => {
                //     setActive(false);
                // }}
                >
                    <Popover isOpen={active} onClose={handleClose}>
                        <PopoverTrigger>
                            <Button
                                w={'100%'}
                                h={'29px'}
                                fontSize={'12px'}
                                pb={'3px'}
                                // bgColor={labelColor}
                                color={labelColor == 'white' ? 'black' : getTextColor(labelColor)}
                                borderRadius={'0'}
                                fontWeight={'normal'}
                                variant={'unstyled'}
                                _hover={{ bgColor: labelColor }}
                            >
                                {labelValue}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                                {options?.map((label, index) => {
                                    return (
                                        <Box key={index} p={'6px'} cursor={'pointer'} onClick={() => handleLabelClick(label)}>
                                            <Box>
                                                <Text color={getTextColor(label.color)}>{label.label}</Text>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </div>
            ) : (
                <Text
                    // backgroundColor={labelColor}
                    color={getTextColor(labelColor)}
                    h={'29px'}
                    textAlign={'center'}
                    paddingY={'4px'}
                    cursor={'pointer'}
                    onMouseDown={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                        setActive(true);
                    }}
                >
                    {labelLabel}
                </Text>
            )}
        </>
        // <Menu matchWidth={true}>
        //     {/* <Tooltip
        //         label={labelLabel}
        //         openDelay={500}
        //         // isDisabled={isFocused}
        //         placement={'top'}
        //     > */}
        //     <MenuButton
        //         as={Button}
        //         w={'100%'}
        //         p="0"
        //         bgColor={labelColor}
        //         color={labelColor == 'white' ? 'black' : getTextColor(labelColor)}
        //         border={'unset'}
        //         borderRadius={'none'}
        //         variant={'unstyled'}
        //         fontSize={'14px'}
        //         fontWeight={'normal'}
        //         _hover={{ bgColor: 'none' }}
        //         _active={{ bgColor: 'none' }}
        //     >
        //         <Text>{labelLabel || labelValue}</Text>
        //     </MenuButton>
        //     {/* </Tooltip> */}
        //     <MenuList px={'5px'}>
        //         {options?.map((label, index) => {
        //             return (
        //                 <Box key={index} bgColor={label.color} p={'6px'} onClick={() => handleLabelClick(label)}>
        //                     <MenuItem bgColor={'white'}>
        //                         <Text color={getTextColor(label.color)}>{label.label}</Text>
        //                     </MenuItem>
        //                 </Box>
        //             );
        //         })}
        //     </MenuList>
        // </Menu>
    );
};

export default PeopleMenu;
