// Testing glueStack functionality
// Ignore this file
// Ignore this file
// Ignore this file

// import { Box } from "@/components/ui/box";
// import { Text } from "@/components/ui/text";
// import { Heading } from "@/components/ui/heading";
// import { Button, ButtonText } from "@/components/ui/button";
// import { Input, InputField } from "@/components/ui/input";
// import { VStack } from "@/components/ui/vstack";
// import { HStack } from "@/components/ui/hstack";
// import { Divider } from "@/components/ui/divider";
// import { Badge, BadgeText } from "@/components/ui/badge";
// import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
// import { Pressable } from "@/components/ui/pressable";
// import { useState } from "react";
//
// export default function Index() {
//     const [inputValue, setInputValue] = useState("");
//
//     return (
//         <Box className="flex-1 bg-white p-4">
//             <VStack space="xl">
//
//                 <Heading className="text-2xl text-primary-600">joiNUS 👋</Heading>
//
//                 <VStack space="xs">
//                     <Text className="text-lg font-bold">Large bold text</Text>
//                     <Text className="text-md">Regular body text</Text>
//                     <Text className="text-sm text-gray-400">Small muted text</Text>
//                 </VStack>
//
//                 <Divider />
//
//                 <VStack space="sm">
//                     <Text className="font-bold">Input field</Text>
//                     <Input variant="outline" size="md">
//                         <InputField
//                             placeholder="Type something..."
//                             value={inputValue}
//                             onChangeText={setInputValue}
//                         />
//                     </Input>
//                 </VStack>
//
//                 <VStack space="sm">
//                     <Text className="font-bold">Buttons</Text>
//                     <HStack space="sm">
//                         <Button onPress={() => alert("Primary!")}>
//                             <ButtonText>Primary</ButtonText>
//                         </Button>
//                         <Button variant="outline" action="primary">
//                             <ButtonText>Outline</ButtonText>
//                         </Button>
//                         <Button action="negative">
//                             <ButtonText>Delete</ButtonText>
//                         </Button>
//                     </HStack>
//                 </VStack>
//
//                 <Divider />
//
//                 <HStack space="sm" className="items-center">
//                     <Text className="font-bold">Badges: </Text>
//                     <Badge action="success"><BadgeText>Active</BadgeText></Badge>
//                     <Badge action="warning"><BadgeText>Pending</BadgeText></Badge>
//                     <Badge action="error"><BadgeText>Closed</BadgeText></Badge>
//                 </HStack>
//
//                 <Pressable onPress={() => alert("Card pressed!")}>
//                     <Box className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                         <HStack space="md" className="items-center">
//                             <Avatar size="md">
//                                 <AvatarFallbackText>JN</AvatarFallbackText>
//                             </Avatar>
//                             <VStack>
//                                 <Text className="font-bold">joiNUS Event</Text>
//                                 <Text className="text-sm text-gray-400">Tap to view details</Text>
//                             </VStack>
//                         </HStack>
//                     </Box>
//                 </Pressable>
//
//             </VStack>
//         </Box>
//     );
// }
