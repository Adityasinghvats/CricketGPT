const styles = {
    user: "flex justify-end",
    assistant: "flex justify-start",
    bubble: "max-w-[70%] rounded-lg bg-gray-100 shadow-sm"
};

const Bubble = ({message}) => {
        const {content, role} = message
        return(
                <div className={`${styles[role]}`}>
                        <div className={`m-8 p-8 font-light ${styles.bubble}`}>
                                {content}
                        </div>
                </div>
        )
}
export default Bubble;