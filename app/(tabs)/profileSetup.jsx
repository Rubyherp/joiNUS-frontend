import { useContext, useState, useEffect } from "react";
import { View, Keyboard, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "@/context/userContext";

//ThemedInput
import Spacer from "@/components/themedComponents/spacer";
import ThemedInput from "@/components/themedComponents/themedInput";
import { router } from "expo-router";

export default function ProfileSetup() {
    const { profileCreation, fetchUserDetails, user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [profileDetails, setProfileDetails] = useState(
        { username: '', year: '', major: '', modules: '', contact: '', email: '', about: '', skills: '', experiences: '' }
    );

    const loadData = async () => {
        try {
            const userDetails = await fetchUserDetails(user.id);
            if (userDetails) {
                const { username, year, major, modules, contact, email, about, skills, experiences } = userDetails || {};

                setProfileDetails({
                    username: username ?? '',
                    year: year ? String(year) : '',
                    major: major ?? '',
                    modules: modules ?? '',
                    contact: contact ?? '',
                    email: email ?? '',
                    about: about ?? '',
                    skills: skills ?? '',
                    experiences: experiences ?? ''
                });
            }

        } catch (error) {
            console.log('Error: ProfileSetup', error.message);
            Alert.alert('Error', 'Failed to load data');
        }
    }

    useEffect(() => {
        loadData();
    }, [user?.id]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await profileCreation({
                ...profileDetails,
                year: profileDetails.year ? parseInt(profileDetails.year) : null
            });
            router.replace('/profile');
        } catch (error) {
            Alert.alert(error.message);
        }
        setLoading(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                style={{ flex: 1 }}
                colors={['#FF6B6B', '#FFE66D']}
                start={[0, 0]}
                end={[1, 1]}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Spacer height={20} />

                        {/* header */}
                        <Text className="text-4xl font-black tracking-tight text-gray-900">Set Up Your</Text>
                        <Text className="text-4xl font-black tracking-tight text-gray-900">Profile ✦</Text>
                        <Spacer height={6} />

                        {/* progress bar */}
                        <Text className="text-xs font-bold tracking-widest uppercase text-gray-700">Step {step + 1} of 3</Text>
                        <Spacer height={14} />

                        <View className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: step === 0 ? '33%' : step === 1 ? '66%' : '100%' }}
                            />
                        </View>
                        <Spacer height={28} />

                        {/* pages */}
                        <View
                            className="rounded-3xl p-6"
                            style={{ backgroundColor: 'rgba(255,255,255,0.75)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 }}
                        >
                            {step === 0 ? (
                                <>
                                    {/* username */}
                                    <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Username</Text>
                                    <Spacer height={8} />
                                    <ThemedInput
                                        className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full h-14 px-4"
                                        testID="username-input"
                                        placeholder="Brainrotting-67"
                                        value={profileDetails.username}
                                        onChangeText={(text) => setProfileDetails(prev => ({ ...prev, username: text }))}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <Spacer height={20} />

                                    {/* major */}
                                    <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Major</Text>
                                    <Spacer height={8} />

                                    <ThemedInput
                                        className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full h-14 px-4"
                                        testID="major-input"
                                        placeholder="Bachelor of Computing in Computer Science..."
                                        value={profileDetails.major}
                                        onChangeText={(text) => setProfileDetails(prev => ({ ...prev, major: text }))}
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                    />
                                    <Spacer height={20} />

                                    {/* year */}
                                    <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Year</Text>
                                    <Spacer height={8} />

                                    <ThemedInput
                                        className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full h-14 px-4"
                                        testID="year-input"
                                        placeholder="1 / 2 / 3 / 4"
                                        value={profileDetails.year}
                                        onChangeText={(text) => setProfileDetails(prev => ({ ...prev, year: text }))}
                                        keyboardType="numeric"
                                    />
                                    <Spacer height={20} />

                                    {/* modules */}
                                    <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Modules</Text>
                                    <Spacer height={8} />

                                    <ThemedInput
                                        className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full h-14 px-4"
                                        testID="modules-input"
                                        placeholder="CS2030S CS2040S MA1521 MA1522 CS3231"
                                        value={profileDetails.modules}
                                        onChangeText={(text) => setProfileDetails(prev => ({ ...prev, modules: text }))}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <Spacer height={20} />

                                </>
                            ) : step === 1
                                ? (
                                    <>
                                        {/* contact */}
                                        <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Contact</Text>
                                        <Spacer height={8} />

                                        <ThemedInput
                                            className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full h-14 px-4"
                                            testID="contact-input"
                                            placeholder="@username (Telegram)"
                                            value={profileDetails.contact}
                                            onChangeText={(text) => setProfileDetails(prev => ({ ...prev, contact: text }))}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                        <Spacer height={20} />

                                        {/* email */}
                                        <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Email</Text>
                                        <Spacer height={8} />

                                        <ThemedInput
                                            className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full h-14 px-4"
                                            testID="email-input"
                                            placeholder="example123@gmail.com / e1234567@u.nus.edu"
                                            value={profileDetails.email}
                                            onChangeText={(text) => setProfileDetails(prev => ({ ...prev, email: text }))}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                        <Spacer height={20} />

                                        {/* about */}
                                        <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">About Me</Text>
                                        <Spacer height={8} />

                                        <ThemedInput
                                            className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full px-4 pt-4"
                                            testID="about-input"
                                            style={{ height: 110 }}
                                            placeholder="I am a year 4 CS student who loves..."
                                            value={profileDetails.about}
                                            onChangeText={(text) => setProfileDetails(prev => ({ ...prev, about: text }))}
                                            autoCorrect={false}
                                            multiline={true}
                                            textAlignVertical="top"
                                        />
                                        <Spacer height={20} />

                                    </>
                                ) : (
                                    <>

                                        {/* skills */}
                                        <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Skills</Text>
                                        <Spacer height={8} />

                                        <ThemedInput
                                            className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full px-4 pt-4"
                                            testID="skills-input"
                                            style={{ height: 110 }}
                                            placeholder="JavaScript, React Native, Node.js..."
                                            value={profileDetails.skills}
                                            onChangeText={(text) => setProfileDetails(prev => ({ ...prev, skills: text }))}
                                            autoCorrect={false}
                                            multiline={true}
                                            textAlignVertical="top"
                                        />
                                        <Spacer height={20} />

                                        {/* experiences */}
                                        <Text className="text-xs font-extrabold tracking-widest uppercase text-gray-700">Experiences</Text>
                                        <Spacer height={8} />

                                        <ThemedInput
                                            className="text-base text-white bg-slate-700 border border-black/10 rounded-2xl w-full px-4 pt-4"
                                            testID="experiences-input"
                                            style={{ height: 110 }}
                                            placeholder="Intern at Google... AI Enginner at Nvidia..."
                                            value={profileDetails.experiences}
                                            onChangeText={(text) => setProfileDetails(prev => ({ ...prev, experiences: text }))}
                                            autoCorrect={false}
                                            multiline={true}
                                            textAlignVertical="top"
                                        />

                                    </>

                                )
                            }
                        </View>
                        <Spacer height={56} />

                        {/* page control */}
                        <View className="flex-row gap-3 items-center">
                            {step > 0 && (
                                <TouchableOpacity
                                    onPress={step === 1 ? () => setStep(0) : step === 2 ? () => setStep(1) : null}
                                    activeOpacity={0.7}
                                    className="px-5 py-4 rounded-2xl border border-black/10"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                                >
                                    <Text className="text-sm font-bold text-gray-600">← Back</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={step === 0 ? () => setStep(1) : step === 1 ? () => setStep(2) : handleSubmit}
                                disabled={loading}
                                activeOpacity={0.7}
                                className="flex-1"
                            >
                                <LinearGradient
                                    className="py-4 rounded-2xl justify-center items-center"
                                    colors={['#8637CF', '#0F55A1']}
                                    start={[0, 1]}
                                    end={[1, 0]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text className="text-white font-bold text-base">
                                            {step === 2 ? 'Finish Setup 🎉' : 'Next →'}
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <Spacer height={20} />

                        <View className="flex-row justify-center gap-2">
                            <View className={`h-2 rounded-full ${step === 0 ? 'w-6 bg-purple-600' : 'w-2 bg-black/15'}`} />
                            <View className={`h-2 rounded-full ${step === 1 ? 'w-6 bg-purple-600' : 'w-2 bg-black/15'}`} />
                            <View className={`h-2 rounded-full ${step === 2 ? 'w-6 bg-purple-600' : 'w-2 bg-black/15'}`} />
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}


