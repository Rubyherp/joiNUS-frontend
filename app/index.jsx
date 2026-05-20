import { View, Image, Text, Pressable } from 'react-native';
import Logo from '../assets/images/logo2.png';
import Spacer from "@/components/themedComponents/spacer";
import { Link } from 'expo-router';
import ThemedLink from '@/components/themedComponents/themedLink';


export default function Home() {
    return (
        <View className='flex flex-1 justify-center items-center bg-white'>
            <View
                className="rounded-2xl overflow-hidden border border-red-500 self-center bg-black px-6 py-3"
            >
                <Image
                    source={Logo}
                    className="w-80 h-40"
                    resizeMode="contain"
                />
            </View>
            <Spacer height={60} />

            <Text className='text-2xl text-center font-semibold text-neutral-800'>
                Your <Text className='text-red-500 italic font-extrabold'>Smartest Team</Text> Formation Platform
            </Text>

            <Text className='text-2xl text-center italic font-extrabold text-red-500'>
                Effortlessly <Text className='text-black not-italic font-semibold'> Connect.</Text>
            </Text>
            <Spacer />

            <ThemedLink href={'/login'} text={'Log In'} />
            <Spacer height={20} />

            <ThemedLink href={'/register'} text={'Register'} />

        </View >
    )
}
