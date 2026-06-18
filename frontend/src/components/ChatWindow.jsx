import useChatStore from "../store/chatStore";
import { useEffect } from "react";
import axiosInstance from "../api/axios";

const ChatWindow=()=>{

    const selectedChat=useChatStore(
        (state)=>state.selectedChat
    );

    const messages=useChatStore(
        (state)=>state.messages
    );

    const setMessages=useChatStore(
        (state)=>state.setMessages
    );

    useEffect(()=>{
        if(!selectedChat) return;
        const fetchMessages=async()=>{
            try {
                const response=await axiosInstance.get(`/chats/${selectedChat.id}/messages/`);
                setMessages(response.data);

            } catch (error) {
                console.error(error);
            }
        }
        fetchMessages();
    },[selectedChat])

    return(

        <div className="flex-1 p-6">

            {

                selectedChat ?

                <>
                    <h1 className="text-2xl font-bold">
                        {selectedChat.title}
                    </h1>
                    <div className="mt-6 space-y-4">
                        {
                            messages.map((message,index)=>(
                                <div key={index}>
                                    <strong>{message.role}</strong>
                                    : {message.content}
                                </div>
                            ))
                        }
                    </div>
                </>
                :

                <h1>

                    Select a chat

                </h1>

            }

        </div>

    )

}

export default ChatWindow