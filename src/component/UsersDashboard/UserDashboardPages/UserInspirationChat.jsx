









import { useState, useRef, useEffect } from "react";
import { PaperclipIcon, SendIcon, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GoPaperAirplane } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import aiIcon from '../../../assets/image/ai_icon.png';
import { useGetInspirationChatListQuery, useInspirationChatMutation } from "../../../Rudux/feature/ApiSlice";

const UserInspirationChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [reactions, setReactions] = useState({});
    const navigate = useNavigate();
    const [chatId, setChatId] = useState();

    console.log("chatId", chatId)
    const [inspirationChat] = useInspirationChatMutation();
    const { data: getChat} = useGetInspirationChatListQuery(chatId);
    console.log("getChat", getChat)


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };



    useEffect(() => {
        scrollToBottom();
        if (hasUserSentMessage) {
            inputRef.current?.focus();
        }
    }, [messages, hasUserSentMessage]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setSelectedFileName(file.name);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === "" && !selectedImage) return;

        const userMessage = newMessage.trim();
        if (userMessage) {
            setMessages((prev) => [
                ...prev,
                {
                    text: userMessage,
                    chat_id: chatId,
                    isUser: true,
                    timestamp: new Date(),
                },
            ]);

            // Send message to backend using inspirationChat mutation
            try {
                setIsLoading(true);
                console.log("Sending to backend:", { message: userMessage, chat_id: chatId });
                const response = await inspirationChat({ message: userMessage, chat_id: chatId }).unwrap();
                console.log("Backend response:", response);
                setMessages((prev) => [
                    ...prev,
                    {
                        text: response.answer || "Response from backend",
                        isUser: false,
                        timestamp: new Date(),
                        chat_id: response.chat,
                    },
                ]);
                setChatId(response.chat); // Update chatId from backend response
            } catch (error) {
                console.error("Error sending message to backend:", error);
                setMessages((prev) => [
                    ...prev,
                    {
                        text: "Sorry, I encountered an error. Please try again later.",
                        isUser: false,
                        timestamp: new Date(),
                        chat_id: chatId,
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        }

        if (selectedImage) {
            setMessages((prev) => [
                ...prev,
                {
                    image: selectedImage,
                    fileName: selectedFileName,
                    isUser: true,
                    timestamp: new Date(),
                    chat_id: chatId,
                },
            ]);
        }

        setNewMessage("");
        setSelectedImage(null);
        setSelectedFileName("");
        setHasUserSentMessage(true);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReaction = (index, type) => {
        setReactions((prev) => {
            const currentReaction = prev[index] || {};
            if (type === "like") {
                return {
                    ...prev,
                    [index]: {
                        like: !currentReaction.like,
                        dislike: currentReaction.dislike && false,
                    },
                };
            } else {
                return {
                    ...prev,
                    [index]: {
                        like: currentReaction.like && false,
                        dislike: !currentReaction.dislike,
                    },
                };
            }
        });
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleInspirationClick = () => {
        navigate("/inspiration");
        setShowDropdown(false);
    };

    return (
        <div className="p-8 h-full flex flex-col lora">
            <div className="lora flex items-center justify-between p-4">
                <div className="flex flex-col items-start">
                    <div className="flex gap-10">
                        <h1 className="text-[#5B21BD] font-bold text-[35px]">AI Chat</h1>
                        <div className="flex space-x-6">
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="border border-[#CCBAEB] h-full text-[#5B21BD] rounded-xl px-4 flex items-center cursor-pointer font-semibold"
                                >
                                    New Creation
                                    <IoIosArrowDown className="ml-2" />
                                </button>
                                {showDropdown && (
                                    <div className="absolute top-full mt-2 w-40 bg-white border border-[#CCBAEB] rounded-lg shadow-lg z-10">
                                        <Link
                                            to='/dashboard/inspiration_chat'
                                            onClick={handleInspirationClick}
                                            className="block w-full text-left px-4 py-2 text-[#5B21BD] rounded-lg hover:bg-gray-100"
                                        >
                                            New Creation
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-[#A2A2A2] font-medium text-[20px] mt-2">
                        Chat with your culinary AI assistant to get recipe ideas, modifications, and more.
                    </p>
                    <div className="border w-screen mt-4 border-[#E7E7E7]"></div>
                    <div className="py-2">
                        <p className="font-semibold text-[24px] text-[#5B21BD]">Recipe Inspiration</p>
                        <p className="text-[#A2A2A2]">Get creative recipe ideas based on your preferences</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <div className="flex-1 overflow-y-auto p-4 space-y-6 relative mb-10">
                    {!hasUserSentMessage && (
                        <div className="absolute bottom-4 w-[80%]">
                            <div className="flex items-start space-x-3">
                                <div className="rounded-full text-white flex items-center justify-center">
                                    <img src={aiIcon} className="h-10 w-10 mt-1 text-white" />
                                </div>
                                <div className="px-5 py-4 rounded-lg bg-gray-200 dark:bg-[#EFE9F8] text-black dark:text-[#595959] lg:text-[16px] shadow-sm w-full">
                                    <ReactMarkdown>Hello! Im your AI assistant. How can I help you today?</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}


                    {getChat ? getChat.map((message) => (
                        <div key={message.id} className="w-full flex flex-col space-y-3 py-2">
                            {/* User Question (Right Aligned) */}
                            <div className="flex justify-end items-end space-x-3 w-full">
                                <div className="max-w-[75%] px-4 py-3 rounded-xl bg-[#5B21BD] text-white text-sm shadow-md">
                                    {message.question ? (
                                        <span>{message.question}</span>
                                    ) : message.image ? (
                                        <div>
                                            <img
                                                src={message.image}
                                                alt="Uploaded"
                                                className="rounded-lg shadow-md w-24 h-12 object-cover"
                                            />
                                            {message.fileName && (
                                                <p className="text-xs text-gray-200 mt-1">{message.fileName}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-300">Empty message</span>
                                    )}
                                </div>
                                {/* <div className="rounded-full bg-gray-300 flex items-center justify-center">
                                    <img
                                        src={message.userAvatar || "https://via.placeholder.com/40"}
                                        alt="User avatar"
                                        className="rounded-full h-10 w-10 object-cover"
                                    />
                                </div> */}
                            </div>

                            {/* Bot Answer (Left Aligned) */}
                            <div className="flex items-start space-x-3 w-full">
                                <div className="h-10 w-10 rounded-full bg-[#5B21BD] flex items-center justify-center">
                                    <img src={aiIcon} alt="AI avatar" className="h-10 w-10" />
                                </div>
                                <div className="max-w-[75%] px-5 py-4 rounded-lg bg-[#F4F1FA] text-gray-900   text-sm shadow">
                                    <ReactMarkdown>{message.answer || "No response provided."}</ReactMarkdown>

                                    {/* Reactions */}
                                    <div className="flex space-x-2 mt-3">
                                        <button
                                            onClick={() => handleReaction(message.id, "like")}
                                            className={`p-1 rounded-full ${reactions[message.id]?.like ? "text-green-500" : "text-gray-400"
                                                } hover:text-green-600`}
                                            aria-label="Like message"
                                        >
                                            <ThumbsUp className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleReaction(message.id, "dislike")}
                                            className={`p-1 rounded-full ${reactions[message.id]?.dislike ? "text-red-500" : "text-gray-400"
                                                } hover:text-red-600`}
                                            aria-label="Dislike message"
                                        >
                                            <ThumbsDown className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : ""}

                    {/* Typing Animation */}
                    {isLoading && (
                        <div className="flex items-start space-x-3 py-4">
                            <div className="h-10 w-10 rounded-full bg-[#E6EBE8] flex items-center justify-center">
                                <img src={aiIcon} className="h-10 w-10" />
                            </div>
                            <div className="px-5 py-4 rounded-lg bg-[#EFE9F8] text-black dark:text-gray-200 shadow-sm">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {selectedImage && (
                    <div className="mb-3 ml-3 flex items-center space-x-3">
                        <div className="relative">
                            <img
                                src={selectedImage}
                                alt="Selected"
                                className="rounded-lg shadow-md w-24 h-10 object-cover"
                            />
                            <button
                                onClick={() => {
                                    setSelectedImage(null);
                                    setSelectedFileName("");
                                }}
                                className="absolute top-1 right-1 bg-[#5B21BD] text-white rounded-full p-[2px] cursor-pointer"
                            >
                                <GoPaperAirplane />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 truncate max-w-[150px]">{selectedFileName}</p>
                    </div>
                )}

                <div className="p-3 fixed bottom-0 w-6/7 bg-white left-[250px] z-50">
                    <div className="flex items-center border border-[#5B21BD] rounded-[10px] px-4 py-3">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <PaperclipIcon className="h-5 w-5 cursor-pointer bg" />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message"
                            className="flex-1 bg-transparent border-none focus:outline-none mx-3 text-sm"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isLoading}
                            ref={inputRef}
                        />
                        <button
                            className={`${isLoading ? "text-gray-400" : "text-[#5B21BD]"}`}
                            onClick={handleSendMessage}
                            disabled={isLoading}
                        >
                            <SendIcon className="h-5 w-5 cursor-pointer text-[#5B21BD]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInspirationChat;


