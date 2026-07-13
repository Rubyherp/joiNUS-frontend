import { useState, useEffect } from "react";
import { ActivityIndicator, Alert, Platform, Image, Keyboard, Pressable, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView } from "react-native";
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
import { CommunityContext } from "@/context/communityContext";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { AlignLeft, Clock, FileText, ImageIcon, PenBoxIcon, Sparkles, UploadCloud, Users } from "lucide-react-native";
import { useContext } from "react";
import Logo from "../../assets/images/logo-white.png";
import { Colors } from "@/assets/colors/Colors";
import { Switch } from "@/components/ui/switch";


//TODO: refactor to useReducer to manage form state or single object state for form data

export default function Create() {
    const { uploadPostImage, createPost } = useContext(PostContext);
    const { requestNewCommunity } = useContext(CommunityContext);

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
    const [tab, setTab] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [communityCategory, setCommunityCategory] = useState("");

    const tabs = ['Create Post', 'Request Community'];

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
        setSelectedImage(null),
        setIsAnonymous(false),
        setCommunityName(""),
        setCommunityDescription(""),
        setCommunityCategory("")
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
                imageUrl,
                isAnonymous
            });
            router.replace('/landing');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create post');
        } finally {
            resetState();
        }
    }

    const handleSubmitCommunityRequest = async () => {
        if (!communityName.trim()) {
            Alert.alert('Missing Community Name', 'Please enter a name for your community.');
            return;
        }
        if (!communityDescription.trim()) {
            Alert.alert('Missing Community Description', 'Please enter a description for your community.');
            return;
        }
        if (!communityCategory.trim()) {
            Alert.alert('Missing Community Category', 'Please enter a category for your community.');
            return;
        }

        try {
            await requestNewCommunity({
                name: communityName,
                description: communityDescription,
                category: communityCategory
            });
            Alert.alert('Success! 🎉', 'Community request submitted!\nWe\'ll review it soon.');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to send request');
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
                                    <Text className="text-2xl font-extrabold text-gray-800">{tab == 0 ? ' New Post' : 'New Community'}</Text>
                                    <Text className="text-base font-semibold text-gray-500 mt-1">Share with your Community!</Text>
                                </View>
                                <Image source={Logo}
                                    className="h-20 w-20"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                    </View>

                    {/* tabs */}
                    <View className="flex-row px-4 pb-4 rounded-xl" style={{ backgroundColor: Colors.light.uiBackground }}>
                        {tabs.map((label, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setTab(i)}
                                className="flex-1 items-center py-2 rounded-lg border-gray-400"
                                style={tab === i
                                    ? { backgroundColor: "#fff", shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }
                                    : {}
                                }
                            >
                                <Text
                                    className="text-xs font-bold"
                                    style={{ color: tab === i ? Colors.light.title : Colors.light.text }}
                                >
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1"
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                    >

                        <ScrollView
                            className="flex-1 px-4"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 24 }}
                        >
                            {/* content */}
                            {tab === 0
                                ? (
                                    <View>
                                        <View className="flex-shrink-1 max-w-[50%]">
                                            <CommunityPicker onSelect={c => setSelectedCommunity(c)} />
                                            <Spacer height={10} />
                                        </View>

                                        <ThemedSectionCard>
                                            <ThemedLabel icon={Sparkles} label="Title" />
                                            <ThemedInput
                                                className="text-pink-600 w-full font-bold min-h-[48px]"
                                                style={{
                                                    height: 42,
                                                    fontSize: 18,
                                                    lineHeight: 22,
                                                    textAlignVertical: 'center',
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                }}
                                                placeholder="What's your idea?"
                                                placeholderTextColor="pink"
                                                onChangeText={setTitle}
                                                value={title}
                                                autoCapitalize="sentences"
                                                autoCorrect={false}
                                                textAlignVertical="top"
                                            />
                                        </ThemedSectionCard>

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

                                        <ThemedSectionCard>
                                            <ThemedLabel icon={ImageIcon} label="Image" optional />
                                            <View className="flex-row items-center justify-between mb-2 border rounded-2xl overflow-hidden">
                                                {selectedImage && (
                                                    <Image
                                                        source={{ uri: selectedImage.uri }}
                                                        style={{
                                                            width: '100%',
                                                            aspectRatio: selectedImage.width / selectedImage.height,
                                                            maxHeight: 400,
                                                        }}
                                                        resizeMode="cover"
                                                    />
                                                )}
                                            </View>

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

                                                    <Box className="my-[18px] items-center justify-center bg-background-50 border border-dashed border-outline-300 w-full overflow-hidden rounded-2xl">
                                                        {selectedImage ? (
                                                            <Image
                                                                source={{ uri: selectedImage.uri }}
                                                                style={{
                                                                    width: '100%',
                                                                    aspectRatio: selectedImage.width / selectedImage.height,
                                                                    maxHeight: 400,
                                                                }}
                                                                resizeMode="cover"
                                                            />
                                                        ) : (

                                                            <View className="flex-row items-center justify-center gap-3 py-6">
                                                                <Icon
                                                                    as={UploadCloud}
                                                                    className="h-[62px] w-[62px] stroke-background-200"
                                                                />
                                                                <Text className="text-white"> No files selected </Text>
                                                            </View>
                                                        )}
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

                                            <View className="flex-1">

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

                                                    <View className="pl-5 pr-4 py-4 flex-1">
                                                        <ThemedLabel icon={Users} label="Members" optional />
                                                        <ThemedInput
                                                            className="text-pink-600 w-full flex-1"
                                                            style={{
                                                                height: 42,
                                                                fontSize: 16,
                                                                lineHeight: 20,
                                                                textAlignVertical: 'center',
                                                                paddingTop: 0,
                                                                paddingBottom: 0,
                                                            }}
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

                                            </View>

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

                                        <View className="flex-row items-center gap-3 mb-5">
                                            <Text className="text-lg font-semibold text-gray-800">Post Anonymously</Text>
                                            <Switch
                                                size="md"
                                                value={isAnonymous}
                                                onValueChange={setIsAnonymous}
                                                isDisabled={false}
                                                trackColor={{ false: '#d4d4d4', true: '#c4b5fd' }}
                                                thumbColor="#fafafa"
                                                activeThumbColor="#fafafa"
                                                ios_backgroundColor="#d4d4d4"
                                            />
                                        </View>
                                    </View>

                                ) : (
                                    <View>
                                        <ThemedSectionCard>
                                            <ThemedLabel icon={Sparkles} label="Community Name" />
                                            <ThemedInput
                                                className="text-pink-600 w-full font-bold min-h-[48px]"
                                                style={{
                                                    height: 42,
                                                    fontSize: 18,
                                                    lineHeight: 22,
                                                    textAlignVertical: 'center',
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                }}
                                                placeholder="What's your community called?"
                                                placeholderTextColor="pink"
                                                onChangeText={setCommunityName}
                                                value={communityName}
                                                autoCapitalize="sentences"
                                                autoCorrect={false}
                                                textAlignVertical="top"
                                            />
                                        </ThemedSectionCard>

                                        <ThemedSectionCard>
                                            <ThemedLabel icon={AlignLeft} label="Community Description / Reason " />
                                            <ThemedInput
                                                className="text-lg text-pink-600 w-full"
                                                style={{ minHeight: 120 }}
                                                scrollEnabled={false}
                                                placeholder="Tell people what this community is about..."
                                                placeholderTextColor="pink"
                                                onChangeText={setCommunityDescription}
                                                value={communityDescription}
                                                multiline={true}
                                                autoCapitalize="sentences"
                                                autoCorrect={false}
                                                textAlignVertical="top"
                                            />
                                        </ThemedSectionCard>

                                        <ThemedSectionCard>
                                            <ThemedLabel icon={Sparkles} label="Category" />
                                            <ThemedInput
                                                className="text-lg text-pink-600 w-full"
                                                style={{
                                                    height: 42,
                                                    lineHeight: 22,
                                                    textAlignVertical: 'center',
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                }}

                                                placeholder="What's your community about?"
                                                placeholderTextColor="pink"
                                                onChangeText={setCommunityCategory}
                                                value={communityCategory}
                                                autoCapitalize="sentences"
                                                autoCorrect={false}
                                                textAlignVertical="top"
                                            />
                                        </ThemedSectionCard>

                                    </View>
                                )}

                        </ScrollView>

                    </KeyboardAvoidingView>

                    {/* post button */}
                    <View
                        className="px-4 pb-4 pt-2 bg-gray-50"
                        style={{ paddingBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                    >
                        <TouchableOpacity
                            onPress={tab == 0 ? handleSubmit : handleSubmitCommunityRequest}
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
                                    <Text className="text-white font-semibold text-lg">{tab == 0 ? 'Post' : 'Send Request'}</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView >
    )
}
