import { useContext } from "react"
import { GameContext, GameDispatchContext } from "../../env/context"
import './header.css'
import Dice from "../dice/intex"
import Button from "../button"

const Header = () => {
    const s = useContext(GameContext)
    const dispatch = useContext(GameDispatchContext)

    const btn = () => {
        if (s.winner !== null) {
            return <Button
                label={`${s.winner.name} won! Click to restart`}
                color="green"
                onClick={() => { dispatch({ type: 'new' }) }}
            />
        }

        return <Button
            label="roll dice"
            color="gray"
            onClick={() => { dispatch({ type: 'roll' }) }} />
    }

    return (
        <div className="header">
            <div className="title">The Last Bottle</div>
            <div className="wrapper">
                <Dice label="direction"
                    value={s.diceDirection !== null ? s.diceDirection?.value + 1 : null}
                    valueLabel={s.diceDirection !== null ? s.diceDirection.label : ''} />
                <Dice label="steps" value={s.diceSteps} />
                {btn()}
            </div>
        </div>
    )
}

export default Header