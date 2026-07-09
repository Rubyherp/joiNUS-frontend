import { Text, TouchableOpacity, } from "react-native";
import { useState, useCallback } from "react";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    ActionsheetFlatList,
} from '@/components/ui/actionsheet';
import { Ionicons } from "@expo/vector-icons";
import { ImageUp, FileUp, Upload } from "lucide-react-native";

//TODO: change the UI - icons

export default function ThemedItemPicker({ onSelect }) {
    const [showActionsheet, setShowActionsheet] = useState(false);
    const [selected, setSelected] = useState(null);

    const settings = [
        { id: 'Image', name: 'Select Image', icon: <ImageUp size={18} color="#a78bfa" /> },
        { id: 'Document', name: 'Select Document', icon: <FileUp size={18} color="#a78bfa" /> },
    ];

    const handleClose = () => {
        setShowActionsheet(false);
        setSelected(null);
    }

    const handleSelect = (option) => {
        setSelected(option);
        onSelect(option.id);
        handleClose();
    }

    const Item = useCallback(({ item }) => (
        <ActionsheetItem onPress={() => handleSelect(item)} className="flex-row items-center gap-3">
            {item.icon}
            <ActionsheetItemText className="font-medium">{item.name}</ActionsheetItemText>
            {selected?.id === item.id && (
                <Text className="ml-auto text-purple-400">✓</Text>
            )}
        </ActionsheetItem>
    ), [selected]);

    return (
        <>
            <TouchableOpacity
                onPress={() => setShowActionsheet(true)}
                className="flex-row items-center gap-2 bg-gray-800 rounded-full px-3 py-2"
            >
                <Upload size={24} color="white" />
            </TouchableOpacity>

            <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <ActionsheetFlatList
                        data={settings}
                        renderItem={({ item }) => <Item item={item} />}
                        keyExtractor={(item) => item.id}
                    />
                </ActionsheetContent>
            </Actionsheet>

        </>
    );
}
