import { Box, Button, Checkbox, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useDisclosure } from '@chakra-ui/react';
import { getTextColor } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import { TRow, TUser } from '../../types';
import { createPortal } from 'react-dom';
// import { useUpdateRowMutation } from '../../app/services/api';

interface ILabel {
    value: string;
    label: string;
    color: string;
}

interface IValues {
    name: string;
    email: string;
}

interface IProps {
    row?: TRow;
    columnName: string;
    people: TUser[];
    values: IValues[];
    onChange: any;
    allowed?: boolean;
    border?: string | null;
    // label?: string;
    // bgColor?: string;
    // options: { value: string; label: string; color: string }[] | undefined;
}

const PeopleMenu = ({ row, columnName, people, values = [], onChange, allowed = false, border = null }: IProps) => {
    const { onClose } = useDisclosure();
    // const [updateRow] = useUpdateRowMutation();

    const [labelValue, setLabelValue] = useState<string>('');
    const [labelLabel, setLabelLabel] = useState<string>('');
    const [labels, setLabels] = useState<IValues[]>(values);
    const [labelColor, setLabelColor] = useState<string>('');
    const [options, setOptions] = useState<ILabel[] | undefined>([]);

    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        labelValue;
        labelLabel;
        row;
        const cellOptions: ILabel[] | undefined = people?.map((item) => {
            return {
                value: item._id,
                label: `${item.firstname} ${item.lastname} - ${item.email}`,
                color: '#ffffff',
            };
        });

        // const v: any = value;
        const firstItem: any = values[0] !== undefined ? values[0].name : '';

        // const splitValue = v[0].split(' - ');
        // splitValue.pop();
        // const label = splitValue.join(' ');

        setLabelValue(values.length > 0 ? (values as any)[0] : '');
        setLabelLabel(firstItem);
        setLabels(values);
        setLabelColor('#ffffff');
        setOptions(cellOptions);
    }, [values, people]);

    // const handleLabelClick = (label: ILabel) => {
    //     // updateRow({ ...row, values: { ...row.values, [columnName]: label.label } });

    //     const splitValue = label.label.split(' - ');
    //     splitValue.pop();
    //     const labelResult = splitValue.join(' ');

    //     setLabelValue(label.value);
    //     setLabelColor(label.color);
    //     setLabelLabel(labelResult);

    //     onClose();
    //     setActive(false);

    //     onChange(columnName, label.label);
    // };

    const handleClose = () => {
        onClose();
        setActive(false);
    };

    const isAssignedTo = (email: string) => {
        for (const personMap of labels) {
            if (email === personMap.email) return true;
        }

        return false;
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
                                {/* {labelLabel ? labelLabel : 'Select'} */}
                                {labels.length > 0
                                    ? labels.map((label, index) => {
                                          return `${label.name}${labels.length > 1 ? (index < labels.length - 1 ? ', ' : '') : ''}`;
                                      })
                                    : 'Select'}
                            </Button>
                        </PopoverTrigger>
                        {createPortal(
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverBody>
                                    {options?.map((label, index) => {
                                        const splitPerson = label.label.split(' - ');
                                        const email = splitPerson.pop();
                                        const name = splitPerson[0];
                                        const itsAssigned = isAssignedTo(email as string);
                                        // return (
                                        //     <Box key={index} mb={'3px'} cursor={'pointer'} onClick={() => handleLabelClick(label)}>
                                        //         <Button
                                        //             bgColor={label.color}
                                        //             w={'100%'}
                                        //             fontSize={'12px'}
                                        //             fontWeight={'normal'}
                                        //             size={'xs'}
                                        //             // onClick={() => handleLabelClick(label)}
                                        //             textAlign={'left'}
                                        //         >
                                        //             <Text color={getTextColor(label.color)}>
                                        //                 {name}
                                        //                 <span style={{ color: 'gray' }}>{` ${email}`}</span>
                                        //             </Text>
                                        //         </Button>
                                        //     </Box>
                                        // );
                                        return (
                                            <Box
                                                key={index}
                                                mb={'3px'}
                                                cursor={'pointer'}
                                                // onClick={() => handleLabelClick(label)}
                                            >
                                                <Checkbox
                                                    isChecked={itsAssigned}
                                                    onChange={() => {
                                                        let newValues: IValues[];

                                                        if (isAssignedTo(email as string)) {
                                                            newValues = labels.filter((label) => {
                                                                return label.email !== email;
                                                            });
                                                            setLabels(newValues);
                                                        } else {
                                                            newValues = [...labels, { name, email: email as string }];
                                                            setLabels(newValues);
                                                        }

                                                        onChange(columnName, newValues);
                                                    }}
                                                >
                                                    <Box
                                                        bgColor={label.color}
                                                        w={'100%'}
                                                        fontSize={'12px'}
                                                        fontWeight={'normal'}
                                                        // size={'xs'}
                                                        // onClick={() => handleLabelClick(label)}
                                                        textAlign={'left'}
                                                        ml={'5px'}
                                                    >
                                                        <Text color={getTextColor(label.color)}>
                                                            {name}
                                                            <span style={{ color: 'gray' }}>{` ${email}`}</span>
                                                        </Text>
                                                    </Box>
                                                </Checkbox>
                                            </Box>
                                        );
                                    })}
                                </PopoverBody>
                            </PopoverContent>,
                            document.body
                        )}
                    </Popover>
                </Box>
            ) : (
                <Box cursor={allowed ? 'pointer' : 'default'}>
                    <Button
                        variant={'unstyled'}
                        borderRadius={'none'}
                        w={'100%'}
                        h={'29px'}
                        fontSize={'12px'}
                        fontWeight={'normal'}
                        onMouseDown={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                            event;
                            setActive(true);
                        }}
                        onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
                            if (event.key === 'Enter') {
                                setActive(true);
                            }
                        }}
                    >
                        <Text
                            // backgroundColor={labelColor}
                            color={getTextColor(labelColor)}
                            h={'29px'}
                            textAlign={'center'}
                            paddingY={'4px'}
                            cursor={allowed ? 'pointer' : 'default'}
                            onMouseDown={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                                event;
                                setActive(true);
                            }}
                        >
                            {/* {labelLabel ? labelLabel : 'Select'} */}
                            {Array.isArray(labels) && labels.length > 0
                                ? labels.map((label, index) => {
                                      return `${label.name}${labels.length > 1 ? (index < labels.length - 1 ? ', ' : '') : ''}`;
                                  })
                                : 'Select'}
                        </Text>
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PeopleMenu;
