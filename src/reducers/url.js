import {appSettings} from "../custom/settings";

const urlReducer = (state = appSettings.domain_url, action) => {
    switch(action.type) {
        default:
            return state;
    }
}

export default urlReducer;
