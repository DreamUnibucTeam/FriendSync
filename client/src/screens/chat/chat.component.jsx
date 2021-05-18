import React, { useState, useEffect, useCallback } from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import dummyMessages from "./chat.data";
import { GiftedChat } from "react-native-gifted-chat";

import { renderBubble, scrollToBottomComponent } from "./chat.styles";

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      alwaysShowSend
      renderBubble={renderBubble}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
  );
};

export default Chat;
