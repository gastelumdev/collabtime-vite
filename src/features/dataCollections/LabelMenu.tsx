import { Box, Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useDisclosure } from '@chakra-ui/react';
import { getTextColor } from '../../utils/helpers';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ILabel {
    value: string;
    label: string;
    color: string;
}

interface IProps {
    id?: number;
    labels: any;
    columnName: string;
    value: string;
    onChange: any;
    allowed?: boolean;
    border?: string | null;
    fontWeight?: string;
    fontSize?: string;
    light?: boolean;
    // label?: string;
    // bgColor?: string;
    // options: { value: string; label: string; color: string }[] | undefined;
}

const LabelMenu = ({
    columnName,
    labels,
    value = '',
    onChange,
    allowed = false,
    border = null,
    fontWeight = 'normal',
    fontSize = '13px',
    light = false,
}: IProps) => {
    const { onClose } = useDisclosure();
    // const [updateRow] = useUpdateRowMutation();

    const [labelValue, setLabelValue] = useState<string>('');
    const [labelLabel, setLabelLabel] = useState<string>('');
    const [labelColor, setLabelColor] = useState<string>('');
    const [options, setOptions] = useState<ILabel[] | undefined>([]);

    const [active, setActive] = useState<boolean>(false);

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

        setLabelValue(label.value);
        setLabelColor(label.color);
        setLabelLabel(label.label);

        onClose();
        setActive(false);

        onChange(columnName, label.value);
    };

    const handleClose = () => {
        onClose();
        setActive(false);
    };

    return (
        <Box border={border ? border : 'none'}>
            {active && allowed ? (
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
                                fontSize={fontSize}
                                pb={'1px'}
                                bgColor={light ? 'white' : labelColor}
                                color={labelColor == 'white' ? 'black' : getTextColor(labelColor)}
                                borderRadius={'0'}
                                fontWeight={fontWeight}
                                _hover={{ bgColor: labelColor }}
                            >
                                {labelValue}
                            </Button>
                        </PopoverTrigger>
                        {createPortal(
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverBody>
                                    {options?.map((label, index) => {
                                        return (
                                            <Box key={index} bgColor={label.color} mb={'3px'} cursor={'pointer'} onClick={() => handleLabelClick(label)}>
                                                <Button
                                                    bgColor={label.color}
                                                    w={'100%'}
                                                    fontSize={fontSize}
                                                    fontWeight={fontWeight}
                                                    size={'sm'}
                                                    _hover={{ bgColor: label.color }}
                                                    // onClick={() => handleLabelClick(label)}
                                                >
                                                    <Text color={getTextColor(label.color)}>{label.label}</Text>
                                                </Button>
                                            </Box>
                                        );
                                    })}
                                </PopoverBody>
                            </PopoverContent>,
                            document.body
                        )}
                    </Popover>
                </div>
            ) : (
                <Button
                    variant={'unstyled'}
                    borderRadius={'none'}
                    w={'100%'}
                    h={'29px'}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    cursor={allowed ? 'cursor' : 'default'}
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
                        backgroundColor={light ? 'none' : labelColor}
                        color={getTextColor(labelColor)}
                        // h={'100%'}
                        h={'29px'}
                        fontSize={fontSize}
                        textAlign={'center'}
                        paddingY={'4px'}
                        // cursor={'pointer'}
                        onMouseDown={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                            event;
                            setActive(true);
                        }}
                        fontWeight={fontWeight}
                        // tabIndex={0}
                    >
                        {labelLabel}
                    </Text>
                </Button>
            )}
        </Box>
    );
};

export default memo(LabelMenu);
