import { RxReset } from 'react-icons/rx';
import { TColumn, TRow } from '../../types';
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';

const ClearRow = ({ row, columns, handleChange, allowed = false }: { row: TRow; columns: TColumn[]; handleChange: any; allowed: boolean }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box onClick={allowed ? onOpen : () => {}}>
            <Text color={row.isEmpty ? 'gray.200' : '#16b2fc'}>
                <RxReset />
            </Text>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{`Reset Row`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure that you want to reset this row? This action cannot be undone.</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="ghost"
                            colorScheme={'red'}
                            onClick={() => {
                                const values: any = {};
                                const refs: any = {};
                                for (const column of columns) {
                                    if (column.type === 'label' || column.type === 'status' || column.type === 'priority') {
                                        const defaultColumn = column.labels?.find((item: { title: string; color: string; default: boolean }) => {
                                            return item.default;
                                        });
                                        values[column.name] = defaultColumn?.title !== undefined ? defaultColumn?.title : '';
                                    } else if (column.type === 'people') {
                                        values[column.name] = [];
                                    } else if (column.type === 'reference') {
                                        refs[column.name] = [];
                                    } else {
                                        if (!column.autoIncremented) {
                                            values[column.name] = '';
                                        } else {
                                            values[column.name] = row.values[column.name];
                                        }
                                    }
                                }

                                const newRow = { ...row, values, refs, notesList: [], docs: [], reminders: [], acknowledged: false, isEmpty: true };

                                handleChange(newRow);
                                onClose();
                            }}
                        >
                            Reset
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ClearRow;
