import { Box, Card, Center, Heading, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface IProps {
    title: string;
    description?: string;
    bgImage?: string;
    icon?: IconType | null;
    badge?: any;
}

const SecondaryCard = ({ title, description, bgImage = 'linear-gradient(195deg, #FF548A, #EC1559)', icon = null, badge }: IProps) => {
    return (
        <Card border={'none'} boxShadow={'lg'}>
            <Box px={'10px'}>
                <Box color={'white'} h={'70px'} bgImage={bgImage} borderRadius={'lg'} padding={6} position={'relative'} bottom={'24px'} boxShadow={'lg'}>
                    <Heading size={'sm'}>
                        <List>
                            <ListItem>
                                {icon !== null ? <ListIcon as={icon} boxSize={7} /> : null}
                                <Center>
                                    {title} {badge}
                                </Center>
                            </ListItem>
                        </List>
                    </Heading>
                </Box>
            </Box>
            <Box h={'100px'} p={'24px'}>
                <Text color={'rgb(150 156 189)'}>{description}</Text>
            </Box>
        </Card>
    );
};

export default SecondaryCard;
