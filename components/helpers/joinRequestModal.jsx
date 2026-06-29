import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, } from '@/components/ui/modal';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function joinRequestModal({ visible, onClose, onSubmit }) {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        onSubmit(message.trim());
        setMessage("");
        onClose();
    }

    return (

        <Modal isOpen={visible} onClose={onClose} className="">

            <ModalBackdrop />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="items-center justify-center w-full"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <ModalContent className="bg-black/100 border border-white">


                    <ModalHeader>
                        <Heading size="md">Send a Join Request</Heading>
                        <ModalCloseButton />
                    </ModalHeader>

                    <ModalBody>
                        <VStack space="sm">
                            <Text size="sm" className='text-gray-200'>
                                Add a short message to the host (optional)
                            </Text>
                            <Textarea size="md" className='border border-white'>
                                <TextareaInput
                                    placeholder='e.g. I have experience with...'
                                    value={message}
                                    onChangeText={setMessage}
                                    maxLength={200}
                                    className='text-white'
                                />
                            </Textarea>
                            <Text size='xs' className='text-gray-300 text-right'>
                                {message.length}/200
                            </Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='outline' action="secondary" onPress={onClose} className='border border-white/100'>
                            <ButtonText className='text-gray-200'>Cancel</ButtonText>
                        </Button>
                        <Button onPress={handleSubmit}>
                            <ButtonText className='text-black'>Send Request</ButtonText>
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </KeyboardAvoidingView>
        </Modal>
    );
}
