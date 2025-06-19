






import { useState, useRef, useEffect } from "react";
import { PaperclipIcon, SendIcon, ThumbsUp, ThumbsDown, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import aiIcon from '../../../assets/image/ai_icon.png';
import { useAiMassageCreateMutation, useAiMassageReactCreateMutation, useGetAiRecipeListQuery, useGetChatMessageListQuery, useGetCreateRecipeQuery } from "../../../Rudux/feature/ApiSlice";

// import { useAiMassageCreateMutation, useAiMassageReactCreateMutation, useGetAiRecipeListQuery, useGetChatMessageListQuery, useGetCreateRecipeQuery } from "../../../../Rudux/feature/ApiSlice";

const ChefAiChat = () => {
  const { data: recipesData, isLoading: isRecipesLoading, error: recipesError } = useGetCreateRecipeQuery();
  console.log("recipesData", recipesData);
const { data: getAiRecipeList } = useGetAiRecipeListQuery();
console.log("getAiRecipeList", getAiRecipeList);
const RecipeList = getAiRecipeList?.data || [];
  const [AiMassageCreate] = useAiMassageCreateMutation();
  const [AiMassageReactCreate] = useAiMassageReactCreateMutation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRecipeDropdown, setShowRecipeDropdown] = useState(false);
  const [reactions, setReactions] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const { data: getChatMessageList } = useGetChatMessageListQuery(selectedRecipe, {
    skip: !selectedRecipe
  });

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const recipeDropdownRef = useRef(null);

  // Load chat history when recipe is selected or chat data changes
  useEffect(() => {
    if (getChatMessageList?.length > 0 && selectedRecipe) {
      const formattedMessages = [];
      
      getChatMessageList.forEach(msg => {
        // Add user question
        if (msg.question) {
          formattedMessages.push({
            text: msg.question,
            isUser: true,
            timestamp: new Date(msg.created_at || new Date()),
            id: msg.id
          });
        }
        
        // Add AI answer
        if (msg.answer) {
          formattedMessages.push({
            text: msg.answer,
            isUser: false,
            timestamp: new Date(msg.created_at || new Date()),
            id: msg.id,
            reactions: {
              like: msg.like || false,
              dislike: msg.dislike || false
            }
          });
        }
      });
      
      // Sort by timestamp
      formattedMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      setMessages(formattedMessages);
      setHasUserSentMessage(formattedMessages.length > 0);
      
      // Initialize reactions state
      const initialReactions = {};
      formattedMessages.forEach((msg, index) => {
        if (msg.reactions) {
          initialReactions[index] = {
            like: msg.reactions.like,
            dislike: msg.reactions.dislike
          };
        }
      });
      setReactions(initialReactions);
    } else if (selectedRecipe) {
      // If no messages for this recipe, reset
      setMessages([]);
      setHasUserSentMessage(false);
      setReactions({});
    }
  }, [getChatMessageList, selectedRecipe]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          !event.target.closest('.chat-dropdown-button')) {
        setShowDropdown(false);
      }
      if (recipeDropdownRef.current && !recipeDropdownRef.current.contains(event.target) &&
          !event.target.closest('.recipe-dropdown-button')) {
        setShowRecipeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateAIResponse = async (formData) => {
    setIsLoading(true);
    try {
      const response = await AiMassageCreate(formData).unwrap();
      const botResponse = response?.data?.message || "Default response from AI";
      const chatMessageId = response?.data?.id;

      // Fallback responses
      let finalResponse = botResponse;
      if (formData.message.toLowerCase().includes("hello") || formData.message.toLowerCase().includes("hi")) {
        finalResponse = "Hello! How can I assist you today?";
      } else if (formData.message.toLowerCase().includes("help")) {
        finalResponse = "I'm here to help! What do you need assistance with?";
      } else if (formData.message.toLowerCase().includes("thank")) {
        finalResponse = "You're welcome! Is there anything else I can help with?";
      } else if (formData.message.toLowerCase().includes("bye")) {
        finalResponse = "Goodbye! Feel free to return if you have more questions.";
      }

      setMessages((prev) => [
        ...prev,
        {
          text: finalResponse,
          isUser: false,
          timestamp: new Date(),
          id: chatMessageId,
        },
      ]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
          isUser: true,
          timestamp: new Date(),
        },
      ]);
    }

    if (selectedImage) {
      setMessages((prev) => [
        ...prev,
        {
          image: selectedImage,
          fileName: selectedFileName,
          isUser: true,
          timestamp: new Date(),
        },
      ]);
    }

    setNewMessage("");
    setSelectedImage(null);
    setSelectedFileName("");
    setHasUserSentMessage(true);

    if (userMessage) {
      const formData = {
        recipe_id: selectedRecipe ? String(selectedRecipe) : null,
        message: userMessage,
      };
      await generateAIResponse(formData);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = async (index, type) => {
    const message = messages[index];
    if (!message.id) {
      console.error("No chat_message_id available for this message");
      return;
    }

    // Update local reactions state optimistically
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

    // Send reaction to the backend
    try {
      const formData = {
        chat_message_id: String(message.id),
        react: type,
      };
      await AiMassageReactCreate(formData).unwrap();
    } catch (error) {
      console.error("Error sending reaction:", error);
      // Revert optimistic update on error
      setReactions((prev) => {
        const currentReaction = prev[index] || {};
        if (type === "like") {
          return {
            ...prev,
            [index]: {
              like: currentReaction.like && false,
              dislike: currentReaction.dislike,
            },
          };
        } else {
          return {
            ...prev,
            [index]: {
              like: currentReaction.like,
              dislike: currentReaction.dislike && false,
            },
          };
        }
      });
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setShowRecipeDropdown(false);
  };

  const toggleRecipeDropdown = () => {
    setShowRecipeDropdown((prev) => !prev);
    setShowDropdown(false);
  };

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipe(recipeId);
    setShowRecipeDropdown(false);
  };

  const handleInspirationClick = () => {
    navigate("/inspiration");
    setShowDropdown(false);
  };

  if (isRecipesLoading) return <div>Loading recipes...</div>;
  if (recipesError) return <div>Error loading recipes: {recipesError.message}</div>;

  return (
    <div className="p-8 h-full flex flex-col lora">
      <div className="lora flex items-center justify-between p-4">
        <div className="flex flex-col items-start">
          <div className="flex gap-10">
            <h1 className="text-[#5B21BD] font-bold text-[35px]">AI Chat</h1>
            <div className="flex space-x-6">
              <div className="relative" ref={recipeDropdownRef}>
                <button
                  onClick={toggleRecipeDropdown}
                  className="recipe-dropdown-button border h-full border-[#EFE9F8] text-[#5B21BD] rounded-xl px-4 flex items-center cursor-pointer font-semibold"
                  aria-label="Select Recipe"
                >
                  Select Recipe
                  <IoIosArrowDown className={`ml-2 transition-transform ${showRecipeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showRecipeDropdown && (
                  <div className="absolute top-full mt-2 w-48 bg-white border border-[#EFE9F8] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {(RecipeList || []).map((recipe, index) => (
                      <button
                        key={recipe.id || index}
                        className={`block w-full text-left px-4 py-2 text-[#5B21BD] hover:bg-gray-100 ${
                          selectedRecipe === recipe.id ? 'bg-[#EFE9F8]' : ''
                        }`}
                        onClick={() => handleRecipeSelect(recipe.id)}
                      >
                        {recipe.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="chat-dropdown-button border h-full border-[#EFE9F8] text-[#5B21BD] rounded-xl px-4 flex items-center cursor-pointer font-semibold"
                  aria-label="Chat Options"
                >
                  Recipe Chat
                  <IoIosArrowDown className={`ml-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div className="absolute top-full mt-2 w-40 bg-white border border-[#EFE9F8] rounded-lg shadow-lg z-10">
                    <Link
                       to='/chef_dashboard/chef_inspiration'
                      onClick={handleInspirationClick}
                      className="block w-full text-left px-4 py-2 text-[#5B21BD] hover:bg-gray-100"
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
          <div className="border w-screen mt-4 border-[#CCBAEB]"></div>
          <div className="py-2">
            <p className="font-semibold text-[24px] text-[#5B21BD]">
              {RecipeList?.find(recipe => recipe.id === selectedRecipe)?.title || "Select a Recipe"}
            </p>
            <p className="text-[#A2A2A2]">Ask questions specific to this recipe</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4 space-y-6 relative mb-10">
          {messages.length === 0 && !hasUserSentMessage && (
            <div className="absolute bottom-4 md:w-[80%]">
              <div className="flex items-start space-x-3">
                <div className="rounded-full text-white flex items-center justify-center">
                  <img src={aiIcon} className="h-10 w-10 mt-1 text-white" alt="AI Icon" />
                </div>
                <div className="px-5 py-4 rounded-lg bg-gray-200 dark:bg-[#EFE9F8] text-black dark:text-[#595959] lg:text-[16px] shadow-sm w-full">
                  <ReactMarkdown>
                    {selectedRecipe 
                      ? `Hello! I'm your AI assistant for this recipe. How can I help you with ${recipesData?.data?.find(r => r.id === selectedRecipe)?.title || "it"}?`
                      : "Hello! I'm your AI assistant. Please select a recipe to start chatting about it."}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className="flex w-full">
              {message.isUser ? (
                <div className="flex flex-col items-end w-full">
                  <div className="flex justify-end items-end space-x-3">
                    {message.text ? (
                      <div className="px-4 py-3 rounded-xl bg-[#5B21BD] text-white lg:text-[16px] shadow-md w-full">
                        <span>{message.text}</span>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div>
                          <img
                            src={message.image}
                            alt="Uploaded"
                            className="rounded-lg shadow-md w-24 h-12 object-cover"
                          />
                          {message.fileName && (
                            <p className="text-xs text-gray-500 mt-1 capitalize">{message.fileName}</p>
                          )}
                        </div>
                      </div>
                    )}
                   
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-start space-x-3 w-[80%]">
                    <div className="h-10 w-10 rounded-full bg-[#5B21BD] flex items-center justify-center">
                      <img src={aiIcon} className="h-10 w-10 text-white" alt="AI Icon" />
                    </div>
                    <div className="px-5 py-4 rounded-lg bg-[#EFE9F8] text-black dark:text-[#595959] lg:text-[16px] max-w-[80%]">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 ml-14">
                    <button
                      onClick={() => handleReaction(index, "like")}
                      className={`p-1 rounded-full cursor-pointer ${reactions[index]?.like ? "text-green-500" : "text-gray-400"} hover:text-green-600`}
                      aria-label="Like message"
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReaction(index, "dislike")}
                      className={`p-1 rounded-full cursor-pointer ${reactions[index]?.dislike ? "text-red-500" : "text-gray-400"} hover:text-red-600`}
                      aria-label="Dislike message"
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full">
              <div className="flex flex-col items-start w-full">
                <div className="flex items-start space-x-3 mb-12">
                  <div className="h-10 w-10 rounded-full bg-[#EFE9F8] flex items-center justify-center">
                    <img src={aiIcon} className="h-10 w-10 text-white" alt="AI Icon" />
                  </div>
                  <div className="px-5 py-4 rounded-lg bg-[#EFE9F8] text-black dark:text-gray-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
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
                className="absolute top-1 right-1 bg-[#5B21BD] text-white rounded-full p-[2px] hover:bg-[#2f6ea9] cursor-pointer"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 truncate max-w-[150px]">{selectedFileName}</p>
          </div>
        )}

        <div className="p-3 fixed bottom-0 w-full md:w-[calc(100%-270px)] bg-white left-0 md:left-[270px] z-50">
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
              aria-label="Upload image"
            >
              <PaperclipIcon className="h-5 w-5 cursor-pointer" />
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
              aria-label="Message input"
            />
            <button
              className={`${isLoading ? "text-gray-400 cursor-not-allowed" : "text-blue-500"}`}
              onClick={handleSendMessage}
              disabled={isLoading}
              aria-label="Send message"
            >
              <SendIcon className="h-5 w-5 cursor-pointer text-[#5B21BD]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefAiChat;
