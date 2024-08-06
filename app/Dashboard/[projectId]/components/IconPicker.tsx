import { Grid, GridItem, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { iconMap } from '@/utils/idToSVG';

interface IconSelectorProps {
    setValue: (fieldName: string, value: any) => void;
}

const IconSelector = ({ setValue }: IconSelectorProps) => {
    const [selected, setSelected] = useState<null | number>(null);
    return (
        <Grid
            templateColumns="repeat(5, 1fr)"
            gap={2}
            justifyItems="center"
            alignItems="center"
            width="100%"
        >
            {iconMap.map(({ id, icon: Icon, label }) => (
                <IconButton
                    key={id}
                    padding={'2px'}
                    width="100%"
                    size="lg"
                    variant={'ghost'}
                    colorScheme={'facebook'}
                    isActive={id === selected}
                    icon={<Icon width={'auto'} height={'100%'} />}
                    aria-label={label}
                    onClick={() => {
                        setSelected(id);
                        setValue('iconId', id.toString());
                    }}
                />
            ))}
        </Grid>
    );
};

export default IconSelector;
