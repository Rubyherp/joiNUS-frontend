import { View, Image, Text } from 'react-native';
import Logo from '../assets/images/logo2.png';
import Spacer from "@/components/themedComponents/spacer";

export default function Home() {
    return (
        <View className='flex flex-1 flex-col justify-center items-center bg-white'>
            <Image source={Logo} className='w-80 h-40' resizeMode='contain' />
            <Text className='mb-4'>Hello world</Text>
        </View >
    )
}
