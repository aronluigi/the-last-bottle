import { useEffect } from "react"
import { Cell, Direction, GameActions, GameState, Player } from "./types"

export const GridWidth = 42 // columns
export const GridHeight = 24 // rows
export const CellSize = 30 // pixels
export const GPgpRadius = 1 // cell radius from spawn coordinates

const directions: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW']
const oppositeDirections: { [key in Direction]: Direction } = {
    'N': 'S',
    'NE': 'SW',
    'E': 'W',
    'SE': 'NW',
    'S': 'N',
    'SW': 'NE',
    'W': 'E',
    'NW': 'SE'
}

const getRandomIntInclusive = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max)
}

const createBoard = (w: number, h: number): null[][] => {
    return Array.from(new Array(h), () => Array.from({ length: w }))
}

const calculateCellPos = (centerIndex: number, currentIndex: number, maxIndex: number, radius: number): number => {
    const dis = currentIndex - radius

    let x: number = dis + centerIndex
    if (x < 0) {
        x = maxIndex + x
    }

    if (x > maxIndex - 1) {
        x = x - maxIndex
    }

    return x
}

const spawnGPgp = (radius: number, gw: number, gh: number): [Cell, Cell[][], string[]] => {
    const spawn: Cell = {
        col: getRandomInt(gw - 1),
        row: getRandomInt(gh - 1)
    }

    const edgeLen = radius * 2 + 1
    let area = Array.from(new Array(edgeLen), () => Array(edgeLen).fill(null))
    area = area.map((r, ri) => r.map((c, ci) => ({
        row: calculateCellPos(spawn.row, ri, gh, radius),
        col: calculateCellPos(spawn.col, ci, gw, radius)
    } as Cell)))

    const searchMap = area.reduce((ac, v) => ac.concat(v), []).map((v) => `${v.row}x${v.col}`)

    return [spawn, area, searchMap]
}

const getStartPos = (GPgpSearchMap: string[], gw: number, gh: number, retries = 10): Cell => {
    if (retries < 0) throw new Error("env.getStartPos max reties reached!")

    const c = getRandomInt(gw - 1)
    const r = getRandomInt(gh - 1)

    if (GPgpSearchMap.includes(`${r}x${c}`)) {
        return getStartPos(GPgpSearchMap, gw, gh, retries - 1)
    }

    return { col: c, row: r } as Cell
}

const getRandomDirection = (prevDirection: Direction | null): [number, Direction] => {
    const rand = getRandomInt(directions.length)
    const d = directions[rand]

    if (prevDirection !== null && (d === prevDirection || d === oppositeDirections[prevDirection])) {
        return getRandomDirection(prevDirection)
    }

    return [rand, d]
}

const getRollingPos = (x: number, max: number): number => {
    if (x > max) {
        return x - max - 1
    }

    if (x < 0) {
        return max + x + 1
    }

    return x
}


const move = (direction: Direction, steps: number, pos: Cell, gw: number, gh: number): Cell => {
    let r = 0
    let c = 0

    switch (direction) {
        case 'N':
            c = pos.col
            r = getRollingPos(pos.row - steps, gh)
            break
        case 'NE':
            c = getRollingPos(pos.col + steps, gw)
            r = getRollingPos(pos.row - steps, gh)
            break
        case 'E':
            c = getRollingPos(pos.col + steps, gw)
            r = pos.row
            break
        case 'SE':
            c = getRollingPos(pos.col + steps, gw)
            r = getRollingPos(pos.row + steps, gh)
            break
        case 'S':
            c = pos.col
            r = getRollingPos(pos.row + steps, gh)
            break
        case 'SW':
            c = getRollingPos(pos.col - steps, gw)
            r = getRollingPos(pos.row + steps, gh)
            break
        case 'W':
            c = getRollingPos(pos.col - steps, gw)
            r = pos.row
            break
        case 'NW':
            c = getRollingPos(pos.col - steps, gw)
            r = getRollingPos(pos.row - steps, gh)
            break
    }

    return { row: r, col: c } as Cell
}

const getWinner = (state: GameState): Player | null => {
    const playerPosMap = state.players.map((p) => `${p.pos.row}x${p.pos.col}`)

    // check player 2 player collision
    const playerColl = playerPosMap
        .map((v, i) => playerPosMap.map((vv, ii) => ii === i ? null : vv).includes(v))
        .map((v, i) => v ? i : null)
        .filter(v => v !== null && !state.players[v].npc)

    if (playerColl.length !== 0) {
        return { ...state.players[playerColl[0] as number] }
    }

    // check player to GPgp collision
    const pgpc = playerPosMap
        .map((v, i) => state.GPgp.areaSearchMap.includes(v) ? i : null)
        .filter(v => v !== null)

    if (pgpc.length !== 0) {
        return { ...state.players[pgpc[0] as number] }
    }

    return null
}

export const GameReducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case 'step': {
            if (state.done) return state

            const directionDiceLabel = state.diceDirection?.label
            const directionDiceValue = state.diceDirection?.value
            const stepsLeft = state.stepsLeft

            if (directionDiceLabel === undefined || directionDiceValue === undefined || stepsLeft === 0) {
                return state
            }

            const players = state.players
            const nsl = stepsLeft - 1
            players[state.playerTurnIndex].pos = move(directionDiceLabel, 1, players[state.playerTurnIndex].pos, state.board[0].length - 1, state.board.length - 1)

            const newState: GameState = {
                ...state,
                players: [...players],
                stepsLeft: nsl,
                playerTurnIndex: nsl === 0 ? (state.playerTurnIndex + 1) % state.players.length : state.playerTurnIndex,
            }

            newState.winner = getWinner(newState)
            newState.done = newState.winner !== null

            return newState
        }
        case 'roll': {
            if (state.done) return state

            const steps = getRandomIntInclusive(1, 6)
            const [directionDiceValue, directionDiceLabel] = getRandomDirection(state.diceDirection !== null ? state.diceDirection.label : null)

            return {
                ...state,
                diceSteps: steps,
                diceDirection: {
                    label: directionDiceLabel,
                    value: directionDiceValue
                },
                stepsLeft: steps,
            } as GameState
        }
        case 'new': {
            return reset()
        }
    }

    return state
}

export const reset = (): GameState => {
    const [GPgpPos, GPgpArea, GPgpSM] = spawnGPgp(GPgpRadius, GridWidth, GridHeight)
    const startPos = getStartPos(GPgpSM, GridWidth, GridHeight)
    const player: Player = {
        name: 'Henry',
        color: 'yellow',
        npc: false,
        pos: startPos
    }

    const npc: Player = {
        name: 'Doom bottle',
        color: 'black',
        npc: true,
        pos: startPos
    }

    const s: GameState = {
        board: createBoard(GridWidth, GridHeight),
        GPgp: {
            spawnPos: GPgpPos,
            area: GPgpArea,
            areaSearchMap: GPgpSM
        },
        startPos: startPos,
        players: [npc, player],
        playerTurnIndex: 0,
        diceDirection: null,
        diceSteps: null,
        winner: null,
        stepsLeft: 0,
        done: false
    }

    return s
}