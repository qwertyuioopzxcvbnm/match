import { createStore } from 'redux';

async function saveData(state) {
    window.localStorage.setItem('state', JSON.stringify(state))
}

function appStateReducer(state, action) {
    const newState = {...state};
    switch (action.type) {
        case 'add-user-info':
            newState.userInfo = {
                ...newState.userInfo,
                ...action.value
            };
            break;
        case 'add-answer':
            newState.questionResponses[action.id] = action.value
            break;
        case 'set-progress':
            newState.progressBar = action.value;
            break;
        case 'set-questions':
            newState.questions = action.value;
            break;
        default:
            return state;
    }
    saveData(newState)
    return newState;
}

const defaultDoc = {
    progressBar: 0,
    userInfo: {},
    questionResponses: {},
    questions: [],
    fuse: 2023
}

if (window.localStorage.getItem('state') === null) {
    window.localStorage.setItem('state', JSON.stringify(defaultDoc))
} else {
    const state = JSON.parse(window.localStorage.getItem('state'));
    if (state.fuse !== 2023) {
        window.localStorage.setItem('state', JSON.stringify(defaultDoc))
        window.localStorage.setItem('finished', 'false')
    }
}

export default createStore(appStateReducer, JSON.parse(window.localStorage.getItem('state')));