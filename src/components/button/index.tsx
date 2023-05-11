import './button.css'
export type ButtonProps = {
    color: 'green' | 'gray'
    label: string | number | null
    onClick: () => void
}
const Button = (props: ButtonProps) => {
    return (
        <button className={`button ${props.color}`}
            onClick={props.onClick}>
            {props.label}
        </button>
    )
}

export default Button