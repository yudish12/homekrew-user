import { Middleware } from "redux";
import { RootState } from "../../types/";

const loggingMiddleware: Middleware<{}, RootState, any> =
    store => next => (action: any) => {
        // Log the action
        console.log("🚀 Action:", action.type, action.payload);

        // Get state before action
        const prevState = store.getState();

        // Dispatch the action
        const result = next(action);

        // Get state after action
        const nextState = store.getState();

        // Log state changes
        console.log(" State Change:", {
            action: action.type,
            prevState,
            nextState,
            changed: prevState !== nextState,
        });

        return result;
    };

export default loggingMiddleware;
