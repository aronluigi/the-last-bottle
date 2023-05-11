import { useContext } from 'react'
import { GameContext } from '../../env/context'
import './footer.css'

const Footer = () => {
    const s = useContext(GameContext)

    return (
        <div className='footer'>
            <div className='legend'>
                <ul>
                    {s.players.map((v, i) => {
                        return (
                            <li key={`pl-${i}`} className={i === s.playerTurnIndex ? 'active' : ''}>
                                <span style={{ color: v.color }}>&#9632;</span>
                                {v.name}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Footer