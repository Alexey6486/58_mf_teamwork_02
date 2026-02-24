import { BTN_CLASS } from "../constants/style-groups";
import { type FC } from "react";

type ButtonProps = {
    onClick: () => void,
    type?: "button" | "submit" | "reset" | undefined,
    content: string,
}

export const Button: FC<ButtonProps> = ({ onClick, type = 'button', content }) => {
    return(
        <button 
            className={BTN_CLASS} 
            type={type} 
            onClick={onClick}>
                {content}
        </button>
    );
};