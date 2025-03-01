const LoadingBubble = () => {
    return(
        <div className="flex gap-2 p-4">
            <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300 animate-bounce [animation-delay:0.4s]"></div>
        </div>
    )
}

export default LoadingBubble;