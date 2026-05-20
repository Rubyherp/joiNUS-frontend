import { TextInput } from "react-native";

export default function ThemedInput({ className, ...props }) {
    return (
        <TextInput
            className={className}
            {...props}
        />
    )
}
