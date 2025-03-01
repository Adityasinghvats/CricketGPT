import PromptSuggestionButton from "./PromptSuggestionButton";
const PromptSuggestionsRow = ({onPromptClick}) => {
    const prompts = [
        "Who is the highest earning player?",
        "Who is the captain of Indian National Team?",
        "Who won the first World Cup of Cricket?"
    ]
    return(
        <>
        <div className="flex flex-wrap gap-2 max-w-2xl">
            <div className="flex gap-2 w-full">
            {prompts.slice(0, 2).map((prompt, index) => 
                <PromptSuggestionButton 
                key={index} 
                text={prompt}
                onClick={() => onPromptClick(prompt)}
                />
            )}
            </div>
            <div className="flex gap-2 w-full">
            {prompts.slice(2).map((prompt, index) => 
                <PromptSuggestionButton 
                key={index + 2} 
                text={prompt}
                onClick={() => onPromptClick(prompt)}
                />
            )}
            </div>
        </div>
        </>
    )
}

export default PromptSuggestionsRow;