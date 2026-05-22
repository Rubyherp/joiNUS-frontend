import { View, Image, Text, Pressable } from 'react-native';
import Logo from '../assets/images/logo-gold.png';
import Spacer from "@/components/themedComponents/spacer";
import ThemedLink from '@/components/themedComponents/themedLink';
import { LinearGradient } from '@/components/ui/linear-gradient';
import { Link } from 'expo-router';


export default function Home() {
    return (
        <LinearGradient
            className="flex-1 items-center justify-center px-8 py-12"
            colors={['#F58529', '#DD2A7B', '#8134AF', '#515BD4']}
            start={[0, 0]}
            end={[1, 1]}
        >
            <Image
                source={Logo}
                className="w-92 h-56"
                resizeMode="contain"
            />

            <Text className='text-2xl text-center font-semibold text-white leading-9'>
                Your{' '}
                <Text className='text-red-300 italic font-extrabold'>Smartest Team</Text>
                {' '}Formation Platform.{'\n'}
                <Text className='italic font-extrabold text-yellow-300'>Effortlessly </Text>
                <Text className='font-semibold text-white'>Connect.</Text>
            </Text>

            <Spacer height={48} />

            <Link href='/login' asChild>
                <Pressable className='active:opacity-70 w-80' >
                    <LinearGradient
                        className="w-full border border-white rounded-full items-center py-2"
                        colors={['#8637CF', '#0F55A1']}
                        start={[0, 1]}
                        end={[1, 0]}
                    >
                        <Text className='text-2xl text-center font-semibold text-white leading-9'>Log In!</Text>
                    </LinearGradient>
                </Pressable>
            </Link>

            <Spacer height={20} />

            <Link href='/register' asChild>
                <Pressable className='active:opacity-70 w-80' >
                    <LinearGradient
                        className="w-full border border-white rounded-full items-center py-2"
                        colors={['#8637CF', '#0F55A1']}
                        start={[0, 1]}
                        end={[1, 0]}
                    >
                        <Text className='text-2xl text-center font-semibold text-white leading-9'>Sign Up!</Text>
                    </LinearGradient>
                </Pressable>
            </Link>


        </LinearGradient>
    )
}
