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
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { getTextColor } from '../../utils/helpers';
import { memo, useEffect, useState } from 'react';
import { TCell, TRow } from '../../types';
import { useUpdateCellMutation, useUpdateRowMutation } from '../../app/services/api';

interface ILabel {
    value: string;
    label: string;
    color: string;
}

interface IProps {
    id: number;
    labels: any;
    columnName: string;
    value: string;
    onChange: any;
    // label?: string;
    // bgColor?: string;
    // options: { value: string; label: string; color: string }[] | undefined;
}

const LabelMenu = ({ id, columnName, labels, value = '', onChange }: IProps) => {
    const { onClose } = useDisclosure();
    const [updateRow] = useUpdateRowMutation();

    const [labelValue, setLabelValue] = useState<string>('');
    const [labelLabel, setLabelLabel] = useState<string>('');
    const [labelColor, setLabelColor] = useState<string>('');
    const [options, setOptions] = useState<ILabel[] | undefined>([]);

    const [active, setActive] = useState<boolean>(false);

    // console.log(`${columnName} rendered`);
    // console.info(`${columnName} rendered`);

    useEffect(() => {
        let bgColor: string = '';
        for (const label of labels || []) {
            if (value == label.title) {
                bgColor = label.color;
            }
        }
        const cellOptions: ILabel[] | undefined = labels?.map((item: any) => {
            return {
                value: item.title,
                label: item.title,
                color: item.color,
            };
        });

        setLabelValue(value);
        setLabelLabel(value);
        setLabelColor(bgColor);
        setOptions(cellOptions);
    }, [labels, value]);

    const handleLabelClick = (label: ILabel) => {
        // updateRow({ ...row, values: { ...row.values, [columnName]: label.value } });
        // console.log({ ...row, values: { ...row.values, [columnName]: label.value } });

        setLabelValue(label.value);
        setLabelColor(label.color);
        setLabelLabel(label.label);

        onClose();
        setActive(false);

        onChange(id, columnName, labelValue);
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
                                h={'24px'}
                                fontSize={'12px'}
                                bgColor={labelColor}
                                color={labelColor == 'white' ? 'black' : getTextColor(labelColor)}
                                borderRadius={'0'}
                                fontWeight={'normal'}
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
                                        <Box key={index} bgColor={label.color} p={'6px'} cursor={'pointer'} onClick={() => handleLabelClick(label)}>
                                            <Box bgColor={label.color}>
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
                    backgroundColor={labelColor}
                    color={getTextColor(labelColor)}
                    h={'100%'}
                    textAlign={'center'}
                    paddingY={'3px'}
                    cursor={'pointer'}
                    onMouseDown={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                        setActive(true);
                    }}
                >
                    {labelLabel}
                </Text>
            )}
        </>
    );
};

export default memo(LabelMenu);
