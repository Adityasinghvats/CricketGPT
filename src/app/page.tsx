"use client"

import Image from "next/image";
import cb_logo from "./assets/cb_logo.svg";
import {useChat} from "ai/react";
import { Message } from "ai";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

export default function Home() {
  const {append, isLoading, messages, input , handleInputChange, handleSubmit} = useChat();
  const noMessages = !messages || messages.length === 0

  const handlePrompt = ( promptText ) => {
    const msg : Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    }
    append(msg)
  }

  return (
    <div className="flex justify-center items-center h[100vh] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image src={cb_logo} width="100" alt="cricket logo" className="pt-2"></Image>
        <section className={noMessages ? "" : ""}>
          {noMessages ? (
            <>
            <p className="pt-0 pb-0 pr-80 pl-80 text-2xl text-black">
              The ultimate place for Cricket super fans!
              Ask CricketGPT anyhthing about the fanstastic sport
              of cricket and it will come up with most up-to date answers.
              We hope you enjoy !
            </p>
            <br />
            
            </>
            ) : (
            <>
            {messages.map((message, index) => {
              <Bubble key={index} message={message}/>
            })}
            {isLoading && <LoadingBubble/>}
            </>
          )}
          
        </section>
        <PromptSuggestionsRow onPromptClick={handlePrompt}/>
        <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-4xl p-4">
            <div className="flex gap-2">
              <input 
          className="w-full p-3 font-medium border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-black" 
          onChange={handleInputChange} 
          value={input} 
          placeholder="Ask me something..."
              />
              <button 
          type="submit" 
          className="px-4 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
              >
          Send
              </button>
            </div>
          </form>
      </main>
    </div>
  );
}
