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
import { Ionicons } from "@expo/vector-icons";
import { Users } from "lucide-react-native";

const getInitials = (name) => {
    if (!name) {
        return '?';
    }
    return name.slice(0, 2).toUpperCase();
}

const getColor = (name) => {
    if (!name) {
        return '#6B7280';
    }
    const colors = ['#8637CF', '#F97316', '#EC4899', '#06B6D4', '#10B981'];
    return colors[name.charCodeAt(0) % colors.length];
}

export default function CommunityPicker({ onSelect }) {
    const [showActionsheet, setShowActionsheet] = useState(false);
    const [selected, setSelected] = useState(null);

    const { fetchFollowedCommunities, communities } = useContext(CommunityContext);

    useEffect(() => {
        fetchFollowedCommunities();
    }, [communities]);

    // useEffect(() => {
    //     if (communities.length > 0) {
    //         console.log('Communities fetched:', communities);
    //     }
    // }, [communities]);

    const flattenCommunities = communities.map(item => item.communities ? item.communities : item);

    const handleClose = () => setShowActionsheet(false);

    const handleSelect = (community) => {
        setSelected(community);
        onSelect(community);
        handleClose();
        console.log(community)
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
                className="flex-row items-center bg-gray-800 rounded-full px-3 py-2 justify-between max-w-[240px]"
            >

                <View className="flex-row justify-center items-center gap-2 flex-1 min-w-0">
                    {selected && (
                        <View
                            className="w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: getColor(selected.name) }}
                        >
                            <Text className="text-white text-xs font-bold">{getInitials(selected.name)}</Text>
                        </View>
                    )}

                    <Text
                        className="text-white font-semibold text-base flex-1"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {selected
                            ? `${selected.name}`
                            : `Select Community`
                        }
                    </Text>
                </View>
                <View className="px-2 flex-shrink-0">
                    <Ionicons name="chevron-down" size={14} color="#9ca3af" />
                </View>

            </TouchableOpacity>

            <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    {communities.length === 0 ? (
                        <View className="items-center justify-center py-10 px-6">
                            <Users size={48} color="#6b7280" />
                            <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
                                No communities followed yet
                            </Text>
                            <Text className="text-gray-500 text-sm mt-2 text-center">
                                Follow communities to start posting in them
                            </Text>
                        </View>
                    ) : (
                        <ActionsheetFlatList
                            data={flattenCommunities}
                            renderItem={({ item }) => <Item item={item} />}
                            keyExtractor={(item) => String(item.id)}
                        />
                    )}
                </ActionsheetContent>
            </Actionsheet>

        </>
    );
}
