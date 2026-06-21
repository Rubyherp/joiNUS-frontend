import { useState } from "react";
import { ActivityIndicator, Alert, Image, Keyboard, Pressable, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CommunityPicker from "@/components/helpers/communityPicker";
import DeadlinePicker from "@/components/helpers/deadlinePicker";
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import ThemedLabel from "@/components/themedComponents/themedLabel";
import ThemedSectionCard from "@/components/themedComponents/themedSectionCard";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, } from '@/components/ui/actionsheet';
import { Box } from "@/components/ui/box";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { CloseIcon, Icon } from '@/components/ui/icon';
import { LinearGradient } from "@/components/ui/linear-gradient";
import { PostContext } from "@/context/postContext";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { AlignLeft, Clock, FileText, ImageIcon, PenBoxIcon, Sparkles, UploadCloud, Users } from "lucide-react-native";
import { useContext } from "react";
import Logo from "../../assets/images/logo-white.png";


//TODO: refactor to useReducer to manage form state or single object state for form data
//TODO: add able to create community

export default function Create() {
    const { uploadPostImage, createPost } = useContext(PostContext);

    const [loading, setLoading] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [moreDetails, setMoreDetails] = useState("");
    const [requirements, setRequirements] = useState("");
    const [memberLimit, setMemberLimit] = useState("");
    const [deadline, setDeadline] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const resetState = () => (
        setLoading(false),
        setSelectedCommunity(null),
        setTitle(""),
        setDescription(""),
        setMoreDetails(""),
        setRequirements(""),
        setMemberLimit(""),
        setDeadline(null),
        setShowImageUpload(false),
        setSelectedImage(null)
    )

    const handleCloseImageUpload = () => {
        setShowImageUpload(false);
    }

    const handleImageSelection = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.85,
            exif: false,
            base64: false,
            preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        })

        if (result.canceled) {
            return;
        }

        const image = result.assets[0];
        setSelectedImage(image);
        setShowImageUpload(false);
    }

    const handleRemoveImage = () => {
        setSelectedImage(null);
    }

    const handleSubmit = async () => {
        // checking title and description are not empty
        if (!title.trim()) {
            Alert.alert('Missing Title', 'Please enter a title for your post.');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Missing Description', 'Please enter a description for your post.');
            return;
        }
        if (!selectedCommunity) {
            Alert.alert('No Community Selected', 'Please select a community for your post.');
            return;
        }

        setLoading(true);

        let imageUrl = null;
        if (selectedImage) {
            try {
                const formData = new FormData();

                formData.append("postFile", {
                    uri: selectedImage.uri,
                    name: `post-${Date.now()}.jpg`,
                    type: "image/jpeg",
                });

                imageUrl = await uploadPostImage(formData);

            } catch (error) {
                console.log('Upload error:', error.message);
                setLoading(false);
                Alert.alert('Error', error.message || 'Failed to upload image');
                return;
            }
        }

        try {
            await createPost({
                communityId: selectedCommunity?.id,
                title,
                description,
                moreDetails,
                memberLimit: memberLimit ? parseInt(memberLimit) : null,
                requirements,
                deadline: deadline ? deadline.toISOString() : null,
                imageUrl
            });
            router.replace('/landing');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create post');
        } finally {
            resetState();
        }
    }

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <TouchableWithoutFeedback className="flex-1" onPress={() => { Keyboard.dismiss() }}>

                <View className="flex-1">

                    {/* top bar */}
                    <View className="flex-row justify-between items-center px-4">

                        {/* header */}
                        <View className="flex-row items-center gap-3">
                            <PenBoxIcon size={48} color="#f97316" />
                            <View className="flex-row items-center justify-between flex-1">
                                <View className="flex">
                                    <Text className="text-2xl font-extrabold text-gray-800">New Post</Text>
                                    <Text className="text-base font-semibold text-gray-500 mt-1">Share with your Community!</Text>
                                </View>
                                <Image source={Logo}
                                    className="h-20 w-20"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>


                    </View>

                    <ScrollView
                        className="flex-1 px-4"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                    >

                        {/* community picker */}
                        <View className="flex-shrink-1 max-w-[50%]">
                            <CommunityPicker onSelect={c => setSelectedCommunity(c)} />
                            <Spacer height={10} />
                        </View>

                        {/* title */}
                        <ThemedSectionCard>
                            <ThemedLabel icon={Sparkles} label="Title" />
                            <ThemedInput
                                className="text-2xl text-pink-600 w-full font-bold min-h-[48px]"
                                placeholder="What's your idea?"
                                placeholderTextColor="pink"
                                onChangeText={setTitle}
                                value={title}
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                textAlignVertical="top"
                            />
                        </ThemedSectionCard>

                        {/* description */}
                        <ThemedSectionCard>
                            <ThemedLabel icon={AlignLeft} label="Description" />
                            <ThemedInput
                                className="text-lg text-pink-600 w-full"
                                style={{ minHeight: 100 }}
                                scrollEnabled={false}
                                placeholder="Tell people what this is about..."
                                placeholderTextColor="pink"
                                onChangeText={setDescription}
                                value={description}
                                multiline={true}
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                textAlignVertical="top"
                            />
                        </ThemedSectionCard>

                        {/* image upload */}
                        <ThemedSectionCard>
                            <ThemedLabel icon={ImageIcon} label="Image" optional />
                            {selectedImage && (
                                <Image
                                    source={{ uri: selectedImage.uri }}
                                    className="w-full h-40"
                                    resizeMode="cover"
                                />
                            )}

                            <Button onPress={() => setShowImageUpload(true)}>
                                <ButtonText>{selectedImage ? "Change Image" : "Upload Image"}</ButtonText>
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
                                        <Text className="text-white">
                                            {selectedImage
                                                ? "✓ Image Selected"
                                                : "No files selected"}
                                        </Text>
                                    </Box>

                                    <ButtonGroup className="w-full">
                                        <Button className="w-full" onPress={handleImageSelection}>
                                            <ButtonText>{selectedImage ? "Change Image" : "Browse Files"}</ButtonText>
                                        </Button>
                                    </ButtonGroup>

                                    {selectedImage && (
                                        <Button
                                            className="w-full mt-3"
                                            variant="outline"
                                            action="secondary"
                                            onPress={handleRemoveImage}
                                        >
                                            <ButtonText>Remove Image</ButtonText>
                                        </Button>
                                    )}

                                </ActionsheetContent>
                            </Actionsheet>
                        </ThemedSectionCard>

                        {/* more details */}
                        <ThemedSectionCard>
                            <ThemedLabel icon={FileText} label="More Details" optional />
                            <ThemedInput
                                className="text-lg text-pink-600 w-full"
                                style={{ minHeight: 100 }}
                                scrollEnabled={false}
                                placeholder="More details that people should know"
                                placeholderTextColor="pink"
                                onChangeText={setMoreDetails}
                                value={moreDetails}
                                multiline={true}
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                textAlignVertical="top"
                            />
                        </ThemedSectionCard>

                        {/* requirements */}
                        <ThemedSectionCard>
                            <ThemedLabel icon={Sparkles} label="Requirements" optional />
                            <ThemedInput
                                className="text-lg text-pink-600 w-full"
                                style={{ minHeight: 100 }}
                                scrollEnabled={false}
                                placeholder="Who should join? What skills are you looking for?"
                                placeholderTextColor="pink"
                                onChangeText={setRequirements}
                                value={requirements}
                                multiline={true}
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                textAlignVertical="top"
                            />
                        </ThemedSectionCard>

                        <View className="flex-row gap-3 mb-5">
                            {/* members limit */}
                            <View
                                className="flex-1 rounded-2xl bg-white overflow-hidden"
                                style={{ shadowColor: "#f97316", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}
                            >
                                <View className="absolute top-0 left-0 w-1 rounded-l-2xl overflow-hidden bottom-0">
                                    <LinearGradient
                                        colors={['#F97316', '#EC4899']}
                                        start={[0, 0]} end={[0, 1]}
                                        className="flex-1"
                                    />
                                </View>

                                <View className="pl-5 pr-4 py-4">
                                    <ThemedLabel icon={Users} label="Members" optional />
                                    <ThemedInput
                                        className="text-lg text-pink-600 w-full h-10"
                                        placeholder="No limit"
                                        placeholderTextColor="pink"
                                        onChangeText={setMemberLimit}
                                        value={memberLimit}
                                        autoCorrect={false}
                                        keyboardType="numeric"
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>

                            {/* deadline */}
                            <View
                                className="flex-1 rounded-2xl bg-white overflow-hidden"
                                style={{ shadowColor: "#f97316", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}
                            >
                                <View className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl overflow-hidden">
                                    <LinearGradient
                                        colors={['#F97316', '#EC4899']}
                                        start={[0, 0]} end={[0, 1]}
                                        className="flex-1"
                                    />
                                </View>

                                <View className="pl-5 pr-4 py-4">
                                    <ThemedLabel icon={Clock} label="Deadline" optional />
                                    <DeadlinePicker onSelect={date => setDeadline(date)} />
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    {/* post button */}
                    <View
                        className="px-4 pb-4 pt-2 bg-gray-50"
                        style={{ paddingBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                    >
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.7}
                            className="w-full"
                            style={{ opacity: loading ? 0.7 : 1 }}
                        >
                            <LinearGradient
                                className={`py-2 rounded-3xl justify-center items-center`}
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

                </View>
            </TouchableWithoutFeedback >
        </SafeAreaView >
    )
}
