import React, { useState, useEffect } from 'react';
import { backend_url, server } from '../../../server';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai';
import { TfiGallery } from 'react-icons/tfi';
import styles from '../../styles/styles';
import socketIO from 'socket.io-client';
import { format } from "timeago.js";

const ENDPOINT = 'http://localhost:3000/';
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessage = () => {
    const { seller } = useSelector((state) => state.seller);
    const [conversation, setConversation] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [onlineUser, setOnlineUsers] = useState([]);
    const [activeStatus, setActiveStatus] = useState(false)
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        socketId.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            });
        });
        return () => socketId.off("getMessage");
    }, []);

    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage, currentChat]);


    useEffect(() => {
        if (seller?._id) {
            axios.get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
                withCredentials: true
            })
                .then((res) => {
                    setConversation(res.data.conversation);
                }).catch((e) => {
                    console.log(e?.response?.data?.message);
                });
        }
    }, [seller]);

    useEffect(() => {
        if (seller) {
            const userId = seller?._id;
            socketId.emit("addUser", userId);
            socketId.on("getUsers", (data) => {
                setOnlineUsers(data)
            });
        }
    }, [seller]);

    const onlineCheck = (chat) => {
        const chatMembers = chat.members.find((member) => member !== seller?._id);
        const online = onlineUser.find((user) => user?.userId === chatMembers);

        return online ? true : false;
    }

    useEffect(() => {
        const getMessages = async () => {
            try {
                const id = currentChat?._id;
                console.log(currentChat)
                const res = await axios.get(`${server}/message/get-all-messages/${id}`);
                console.log(res.data)
                setMessages(res.data.messages);
            } catch (e) {
                console.log(e.message);
            }
        };
        getMessages()
    }, [currentChat]);

    console.log(messages)

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        if (!currentChat || !newMessage.trim()) return;

        const message = {
            sender: seller?._id,
            text: newMessage.trim(),
            conversationId: currentChat?._id,
        };

        const receiverId = currentChat?.members?.find(
            (member) => member !== seller?._id
        );

        socketId.emit("sendMessage", {
            senderId: seller?._id,
            receiverId,
            text: newMessage,
        });

        try {
            if (newMessage !== "") {
                await axios.post(`${server}/message/create-new-message`, message)
                    .then((res) => {
                        setMessages((prev) => [...prev, res.data.message]);
                        updateLastMessage(newMessage);
                        setNewMessage("");
                    }).catch((e) => {
                        console.log(e?.response?.data?.message)
                    })

            }

        } catch (e) {
            console.log(e.message);
        }
    };

    const updateLastMessage = async (messageText) => {
        try {
            const id = currentChat?._id;
            await axios.put(`${server}/conversation/update-last-message/${id}`, {
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
                            me={seller._id}
                            setUserData={setUserData}
                            online={onlineCheck(item)}
                            setActiveStatus={setActiveStatus}
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
                    userData={userData}
                    activeStatus={activeStatus}
                />
            )}
        </div>
    );
};


const MessageList = ({
    me,
    data,
    index,
    setOpen,
    setCurrentChat,
    setUserData,
    online,
    setActiveStatus
}) => {

    const [active, setActive] = useState(0);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`?${id}`);
        setOpen(true);
    };

    console.log(online);

    useEffect(() => {
        setActiveStatus(online)
        const userId = data?.members?.find((id) => id !== me);
        if (!userId) return;

        const getUser = async () => {
            try {
                const res = await axios.get(`${server}/user/user-info/${userId}`);
                setUser(res.data.user);
            } catch (e) {
                console.error(e.message);
            }
        };

        getUser();
    }, [me, data]);

    return (
        <div
            className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : 'bg-transparent'} hover:bg-[#00000005] cursor-pointer`}
            onClick={() => {
                setActive(index) ||
                    setCurrentChat(data) ||
                    handleClick(data._id) ||
                    setUserData(user)
            }}
        >
            <div className="relative w-[50px] h-[50px] flex-shrink-0">
                {/* FIX: Changed userData to user */}
                <img
                    src={`${backend_url}${user?.avatar}`}
                    className='w-full h-full rounded-full object-cover'
                    alt="User profile"
                />
                {
                    online ? (
                        <div className="w-[14px] h-[14px] bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white"></div>
                    ) : (
                        <div className="w-[14px] h-[14px] bg-[#c7b9b9] rounded-full absolute bottom-0 right-0 border-2 border-white"></div>
                    )
                }
            </div>
            <div className='pl-4 w-full'>
                {/* FIX: Changed userData to user */}
                <h1 className='text-[18px] font-medium'>{user?.name}</h1>
                <p className='text-[14px] text-[#000c] truncate max-w-[90%]'>
                    {data?.lastMessage ? "You: " + data.lastMessage : "Start a new conversation"}
                </p>
            </div>
        </div>
    );
};


const SellerInbox = ({
    setOpen,
    newMessage,
    setNewMessage,
    sendMessageHandler,
    messages,
    sellerId,
    userData,
    activeStatus
}) => {

    console.log(userData)

    return (
        <div className='w-full min-h-full flex flex-col justify-between'>
            {/* Message header */}
            <div className="w-full flex p-3 items-center justify-between bg-slate-200">
                <div className="flex items-center">
                    <img src={`${backend_url}${userData?.avatar}`} className='w-[50px] h-[50px] rounded-full mr-3' alt="" />
                    <div>
                        <h1 className='text-[18px] font-[600]'>{userData?.name}</h1>
                        <h1 className='text-[12px] text-green-600 font-medium'>{activeStatus ? "Active Now" : ""}</h1>
                    </div>
                </div>
                <AiOutlineArrowRight size={25} onClick={() => setOpen(false)} className='cursor-pointer' />
            </div>

            {/* Messages body - Dynamically mapping over database messages */}
            <div className="px-3 pt-2 h-[55vh] overflow-y-scroll flex flex-col gap-2">
                {messages && messages.map((item, index) => {
                    const isSender = item.sender === sellerId;
                    return (
                        <>
                            <div
                                key={item._id || index}
                                className={`flex w-full ${isSender ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {!isSender && (
                                    <img
                                        src={`${backend_url}${userData?.avatar}`}
                                        className="w-[35px] h-[35px] rounded-full mr-2 self-end"
                                        alt=""
                                    />
                                )}

                                <div className="flex flex-col">
                                    {/* Message */}
                                    <div
                                        className={`p-2.5 rounded-lg max-w-[100%] h-min text-[15px] ${isSender
                                                ? "bg-[#38c776] text-white rounded-br-none"
                                                : "bg-gray-200 text-black rounded-bl-none"
                                            }`}
                                    >
                                        <p>{item.text}</p>
                                    </div>

                                    {/* Time */}
                                    <p className={`text-[12px] text-[#000000d3] pt-1 ${isSender ? "text-right" : "text-left"}`}>
                                        {format(item.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </>
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
