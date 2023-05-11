export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'

export type Cell = {
    col: number
    row: number
}

export type Player = {
    name: string
    color: string
    npc: boolean
    pos: Cell
}

export type GPgp = {
    spawnPos: Cell,
    area: Cell[][],
    areaSearchMap: string[]
}

export type GameState = {
    board: null[][]
    GPgp: GPgp
    startPos: Cell
    diceDirection: {
        value: number,
        label: Direction
    } | null
    diceSteps: number | null
    winner: Player | null
    players: Player[]
    playerTurnIndex: number,
    stepsLeft: number
    done: boolean
}

export type GameActions =
    | { type: 'step' }
    | { type: 'roll' }
    | { type: 'new' }

