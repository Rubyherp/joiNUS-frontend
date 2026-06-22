import { useEffect, useState } from "react";
import { Pressable, View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

import { LinearGradient } from "@/components/ui/linear-gradient";

export default function DeadlinePicker({ onSelect, existingDate }) {
    const [date, setDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (existingDate) {
            setShowPicker(true);
            setDate(existingDate ? new Date(existingDate) : null)
            console.log('Existing Date:', existingDate)
        }
    }, [existingDate])

    return (
        <View>

            {date ? (
                <Text className="text-green-700 text-sm pb-2 font-semibold">Date Selected ✓</Text>
            ) : (
                <Text className="text-slate-400 text-sm pb-2">Select Date</Text>
            )}

            {showPicker ?
                <DateTimePicker
                    value={date ?? new Date()}
                    mode="date"
                    minimumDate={new Date()}
                    themeVariant="light"
                    onChange={(event, selectedDate) => {
                        if (selectedDate) {
                            setDate(selectedDate);
                            onSelect(selectedDate);
                        }
                    }}
                />
                : (
                    <TouchableOpacity
                        onPress={() => setShowPicker(true)}
                        activeOpacity={0.7}
                        className="w-full"
                    >
                        <LinearGradient
                            className={`py-2 rounded-3xl justify-center items-center`}
                            colors={['#F97316', '#EC4899']}
                            start={[0, 1]}
                            end={[1, 0]}
                        >
                            <Text className="text-white font-semibold text-lg">{date ? "" : "Click here"}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

            {date &&
                <Pressable
                    onPress={() => {
                        setDate(null);
                        onSelect(null);
                    }}
                    className="flex justify-center items-center text-center bg-red-500 border border-red-500 rounded-full mt-4"
                >
                    <Text className="text-white p-2">Clear</Text>
                </Pressable>
            }

        </View>
    )
}

