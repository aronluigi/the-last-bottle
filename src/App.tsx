import { useEffect, useReducer } from 'react'
import Grid from './components/grid'
import { CellSize, GameReducer, reset } from './env'
import { GameContext, GameDispatchContext } from './env/context'
import Header from './components/header'
import './App.css'
import Footer from './components/footer'

function App() {
    const [state, dispatch] = useReducer(GameReducer, reset())

    useEffect(() => {
        dispatch({ type: 'step' })
    }, [state.stepsLeft])

    useEffect(() => {
        const isNPC = state.players[state.playerTurnIndex].npc
        if (isNPC) {
            dispatch({ type: 'roll' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.playerTurnIndex])

    return (
        <GameContext.Provider value={state}>
            <GameDispatchContext.Provider value={dispatch}>
                <Header />
                <Grid cellSize={CellSize} />
                <Footer />
            </GameDispatchContext.Provider>
        </GameContext.Provider>
    )
}

export default App