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
                    bg: 'gray',
                    color: 'white',
                    _hover: {
                        bg: 'blue',
                    },
                    transition: "background-color 0.2s",
                },
                blueButton: {
                    bg: 'lightBlue',
                    color: 'white',
                    _hover: {
                        bg: 'blue',
                    },
                    transition: "background-color 0.2s",
                },
                redButton:{
                    bg:"red",
                    color:"white",
                    _hover:{ bg: "darkRed" },
                    transition: "background-color 0.2s",
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
        blue: "#4740FE",
        lightBlue: "#4D8AF0",
        red: "#DA2F2F",
        darkRed: "#A02C2C",
        gray: "#AFAFAF",
        darkGray: "#5c5c5c",
        green: "#50AF27",
        yellow: "#E7EE16",
        purple: "#A02CFF",
        pink: "#FF2CFF",
        cyan: "#2CFFD9",
        teal: "#2CFFB4",
        orange: "#FF8C2C",
        black: "#000000",
        white: "#FFFFFF",
    },
    bg: {
        blue: "#4740FE",
        lightBlue: "#4D8AF0",
        red: "#DA2F2F",
        darkRed: "#A02C2C",
        gray: "#AFAFAF",
        darkGray: "#5c5c5c",
        green: "#50AF27",
        yellow: "#E7EE16",
        purple: "#A02CFF",
        pink: "#FF2CFF",
        cyan: "#2CFFD9",
        teal: "#2CFFB4",
        orange: "#FF8C2C",
        black: "#000000",
        white: "#FFFFFF",
    },
});

export default theme;
