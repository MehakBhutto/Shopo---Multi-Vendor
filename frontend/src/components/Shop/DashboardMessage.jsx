import React, { useState, useEffect } from 'react';
import { server } from '../../../server';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai';
import { TfiGallery } from 'react-icons/tfi';
import styles from '../../styles/styles';
import socketIO from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000/';
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessage = () => {
    const { seller } = useSelector((state) => state.seller);
    const [conversation, setConversation] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]); // Fixed: Initialized as empty array
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    // Socket listener for incoming messages
    useEffect(() => {
        socketId.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            });
        });
        return () => socketId.off("getMessage"); // Cleanup socket listener
    }, []);

    // Append socket message to state if relevant to current chat
    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage, currentChat]);

    // Fetch all active conversations for the seller
    useEffect(() => {
        if (seller?._id) {
            axios.get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, { withCredentials: true })
                .then((res) => {
                    setConversation(res.data.conversation);
                }).catch((e) => {
                    console.log(e?.response?.data?.message);
                });
        }
    }, [seller]);

    // FIXED: Corrected async/await syntax and logic inside useEffect
    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`${server}/message/get-all-messages/${currentChat._id}`);
                setMessages(res.data.messages || []);
            } catch (e) {
                console.log(e);
            }
        };
    }, [currentChat]);

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        if (!currentChat || !newMessage.trim()) return;

        const message = {
            sender: seller?._id || seller?.id,
            text: newMessage.trim(),
            conversationId: currentChat?._id,
        };

        const receiverId = currentChat?.members?.find((member) => member !== seller?._id);

        socketId.emit("sendMessage", {
            senderId: seller?._id,
            receiverId,
            text: message.text,
        });

        try {
            const res = await axios.post(`${server}/message/create-new-message`, message);
            setMessages((prev) => [...prev, res.data.message]);
            await updateLastMessage(message.text);
            setNewMessage("");
        } catch (e) {
            console.log(e);
        }
    };

    const updateLastMessage = async (messageText) => {
        try {
            await axios.put(`${server}/conversation/update-last-message/${currentChat?._id}`, {
                lastMessage: messageText,
                lastMessageId: seller?._id,
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className='w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded'>
            {!open && (
                <>
                    <h1 className="text-center text-[25px] py-3 font-Poppins">All Messages</h1>
                    {conversation && conversation.map((item, index) => (
                        <MessageList 
                            data={item} 
                            key={item._id || index} 
                            index={index} 
                            setOpen={setOpen} 
                            setCurrentChat={setCurrentChat} 
                        />
                    ))}
                </>
            )}
            {open && (
                <SellerInbox 
                    setOpen={setOpen} 
                    newMessage={newMessage} 
                    setNewMessage={setNewMessage} 
                    sendMessageHandler={sendMessageHandler}
                    messages={messages}
                    sellerId={seller?._id}
                />
            )}
        </div>
    );
};

const MessageList = ({ data, index, setOpen, setCurrentChat }) => {
    const [active, setActive] = useState(null);
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`?${id}`);
        setOpen(true);
    };

    return (
        <div 
            className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : 'bg-transparent'} hover:bg-[#00000005] cursor-pointer`} 
            onClick={() => {
                setActive(index);
                setCurrentChat(data);
                handleClick(data._id);
            }}
        >
            <div className="relative w-[50px] h-[50px] flex-shrink-0">
                <img src="http://localhost:4000/p_img2_1-1785326554062-991760475.png" className='w-full h-full rounded-full object-cover' alt="User profile" />
                <div className="w-[14px] h-[14px] bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white"></div>
            </div>
            <div className='pl-4 w-full'>
                <h1 className='text-[18px] font-medium'>User Name</h1> {/* Map actual name profile from data if available */}
                <p className='text-[14px] text-[#000c] truncate max-w-[90%]'>
                    {data?.lastMessage ? data.lastMessage : "Start a new conversation"}
                </p>
            </div>
        </div>
    );
};

// FIXED: Passed down 'messages' and 'sellerId' to dynamically render values instead of hardcoded items
const SellerInbox = ({ setOpen, newMessage, setNewMessage, sendMessageHandler, messages, sellerId }) => {
    return (
        <div className='w-full min-h-full flex flex-col justify-between'>
            {/* Message header */}
            <div className="w-full flex p-3 items-center justify-between bg-slate-200">
                <div className="flex items-center">
                    <img src="http://localhost:4000/p_img2_1-1785326554062-991760475.png" className='w-[50px] h-[50px] rounded-full mr-3' alt="" />
                    <div>
                        <h1 className='text-[18px] font-[600]'>Chat Partner</h1>
                        <h1 className='text-[12px] text-green-600 font-medium'>Active Now</h1>
                    </div>
                </div>
                <AiOutlineArrowRight size={25} onClick={() => setOpen(false)} className='cursor-pointer' />
            </div>

            {/* Messages body - Dynamically mapping over database messages */}
            <div className="px-3 pt-2 h-[55vh] overflow-y-scroll flex flex-col gap-2">
                {messages && messages.map((item, index) => {
                    const isSender = item.sender === sellerId;
                    return (
                        <div key={item._id || index} className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'}`}>
                            {!isSender && (
                                <img src="http://localhost:4000/p_img2_1-1785326554062-991760475.png" className="w-[35px] h-[35px] rounded-full mr-2 self-end" alt="" />
                            )}
                            <div className={`p-2.5 rounded-lg max-w-[70%] h-min text-[15px] ${isSender ? 'bg-[#38c776] text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}>
                                <p>{item.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Send Messages input */}
            <form onSubmit={sendMessageHandler} className='p-3 relative flex w-full items-center border-t'>
                <div className="w-[5%]">
                    <TfiGallery size={20} className='cursor-pointer text-gray-500' />
                </div>
                <div className="w-[95%] relative">
                    <input 
                        type='text' 
                        placeholder='Enter your message...' 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        className={`${styles.input} pr-12`} 
                        required 
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 bg-transparent border-0 outline-none">
                        <AiOutlineSend size={22} className='cursor-pointer' />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DashboardMessage;
