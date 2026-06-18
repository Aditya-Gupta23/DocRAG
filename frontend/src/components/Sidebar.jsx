import { useEffect } from "react";
import axiosInstance from "../api/axios";
import useChatStore from "../store/chatStore";

const Sidebar = () => {

    const chats = useChatStore((state) => state.chats);
    const setChats=useChatStore((state)=>state.setChats);
    const addChat=useChatStore((state)=>state.addChat);
    const setSelectedChat=useChatStore((state)=>state.setSelectedChat)

    const handleNewChat=async()=>{
        try {
            const response=await axiosInstance.post("/chats/")
            addChat(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const fetchChats=async()=>{
            try {
                const response=await axiosInstance.get("/chats/")
                setChats(response.data);
                if(response.data.length > 0){
                setSelectedChat(response.data[0]);
            }
            } catch (error) {
                console.error(error);
            }
        }
        fetchChats();
    },[])

  return (

    <div
      className="
      hidden
      md:flex
      w-72
      bg-[#ede0d4]
      border-r
      border-[#d6c0b3]
      flex-col
      p-4
      "
    >

      {/* Logo */}

      <h1
        className="
        text-3xl
        font-bold
        text-[#7f5539]
        mb-8
        "
      >

        📚 DocRAG

      </h1>


      {/* New Chat Button */}

      <button

        className="
        w-full
        py-3
        rounded-xl
        bg-[#7f5539]
        text-white
        font-semibold
        hover:bg-[#6f4518]
        transition
        "
        onClick={handleNewChat}
      >

        + New Chat

      </button>


      {/* Recent Chats */}

    {
        chats.map((chat)=>(
            <div key={chat.id} onClick={()=>setSelectedChat(chat)} className="p-3 rounded-3xl hover:bg-[#e5d5c5] cursor-pointer">
                {chat.title}
            </div>
        ))   
    }



      {/* Logout */}

      <div className="mt-auto">

        <button

          className="
          w-full
          py-3
          rounded-xl
          border
          border-[#7f5539]
          text-[#7f5539]
          hover:bg-[#7f5539]
          hover:text-white
          transition
          "

        >

          Logout

        </button>

      </div>


    </div>

  )

}

export default Sidebar;