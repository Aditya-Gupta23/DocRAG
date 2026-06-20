import { useEffect } from "react";
import axiosInstance from "../api/axios";
import useChatStore from "../store/chatStore";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const addChat = useChatStore((state) => state.addChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat)
  const selectedChat = useChatStore((state) => state.selectedChat)
  const messages = useChatStore((state) => state.messages)
  const deleteChat = useChatStore((state) => state.deleteChat)

  const handleNewChat = async () => {
    if (selectedChat && messages.length == 0) {
      alert("you are already in a new chat")
      return
    }
    try {
      const response = await axiosInstance.post("/chats/")
      addChat(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteChat = async (chatId) => {
    try {
      await axiosInstance.delete(`/chats/${chatId}/`)
      deleteChat(chatId)
      if (selectedChat?.id === chatId) {
        setSelectedChat(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get("/chats/")
        setChats(response.data);
        if (response.data.length > 0) {
          setSelectedChat(response.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchChats();
  }, [])

  return (

    <div className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#ede0d4] border-r border-[#d6c0b3] flex flex-col p-4 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold text-[#7f5539]">
          📚 DocRAG
        </h1>

        <button
          className="md:hidden text-3xl text-[#7f5539]"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>

      </div>


      <button
        onClick={handleNewChat}
        className="w-full py-3 rounded-xl bg-[#7f5539] text-white font-semibold hover:bg-[#6f4518] transition"
      >
        + New Chat
      </button>


     <div className="mt-6 flex-1 overflow-y-auto space-y-2">

{

    chats.map((chat)=>(

        <div

            key={chat.id}

            className={`flex items-center justify-between p-3 rounded-2xl transition ${
                selectedChat?.id===chat.id
                ?
                "bg-[#d6c0b3] font-semibold text-[#6f4518]"
                :
                "hover:bg-[#e5d5c5]"
            }`}

        >

            <div

                className="flex-1 truncate cursor-pointer"

                onClick={()=>{

                    setSelectedChat(chat)

                    setSidebarOpen(false)

                }}

            >

                {chat.title}

            </div>

            <button

                onClick={(e)=>{

                    e.stopPropagation()

                    handleDeleteChat(chat.id)

                }}

                className="ml-3 hover:scale-110 transition"

            >

                🗑️

            </button>

        </div>

    ))

}

</div>



      <button

        className="w-full py-3 rounded-xl border border-[#7f5539] text-[#7f5539] hover:bg-[#7f5539] hover:text-white transition"

      >

        Logout

      </button>

    </div>

  )

}

export default Sidebar;