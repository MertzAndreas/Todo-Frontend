import { Grid, GridItem, IconButton } from "@chakra-ui/react";
import React, {useState} from "react";
import { iconMap } from "@/utils/idToSVG";

interface IconSelectorProps {
    onSelect: (iconId: number) => void;
}

const IconSelector = ({ onSelect }: IconSelectorProps) => {

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
                        padding={"2px"}
                        width="100%"
                        size="lg"
                        icon={<Icon width={"auto"} height={"100%"}/>}
                        aria-label={label}
                        onClick={() => onSelect(id)}
                    />

            ))}
        </Grid>
    );
};

export default IconSelector;
