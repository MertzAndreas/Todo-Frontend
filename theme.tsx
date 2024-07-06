'use client';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'bold',
                borderRadius: 'md',
            },
            sizes: {
                md: {
                    fontSize: 'md',
                    px: 4, // padding x-axis
                    py: 2, // padding y-axis
                },
            },
            variants: {
                greyButton: {
                    bg: 'gray.400',
                    color: 'white',
                    _hover: {
                        bg: 'blue.600',
                    },
                    transition: "background-color 0.2s",mt: 4,
                    p: 2,
                },
                blueButton: {
                    bg: 'blue.500',
                    color: 'white',
                    _hover: {
                        bg: 'blue.600',
                    },
                    transition: "background-color 0.2s",
                    mt: 4,
                    p: 2,
                },
                redButton:{
                    bg:"red.500",
                    color:"white",
                    _hover:{ bg: "red.600" },
                },
            },
            defaultProps: {
                size: 'md',
                variant: 'blueButton',
            },
        },
        Textarea: {
            variants: {
                basic: {
                    p: 2,
                    border: "1px",
                    borderRadius:"md",
                }
            },
            defaultProps: {
                variant: 'basic'
            },
        },
        Input: {
            variants: {
                basic: {
                    p: 2,
                    border: "1px",
                    borderRadius:"md",
                }

            },
            defaultProps: {
                variant: 'basic'
            },
        },
        Heading:{
            variants: {
                basic: {
                    as: "h1",
                    size: "2xl",
                    mb : 6,
                },
                h2:{
                    as: "h2",
                    size: "lg",
                    mb : 2,
                }
            },
            defaultProps: {
                variant: "basic"
            },
        },
    },
    colors: {

    }
});

export default theme;
