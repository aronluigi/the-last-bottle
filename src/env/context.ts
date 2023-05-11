import React, { createContext } from "react";
import { GameActions, GameState } from "./types";
import { reset } from ".";


export const GameContext: React.Context<GameState> = createContext(reset())
export const GameDispatchContext: React.Context<React.Dispatch<GameActions>> = createContext({} as React.Dispatch<GameActions>)

