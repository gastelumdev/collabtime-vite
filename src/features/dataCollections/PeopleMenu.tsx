import { Box, Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useDisclosure } from '@chakra-ui/react';
import { getTextColor } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import { TRow, TUser } from '../../types';
// import { useUpdateRowMutation } from '../../app/services/api';

interface ILabel {
    value: string;
    label: string;
    color: string;
}

interface IProps {
    row?: TRow;
    columnName: string;
    people: TUser[];
    value: string;
    onChange: any;
    allowed?: boolean;
    border?: string | null;
    // label?: string;
    // bgColor?: string;
    // options: { value: string; label: string; color: string }[] | undefined;
}

const PeopleMenu = ({ row, columnName, people, value = '', onChange, allowed = false, border = null }: IProps) => {
    const { onClose } = useDisclosure();
    // const [updateRow] = useUpdateRowMutation();

    const [labelValue, setLabelValue] = useState<string>('');
    const [labelLabel, setLabelLabel] = useState<string>('');
    const [labelColor, setLabelColor] = useState<string>('');
    const [options, setOptions] = useState<ILabel[] | undefined>([]);

    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        row;
        labelValue;
        const cellOptions: ILabel[] | undefined = people?.map((item) => {
            return {
                value: item._id,
                label: `${item.firstname} ${item.lastname} - ${item.email}`,
                color: '#ffffff',
            };
        });

        const splitValue = value.split(' - ');
        splitValue.pop();
        const label = splitValue.join(' ');

        setLabelValue(value);
        setLabelLabel(label);
        setLabelColor('#ffffff');
        setOptions(cellOptions);
    }, [value]);

    const handleLabelClick = (label: ILabel) => {
        // updateRow({ ...row, values: { ...row.values, [columnName]: label.label } });

        const splitValue = label.label.split(' - ');
        splitValue.pop();
        const labelResult = splitValue.join(' ');

        setLabelValue(label.value);
        setLabelColor(label.color);
        setLabelLabel(labelResult);

        onClose();
        setActive(false);

        onChange(columnName, label.label);
    };

    const handleClose = () => {
        onClose();
        setActive(false);
    };

    return (
        <Box border={border ? border : 'none'}>
            {active && allowed ? (
                <Box

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
                                {labelLabel ? labelLabel : 'Select'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                                {options?.map((label, index) => {
                                    const splitPerson = label.label.split(' ');
                                    const email = splitPerson.pop();
                                    const name = splitPerson.join(' ');
                                    console.log({ splitPerson, email, name });
                                    return (
                                        <Box key={index} p={'6px'} cursor={'pointer'} onClick={() => handleLabelClick(label)}>
                                            <Box>
                                                <Text color={getTextColor(label.color)}>
                                                    {name}
                                                    <span style={{ color: 'gray' }}>{` ${email}`}</span>
                                                </Text>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>
            ) : (
                <Text
                    // backgroundColor={labelColor}
                    color={getTextColor(labelColor)}
                    h={'29px'}
                    textAlign={'center'}
                    paddingY={'4px'}
                    cursor={'pointer'}
                    onMouseDown={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                        event;
                        setActive(true);
                    }}
                >
                    {labelLabel ? labelLabel : 'Select'}
                </Text>
            )}
        </Box>
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
