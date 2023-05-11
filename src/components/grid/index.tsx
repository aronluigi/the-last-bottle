import React from 'react'
import { useContext } from "react"
import './grid.css'
import { GameContext } from '../../env/context'
import { Cell } from '../../env/types'

interface BoxProps {
    row: number,
    col: number,
    isArea?: boolean,
    isStart?: boolean,
    isPlayer?: boolean,
    isNPC?: boolean,
}

const isSameCellPos = (rowIndex: number, colIndex: number, cell: Cell): boolean => rowIndex === cell.row && colIndex === cell.col

const Box = ({ row, col, isArea = false, isStart = false, isPlayer = false, isNPC = false }: BoxProps) => {
    let bc = 'box'
    bc += isArea ? ' area' : ''
    bc += isStart ? ' start' : ''

    return (
        <div id={`${row}x${col}`} className={bc}>
            {isPlayer ? (<div className='player' />) : null}
            {isNPC ? (<div className='npc' />) : null}
        </div>
    )
}

const Grid = ({ cellSize = 30 }) => {
    const s = useContext(GameContext)

    const gridWidth = s.board[0].length
    const gridHeight = s.board.length

    const gridStyle = {
        gridTemplateColumns: `40px repeat(${gridWidth}, ${cellSize}px)`,
        gridTemplateRows: `40px repeat(${gridHeight}, ${cellSize}px)`
    }

    return (
        <div className='grid-wrapper' style={gridStyle}>
            <div className='top' style={{ gridColumnEnd: gridWidth + 2 }}>
                <div className='wrapper-inner' style={{ gridTemplateColumns: `40px repeat(${gridWidth}, ${cellSize}px)` }}>
                    <div className='box-inner' />
                    {s.board[0].map((_, i) => (<div className='box-inner' key={`c${i}`}>C{i + 1}</div>))}
                </div>
            </div>
            {s.board.map((row, rowIndex) => (<React.Fragment key={`r${rowIndex}`}>
                <div className='box-inner' key={`rd${rowIndex}`}>R{rowIndex + 1}</div>
                {row.map((_, colIndex) => {
                    let isPlayer = false
                    let isNPC = false
                    for (let i = 0; i < s.players.length; i++) {
                        const p = s.players[i]
                        if (p.npc) {
                            isNPC = isSameCellPos(rowIndex, colIndex, p.pos)
                        } else {
                            isPlayer = isSameCellPos(rowIndex, colIndex, p.pos)
                        }
                    }

                    return (<Box
                        row={rowIndex}
                        col={colIndex}
                        isArea={s.GPgp.areaSearchMap.includes(`${rowIndex}x${colIndex}`)}
                        isStart={isSameCellPos(rowIndex, colIndex, s.startPos)}
                        isPlayer={isPlayer}
                        isNPC={isNPC}
                        key={rowIndex + colIndex}
                    />)
                })}
            </React.Fragment>))}
        </div>)
}

export default Grid