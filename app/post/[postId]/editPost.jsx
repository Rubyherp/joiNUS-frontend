import { View, Text, TouchableOpacity, Pressable, ActivityIndicator, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, Image, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { LinearGradient } from "@/components/ui/linear-gradient";
import ThemedInput from "@/components/themedComponents/themedInput";
import DeadlinePicker from "@/components/helpers/deadlinePicker";
import { Button, ButtonText, ButtonGroup } from "@/components/ui/button";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, } from '@/components/ui/actionsheet';
import { Box } from "@/components/ui/box";
import { Icon, CloseIcon } from '@/components/ui/icon';
import { UploadCloud, ImageIcon, FileText, Users, Clock, AlignLeft, Sparkles, Trash } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { PostContext } from "@/context/postContext";
import ThemedLabel from "@/components/themedComponents/themedLabel";
import ThemedSectionCard from "@/components/themedComponents/themedSectionCard";

// 1. retrieve existing post data using postId from route params
// 2. populate the form fields with the existing post data

export default function Create() {
    const { postId } = useLocalSearchParams();

    const [loading, setLoading] = useState(false);

    // Not allowed to change selected Community
    const [selectedCommunityId, setSelectedCommunityId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [moreDetails, setMoreDetails] = useState("");
    const [requirements, setRequirements] = useState("");
    const [memberLimit, setMemberLimit] = useState("");
    const [deadline, setDeadline] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const { uploadPostImage, createPost, fetchPostById, deletePostById } = useContext(PostContext);


    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const postData = await fetchPostById(postId);

            const {
                title,
                description,
                image_url,
                more_details,
                requirements,
                member_limit,
                deadline,
                created_at,
                community_id,
            } = postData || {};

            setTitle(title)
            setDescription(description)
            setMoreDetails(more_details)
            setRequirements(requirements)
            setMemberLimit(member_limit ? String(member_limit) : null)
            setDeadline(deadline)
            setSelectedImage(image_url)
            setSelectedCommunityId(community_id)

            console.log('Post Set')
            setLoading(false);
        }

        loadData();
    }, [])

    const resetState = () => (
        setLoading(false),
        setSelectedCommunityId(null),
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

        setLoading(true);

        let imageUrl = typeof selectedImage === 'string' ? selectedImage : null;

        if (selectedImage && typeof selectedImage === 'object' && selectedImage.uri) {
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
                postId,
                communityId: selectedCommunityId,
                title,
                description,
                moreDetails,
                memberLimit: memberLimit ? parseInt(memberLimit) : null,
                requirements,
                deadline: deadline ? deadline : null,
                imageUrl
            });
            router.replace('/landing');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create post');
        } finally {
            resetState();
        }
    }

    const handleDeletePost = async () => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePostById(postId);
                            router.replace('/landing');
                        } catch (error) {
                            Alert.alert('Error', error.message || 'Failed to delete Post');
                        }
                    }
                }
            ]
        );
    }

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <View className="flex-1" onPress={() => { Keyboard.dismiss() }}>

                <View className="flex-1">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1"
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                    >

                        {/* top bar */}
                        <View className="flex-row justify-between items-center px-4">

                            {/* header */}

                            <View className="flex-1 ">
                                <Pressable onPress={() => router.back()} className="mr-3 p-1 gap-2 flex-row justify-center items-center">
                                    <Text className="text-2xl text-gray-500">←</Text>
                                    <Text className="text-base font-semibold text-gray-800 flex-1 justify-center">Return</Text>
                                </Pressable>
                            </View>



                        </View>

                        <ScrollView
                            className="flex-1 px-4"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 24 }}
                        >

                            {/* To remove cuz user shouldn't change the community */}
                            {/* community picker */}
                            {/* <View className="flex-shrink-1 max-w-[50%]"> */}
                            {/*     <CommunityPicker onSelect={c => setSelectedCommunity(c)} /> */}
                            {/*     <Spacer height={10} /> */}
                            {/* </View> */}

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
                                        source={{ uri: typeof selectedImage === 'string' ? selectedImage : selectedImage.uri }}
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
                                        <DeadlinePicker onSelect={date => setDeadline(date)} existingDate={deadline} />
                                    </View>
                                </View>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>

                    {/* post button */}
                    <View
                        className="px-4 py-4 bg-gray-50 flex-row gap-2"
                        style={{ paddingBottom: 30, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                    >
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.7}
                            className="flex-1"
                            style={{ opacity: loading ? 0.7 : 1 }}
                        >
                            <LinearGradient
                                className={`py-1.5 rounded-3xl justify-center items-center`}
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

                        {/* delete button */}
                        <Pressable
                            onPress={handleDeletePost}
                            className="flex-row gap-2 bg-red-700 rounded-full items-center px-4 py-1.5"
                        >
                            <Trash size={24} color={'white'} />
                            <Text className="text-white font-bold text-base">Delete</Text>
                        </Pressable>

                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}
