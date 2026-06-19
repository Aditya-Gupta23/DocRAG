import useChatStore from "../store/chatStore";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axios";


const ChatWindow = () => {

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const fileInputRef = useRef(null)


    const selectedChat = useChatStore(
        (state) => state.selectedChat
    );

    const messages = useChatStore(
        (state) => state.messages
    );

    const setMessages = useChatStore(
        (state) => state.setMessages
    );

    const addMessage = useChatStore((state) => state.addMessage)

    const handleFileClick = () => {
        fileInputRef.current.click()
    }
    
    const uploadPdf=async (file)=>{
          if(!selectedChat){
            alert("Please create/select a chat first");
            return;
        }
        try {
            setUploading(true)
            const formData=new FormData();
            formData.append('file',file)
            const response=await axiosInstance.post(`/chats/${selectedChat.id}/upload/`,formData,
                {
                    headers:{
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            console.log(response.data)
        } catch (error) {
            console.error("PDF upload failed", error);
        }
        finally {
            setUploading(false);
        }
    }

    const handleFileChange =async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setSelectedFile(file)
        await uploadPdf(file);
    }

    useEffect(() => {
        if (!selectedChat) return;
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get(`/chats/${selectedChat.id}/messages/`);
                setMessages(response.data);

            } catch (error) {
                console.error(error);
            }
        }
        fetchMessages();
    }, [selectedChat])

    const handleSend = async () => {
        if (!input.trim() || !selectedChat) return;
        const question = input;
        addMessage({
            role: "user",
            content: question
        })
        setInput("");
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/chats/${selectedChat.id}/message/`, {
                message: question,
            })

            addMessage({
                role: "assistant",
                content: response.data.answer,
                sources: response.data.sources
            })
        } catch (error) {
            console.error("Error sending messages to the bot", error)
            addMessage({
                role: "assistant",
                content: "Something went wrong."
            });
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="flex flex-col h-screen bg-[#f5eee6]">

            {

                selectedChat ?

                    <>

                        <div className="p-6 border-b border-[#d6ccc2]">

                            <h1 className="text-2xl font-bold text-[#6f4518]">

                                {selectedChat.title}

                            </h1>

                        </div>



                        <div className="flex-1 overflow-y-auto p-6 space-y-4">

                            {

                                messages.map((message, index) => (

                                    <div key={index} className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.role === "user" ? "ml-auto bg-[#7f5539] text-white":"bg-[#ede0d4] text-[#3d2b1f]"}`}>
                                        <div>
                                            {message.content}
                                        </div>
                                        {
                                            message.role === "assistant"
                                            &&
                                            message.sources
                                            &&
                                            message.sources.length > 0
                                            &&
                                            <div className="mt-4 pt-3 border-t border-[#c9b8a8]">
                                                <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
                                                    Sources
                                                </p>
                                                {
                                                    message.sources.map((source, idx) => (
                                                        <div key={idx} className=" text-sm py-1">
                                                            📄
                                                            {" "}
                                                            {source.source}
                                                            {" "}
                                                            <span className="opacity-70">
                                                                (Page {source.page})
                                                            </span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                    </div>
                                ))
                            }



                            {

                                loading &&
                                <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-[#ede0d4] text-[#3d2b1f]">
                                    Thinking...
                                </div>
                            }
                        </div>

                        <div className="p-4 border-t border-[#d6ccc2]">
                            {
                                selectedFile && (
                                    <div className="mb-3 inline-flex items-center gap-2 bg-[#ede0d4] text-[#6f4518] px-4 py-2 rounded-full text-sm font-medium">
                                       📄 {selectedFile.name}
                                        <span className="ml-2 text-xs">
                                            {
                                                uploading   ? "Uploading...":"✓ Uploaded"
                                            }
                                        </span>
                                    </div>
                                )
                            }
                            <div className="flex gap-3 items-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <button
                                    onClick={handleFileClick}
                                    className="px-4 py-3 rounded-xl bg-[#ede0d4] hover:bg-[#dbc7b8]"
                                >
                                    📎
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask something about your documents..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-[#d6ccc2] outline-none"
                                />

                                <button onClick={handleSend} disabled={loading} className="px-6 py-3 rounded-xl bg-[#7f5539] text-white"
                                >
                                    {
                                        loading
                                            ?
                                            "..."
                                            :
                                            "Send"
                                    }
                                </button>
                            </div>
                        </div>
                    </>
                    :
                    <div className="flex h-full items-center justify-center">
                        <h1 className="text-2xl text-[#7f5539]">
                            Select a chat
                        </h1>
                    </div>
            }
        </div>
    )

}

export default ChatWindow