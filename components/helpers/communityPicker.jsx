import { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import { useContext } from "react";
import { CommunityContext } from "@/context/communityContext";

const getInitials = (name) => name.slice(0, 2).toUpperCase();

const getColor = (name) => {
    const colors = ['#8637CF', '#F97316', '#EC4899', '#06B6D4', '#10B981'];
    return colors[name.charCodeAt(0) % colors.length];
}

export default function CommunityPicker({ onSelect }) {
    const [showActionsheet, setShowActionsheet] = useState(false);
    const [selected, setSelected] = useState(null);

    const { fetchCommunities, communities, loading } = useContext(CommunityContext);

    useEffect(() => {
        fetchCommunities();
    }, [])

    const handleClose = () => setShowActionsheet(false);

    const handleSelect = (community) => {
        setSelected(community);
        onSelect(community);
        handleClose();
    }

    const Item = useCallback(({ item }) => (
        <ActionsheetItem onPress={() => handleSelect(item)} className="flex-row items-center gap-3">
            <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: getColor(item.name) }}
            >
                <Text className="text-white text-xs font-bold">{getInitials(item.name)}</Text>
            </View>
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
                className="flex-row items-center gap-2 bg-gray-800 rounded-full px-3 py-2 max-width-[160px]"
            >
                {selected && (
                    <View
                        className="w-10 h-10 rounded-full items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: getColor(selected.name) }}
                    >
                        <Text className="text-white text-xs font-bold">{getInitials(selected.name)}</Text>
                    </View>
                )}
                <Text
                    className="text-white font-semibold text-base flex-shrink"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {selected
                        ? `${selected.name}`
                        : `Select Community`
                    }
                </Text>
                <Text className="text-gray-400">⌃</Text>
            </TouchableOpacity>

            <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <ActionsheetFlatList
                        data={communities}
                        renderItem={({ item }) => <Item item={item} />}
                        keyExtractor={(item) => item.id}
                    />
                </ActionsheetContent>
            </Actionsheet>

        </>
    );
}
