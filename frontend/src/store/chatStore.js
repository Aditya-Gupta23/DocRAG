import {create} from "zustand"
const useChatStore=create((set)=>({
    chats:[],
    selectedChat:null,
    messages:[],

    setChats:(chats)=>{
        set({chats})
    },
    addChat:(chat)=>{
        set((state)=>({
            chats:[chat,...state.chats],
            selectedChat:chat
        }))
    },
    setSelectedChat:(chat)=>{
        set({selectedChat:chat})
    },
    setMessages:(messages)=>{
        set({messages})
    },
    addMessage:(message)=>{
        set((state)=>({
            messages:[...state.messages,message]
        }))
    }
}))

export default useChatStore