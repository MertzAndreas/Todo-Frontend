'use client';
import {
    extendTheme,
    theme as baseTheme,
    withDefaultColorScheme,
    ThemeConfig,
    defineStyleConfig,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
    cardAnatomy.keys,
);

const variants = {
    secondary: definePartsStyle((props) => ({
        container: {
            bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        },
    })),
    hovered: definePartsStyle((props) => ({
        container: {
            bg: props.colorMode === 'dark' ? 'gray.750' : 'gray.100',
        },
    })),
};

export const Card = defineMultiStyleConfig({ variants });

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
};

const Button = defineStyleConfig({
    ...baseTheme.components.Button,
    variants: {
        ...baseTheme.components.Button.variants,
        warning: {
            bg: 'red.500',
            color: 'white',
            _hover: {
                bg: 'red.600',
            },
        },
    },
});

const theme = extendTheme(
    {
        config,
        colors: {
            ...baseTheme.colors,
            gray: {
                ...baseTheme.colors.gray,
                750: '#282f3d',
            },
        },
        components: {
            Button,
            Card,
            Textarea: {
                baseStyle: {
                    resize: 'none',
                },
            },
        },
        styles: {
            global: (props) => ({
                body: {
                    bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
                },
            }),
        },
    },
    withDefaultColorScheme({ colorScheme: 'facebook' }),
);

export default theme;
