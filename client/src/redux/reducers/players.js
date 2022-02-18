import {
    UPDATE_PLAYERS,
    CLEAR_PLAYERS
} from '../types'

const INITIAL_STATE = {
    players: [],
};

const updatePlayers = (player, players) => {
    let P_index = players.findIndex(p => p.id === player.id)
    if (P_index === -1 ) players.push(player);
    else{
        players[P_index] = player;
    }
    return players;
}
 
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_PLAYERS:
            return{
                players: updatePlayers(action.payload, state.players)
            }
        case CLEAR_PLAYERS:
            return INITIAL_STATE;
        default:
            return state
    }
}