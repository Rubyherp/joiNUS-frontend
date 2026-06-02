import { useState } from "react";
import { View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DeadlinePicker({ onSelect }) {
    const [date, setDate] = useState(new Date());

    return (
        <View>
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
            >
            </DateTimePicker>
        </View>
    )
}

