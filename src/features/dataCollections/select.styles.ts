import getTextColor from "../../utils/helpers";

interface TProps {
    bgColor: string;
    padding: string;
    border: string;
}

export const cellColorStyles: any = ({bgColor, padding, border}: TProps) => ({
    control: (styles: any,) => {
        return {
            ...styles,
            border: border,
            padding: "none",
            margin: "0",
            outline: "none",
            boxShadow: "none",
        };
    },
    input: (styles: any) => {
        return {
            ...styles,
            outline: "none",
            margin: "0",
        };
    },
    option: (styles: any, { data }: any) => {
        return {
            ...styles,
            backgroundColor: data.color,
            color: getTextColor(data.color),
        };
    },
    valueContainer: (styles: any) => {
        return {
            ...styles,
            padding: "0",
            margin: "0",
            width: "120px",
        };
    },
    indicatorsContainer: (styles: any) => {
        return {
            ...styles,
            display: "none",
        };
    },
    singleValue: (styles: any) => {
        return {
            ...styles,
            backgroundColor: bgColor,
            color: getTextColor(bgColor),
            padding: padding,
            margin: "0",
        };
    },
    menu: (styles: any) => {
        return {
            ...styles,
            margin: "0",
            borderRadius: "0",
            border: "none",
            padding: "0",
        };
    },
    menuList: (styles: any) => {
        return {
            ...styles,
            padding: "0",
        };
    },
});

export const createRowColorStyles: any = () => ({
    control: (styles: any,) => {
        return {
            ...styles,
            paddingTop: "0",
        };
    },
    option: (styles: any, { data }: any) => {
        return {
            ...styles,
            backgroundColor: data.color,
            color: getTextColor(data.color),
        };
    },
    singleValue: (styles: any, { data }: any) => {
        return {
            ...styles,
            backgroundColor: data.color,
            color: getTextColor(data.color),
            padding: "7px",
        };
    },
    indicatorsContainer: (styles: any) => {
        return { ...styles, padding: "0" };
    },
    dropdownIndicator: (styles: any) => {
        return { ...styles, padding: "4px" };
    },
});