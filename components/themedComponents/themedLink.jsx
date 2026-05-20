import { Link } from "expo-router"
import { Pressable, Text } from "react-native"

export default function ThemedLink({ href, text, style, children }) {
    // style for setting specific styles if u want and convenience =)
    return (
        <Link href={href} asChild>
            <Pressable className='border border-red-500 rounded-3xl p-4 active:opacity-70 bg-black w-80' style={style}>
                <Text className='font-semibold text-center text-2xl text-white'>{text}</Text>
            </Pressable>
            {children}
        </Link>
    )

}
