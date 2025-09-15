import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { textStyles } from "../constants/typography";

interface TypographyProps extends TextProps {
    variant?: keyof typeof textStyles;
    children: React.ReactNode;
    width?: TextStyle["width"]; // optional
    color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
    variant = "body",
    style,
    color,
    width,
    children,
    ...props
}) => {
    return (
        <Text
            style={[
                textStyles[variant],
                style,
                color ? { color } : undefined,
                width !== undefined ? { width } : undefined,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

// Convenience components
export const H1: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="h4" {...props} />
);

export const H5: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="h5" {...props} />
);

export const H6: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="h6" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="body" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="bodySmall" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="caption" {...props} />
);

export const ButtonText: React.FC<Omit<TypographyProps, "variant">> = props => (
    <Typography variant="button" {...props} />
);
