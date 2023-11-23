import getTextColor from "../../utils/helpers";

export const cellColorStyles: any = (bgColor: string) => ({
    control: (styles: any,) => {
        return {
            ...styles,
            border: "none",
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
            padding: "10px",
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