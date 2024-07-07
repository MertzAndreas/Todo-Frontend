import {Grid, IconButton} from "@chakra-ui/react";
import React from "react";

import {iconMap} from "@/utils/idToSVG";


interface IconSelectorProps {
    onSelect: (iconId: number) => void
}

const IconSelector = ({onSelect} : IconSelectorProps) => {
    return (
        <Grid templateColumns="repeat(5, 1fr)" gap={2} width={"100%"} height={"min-content"}>
            {iconMap.map(({id, icon: Icon, label}) => (
                <IconButton
                    key={id}
                    icon={<Icon width={"rem"} height={"2rem"}/>}
                    aria-label={label}
                    onClick={() => onSelect(id)}
                />
            ))}
        </Grid>
    );
};

export default IconSelector;
