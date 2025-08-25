import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { chatAPI } from "./api";
import "./chats.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatAPI.getMessages();
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    
    // Set up polling for new messages (since we don't have real-time listeners yet)
    const interval = setInterval(fetchMessages, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Send a message with profanity check
  const sendMessage = async () => {
    if (!newMessage.trim() || !isSignedIn || !user) return;

    try {
      const userData = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName,
        profileImage: user.profileImageUrl
      };

      await chatAPI.sendMessage(userData, newMessage);
      setNewMessage("");
      
      // Refresh messages
      const response = await chatAPI.getMessages();
      setMessages(response.data);
    } catch (error) {
      console.error("Error in sendMessage:", error);
    }
  };

  // Check if the user is logged in
  const isUserLoggedIn = isSignedIn && user;

  return (
    <div className="chat-container">
      {!isUserLoggedIn ? (
        <div className="please-sign-in">
          <h2>Please sign in to chat</h2>
        </div>
      ) : (
        <>
          <div className="messages">
            {messages.map((message) => (
              <div key={message._id} className="message">
                <strong>{message.user?.fullName || message.user?.email || "Anonymous"}:</strong> {message.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;