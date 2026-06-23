import React from "react";

// Minimal Actionsheet mock: renders children only when isOpen, ignoring portal/animation
// behavior that isn't relevant to logic tests.
export function Actionsheet({ isOpen, children }) {
    const { View } = require("react-native");
    if (!isOpen) return null;
    return React.createElement(View, { testID: "mock-actionsheet" }, children);
}

export function ActionsheetBackdrop() {
    return null;
}

export function ActionsheetContent({ children, ...props }) {
    const { View } = require("react-native");
    return React.createElement(View, props, children);
}

export function ActionsheetDragIndicator() {
    return null;
}

export function ActionsheetDragIndicatorWrapper({ children }) {
    return children ?? null;
}

export function ActionsheetItem({ onPress, children, ...props }) {
    const { TouchableOpacity } = require("react-native");
    return React.createElement(TouchableOpacity, { onPress, ...props }, children);
}

export function ActionsheetItemText({ children, ...props }) {
    const { Text } = require("react-native");
    return React.createElement(Text, props, children);
}

export function ActionsheetFlatList({ data, renderItem, keyExtractor }) {
    const { View } = require("react-native");
    return React.createElement(
        View,
        null,
        data.map((item, index) =>
            React.createElement(
                View,
                { key: keyExtractor ? keyExtractor(item) : index },
                renderItem({ item, index })
            )
        )
    );
}
