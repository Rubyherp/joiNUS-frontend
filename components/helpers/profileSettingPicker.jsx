import { useState, useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";
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
import { LogOut, Lock, UserPen, Settings } from "lucide-react-native";


//TODO: can just remove the selected state and just call onSelect directly in the item press handler, 
//since the actionsheet will close immediately after selection
export default function ProfileSettingPicker({ onSelect }) {
    const [showActionsheet, setShowActionsheet] = useState(false);
    const [selected, setSelected] = useState(null);

    const settings = [
        { id: 'EditProfile', name: 'Edit Profile', icon: <UserPen size={18} color="#a78bfa" /> },
        { id: 'ChangePassword', name: 'Change Password', icon: <Lock size={18} color="#a78bfa" /> },
        { id: 'Logout', name: 'Logout', icon: <LogOut size={18} color="#f87171" /> },
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
                <Settings size={24} color="white" />
                <Ionicons name="chevron-down" size={14} color="#9ca3af" />
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
