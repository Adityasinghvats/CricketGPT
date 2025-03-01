const PromptSuggestionButton = ({onClick, text}) => {
    return(
        <button
        className="p-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition-colors"
        onClick={onClick}
        >
            {text}
        </button>
    )
}

export default PromptSuggestionButton;