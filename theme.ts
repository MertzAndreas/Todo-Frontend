"use client"
import { extendTheme, theme as baseTheme, withDefaultColorScheme } from '@chakra-ui/react'

const WarningButtonVariant = {
    variants: {
        warning: {
            bg: 'red.500',
            color: 'white',
            _hover: {
                bg: 'red.600',
            },
        },
    },
};

const theme = extendTheme(
    {
        components: {
            Button: {
                ...baseTheme.components.Button,
                variants: {
                    ...baseTheme.components.Button.variants,
                    ...WarningButtonVariant.variants,
                },
            },
            Textarea: {
                baseStyle: {
                    resize: 'none'
                }
            }
        }
    },
    withDefaultColorScheme({ colorScheme: 'facebook' })
);

export default theme;
