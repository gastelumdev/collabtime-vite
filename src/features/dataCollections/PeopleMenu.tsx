import {
    Box,
    Button,
    Checkbox,
    Divider,
    Heading,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TRow, TUser } from '../../types';
import { createPortal } from 'react-dom';

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
    fontWeight?: string;
}

const PeopleMenu = ({ columnName, people, values = [], onChange, allowed = false, border = null, fontWeight = 'normal' }: IProps) => {
    const { onClose } = useDisclosure();
    const [labels, setLabels] = useState<IValues[]>(values);
    const [labelColor, setLabelColor] = useState<string>('');
    const [options, setOptions] = useState<ILabel[] | undefined>([]);

    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        const cellOptions: ILabel[] | undefined = people?.map((item) => {
            return {
                value: item._id,
                label: `${item.firstname} ${item.lastname} - ${item.email}`,
                color: '#ffffff',
            };
        });
        if (values) {
            setLabels(values);
        }

        setLabelColor('#ffffff');
        setOptions(cellOptions);
    }, []);

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
        <Box border={border ? border : 'none'} px={'10px'}>
            {active && allowed ? (
                <Box>
                    <Popover isOpen={active} onClose={handleClose}>
                        <PopoverTrigger>
                            <Button
                                w={'100%'}
                                h={'29px'}
                                fontSize={'13px'}
                                pb={'3px'}
                                // bgColor={labelColor}
                                color={labels.length > 0 ? 'black' : 'lightgray'}
                                borderRadius={'0'}
                                overflow={'hidden'}
                                textOverflow={'ellipsis'}
                                fontWeight={fontWeight}
                                variant={'unstyled'}
                                _hover={{ bgColor: labelColor }}
                            >
                                {labels.length > 0
                                    ? labels.map((label, index) => {
                                          return `${label.name}${labels.length > 1 ? (index < labels.length - 1 ? ', ' : '') : ''}`;
                                      })
                                    : 'Select'}
                            </Button>
                        </PopoverTrigger>
                        {createPortal(
                            <PopoverContent w={'400px'} px={'10px'} py={'10px'} boxShadow={'md'}>
                                <PopoverArrow />
                                <PopoverBody>
                                    <Box mb={'10px'}>
                                        <Heading size={'md'} fontWeight={'semibold'}>
                                            Choose users
                                        </Heading>
                                    </Box>
                                    <Divider mb={'10px'} />
                                    <Box>
                                        {options?.map((label, index) => {
                                            const splitPerson = label.label.split(' - ');
                                            const email = splitPerson.pop();
                                            const name = splitPerson[0];
                                            const itsAssigned = isAssignedTo(email as string);
                                            return (
                                                <Box key={index} mb={'3px'} cursor={'pointer'}>
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
                                                            fontWeight={fontWeight}
                                                            textAlign={'left'}
                                                            ml={'5px'}
                                                        >
                                                            <Text color={'black'}>
                                                                {name}
                                                                <span style={{ color: 'gray' }}>{` ${email}`}</span>
                                                            </Text>
                                                        </Box>
                                                    </Checkbox>
                                                </Box>
                                            );
                                        })}
                                    </Box>
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
                        fontWeight={fontWeight}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
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
                            color={labels && labels.length > 0 ? 'black' : 'lightgray'}
                            h={'29px'}
                            fontWeight={fontWeight}
                            fontSize={'13px'}
                            textAlign={'center'}
                            paddingY={'4px'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            cursor={allowed ? 'pointer' : 'default'}
                            onMouseDown={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                                event;
                                setActive(true);
                            }}
                        >
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
