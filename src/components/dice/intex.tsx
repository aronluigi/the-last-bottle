import './dice.css'

export type DiceProps = {
    label: string | number,
    value: number | null,
    valueLabel?: string
}

const Dice = (props: DiceProps) => {
    return (
        <div className='dice'>
            <div className="label">{props.label}</div>
            <div className="value">{props.value === null ? '-' : props.value}</div>
            {props.valueLabel !== undefined ? <div className="value-label">{props.valueLabel}</div> : null}
        </div>
    )
}

export default Dice