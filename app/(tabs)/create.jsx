import { View, Text, TouchableOpacity, Pressable, ActivityIndicator, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native"; import { SafeAreaView } from "react-native-safe-area-context"; import { useState } from "react";

import Spacer from "@/components/themedComponents/spacer";
import { LinearGradient } from "@/components/ui/linear-gradient";
import CommunityPicker from "@/components/helpers/communityPicker";
import ThemedInput from "@/components/themedComponents/themedInput";
import { Divider } from "@/components/ui/divider";
import DeadlinePicker from "@/components/helpers/deadlinePicker";
import { Button, ButtonText, ButtonGroup } from "@/components/ui/button";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import { Box } from "@/components/ui/box";
import { Icon, CloseIcon } from '@/components/ui/icon';
import { UploadCloud } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

//TODO: implement create post logic
//TODO: upload file with Actionsheet
//TODO: check memberLimit is a number

export default function Create() {
    const [loading, setLoading] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [moreDetails, setMoreDetails] = useState("");
    const [requirements, setRequirements] = useState("");
    const [memberLimit, setMemberLimit] = useState("");
    const [deadline, setDeadline] = useState("");
    const [showImageUpload, setShowImageUpload] = useState(false);

    const handleCloseImageUpload = () => {
        setShowImageUpload(false);
    }

    //TODO: send backend request to create post
    const handleSubmit = () => {
        setLoading(true);
    }

    //TODO: implement image upload logic
    const handleImageUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })

        if (result.canceled) {
            return;
        }

        //TODO: append to formData
        const image = result.assets[0];
        const formData = new FormData();
        formData.append('postFile', {

        })

        //TODO: fetch url
        //TODO: check logic: should be saved as state? not sending as request directly
        try {
            const response = await fetch()

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to upload image");
            }
            return;
        } catch (error) {
            throw error;
        }
    }

    return (
        <SafeAreaView className="flex-1 px-4">
            <TouchableWithoutFeedback className="flex-1" onPress={() => { Keyboard.dismiss() }}>
                <View className="flex-1">
                    <View className="flex-row justify-between">

                        {/* community picker */}
                        <View className="flex-1 ">
                            <CommunityPicker onSelect={c => setSelectedCommunity(c)} />
                            <Spacer height={20} />
                        </View>

                        {/* post button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.7}
                            className="w-[20%]"
                            style={{ opacity: loading ? 0.7 : 1 }}
                        >
                            <LinearGradient
                                className={`py-3 rounded-3xl justify-center items-center`}
                                colors={['#F97316', '#EC4899']}
                                start={[0, 1]}
                                end={[1, 0]}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-semibold text-lg">Post</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>


                    <ScrollView className="flex-1 w-full">

                        {/* title */}
                        <Text className="text-base font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">Title:</Text>
                        <ThemedInput
                            className="text-4xl text-pink-600 w-full px-4 font-bold h-16"
                            placeholder="Title"
                            placeholderTextColor="pink"
                            placeholderStyle={{ fontSize: 24 }}
                            onChangeText={setTitle}
                            value={title}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            textAlignVertical="top"
                        />
                        <Divider className="my-4" />

                        {/* description */}
                        <Text className="text-base font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">Description:</Text>
                        <ThemedInput
                            className="text-2xl text-pink-600 w-full px-4 h-[120px]"
                            scrollEnabled={true}
                            placeholder="Description of your post"
                            placeholderTextColor="pink"
                            onChangeText={setDescription}
                            value={description}
                            multiline={true}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            textAlignVertical="top"
                        />
                        <Divider className="my-4" />

                        {/* image upload */}
                        <Text className="text-base font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">Image: (optional)</Text>
                        <Button onPress={() => setShowImageUpload(true)}>
                            <ButtonText>Upload</ButtonText>
                        </Button>
                        <Actionsheet isOpen={showImageUpload} onClose={handleCloseImageUpload}>
                            <ActionsheetBackdrop />
                            <ActionsheetContent className="px-5">
                                <ActionsheetDragIndicatorWrapper>
                                    <ActionsheetDragIndicator />
                                </ActionsheetDragIndicatorWrapper>

                                <View className="flex-row w-full justify-between mb-4">
                                    <View className="flex gap-2">
                                        <Text className="text-lg text-white font-bold">Upload your Image</Text>
                                        <Text className="text-white">JPG, PDF, PNG supported</Text>
                                    </View>

                                    <View>
                                        <Pressable onPress={handleCloseImageUpload} className="p-2">
                                            <Icon
                                                as={CloseIcon}
                                                size="lg"
                                                className="stroke-background-500"
                                            />
                                        </Pressable>
                                    </View>
                                </View>

                                <Box className="my-[18px] items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[130px] w-full">
                                    <Icon
                                        as={UploadCloud}
                                        className="h-[62px] w-[62px] stroke-background-200"
                                    />
                                    <Text className="text-white">No files uploaded yet</Text>
                                </Box>

                                <ButtonGroup className="w-full">
                                    <Button className="w-full" onPress={handleImageUpload}>
                                        <ButtonText>Browse files</ButtonText>
                                    </Button>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        isDisabled
                                        action="secondary"
                                    >
                                        <ButtonText>Upload</ButtonText>
                                    </Button>
                                </ButtonGroup>

                            </ActionsheetContent>
                        </Actionsheet>
                        <Divider className="my-4" />

                        {/* more details */}
                        <Text className="text-base font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">More Details: (optional)</Text>
                        <ThemedInput
                            className="text-2xl text-pink-600 w-full px-4 h-[120px]"
                            scrollEnabled={true}
                            placeholder="Additional details"
                            placeholderTextColor="pink"
                            onChangeText={setMoreDetails}
                            value={moreDetails}
                            multiline={true}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            textAlignVertical="top"
                        />
                        <Divider className="my-4" />

                        {/* requirements */}
                        <Text className="text-base font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">requirements: (optional)</Text>
                        <ThemedInput
                            className="text-2xl text-pink-600 w-full px-4 h-[120px]"
                            scrollEnabled={true}
                            placeholder="Additional requirements"
                            placeholderTextColor="pink"
                            onChangeText={setRequirements}
                            value={requirements}
                            multiline={true}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            textAlignVertical="top"
                        />
                        <Divider className="my-4" />

                        {/* members limit */}
                        <Text className="text-base font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">Members: (optional)</Text>
                        <ThemedInput
                            className="text-2xl text-pink-600 w-full px-4 h-16"
                            placeholder="Members limit"
                            placeholderTextColor="pink"
                            onChangeText={setMemberLimit}
                            value={memberLimit}
                            autoCorrect={false}
                            keyboardType="numeric"
                            textAlignVertical="top"
                        />
                        <Divider className="my-4" />

                        {/* deadline */}
                        <Text className="text-base font-semibold text-gray-800 uppercase tracking-widest mb-1 px-1">Deadline: (optional)</Text>
                        <DeadlinePicker onSelect={date => setDeadline(date)} />

                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}
