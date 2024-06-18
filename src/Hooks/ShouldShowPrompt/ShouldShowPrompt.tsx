import {useState} from "react";
import store from "../../Reducers";
import moment from "moment";
import {AppActions} from "../../Reducers/App";

const getInstallPromptLastSeenAt = (promptName: string): string => {
    if (!store.getState().app.prompts) {
        store.dispatch(AppActions.reset());
    }
    return store.getState().app.prompts[promptName];
};

const setInstallPromptSeenToday = (promptName: string): void => {
    const today = moment().toISOString();
    store.dispatch(AppActions.setPromptDate(promptName, today));
};

function getUserShouldBePromptedToInstall(
    promptName: string,
    daysToWaitBeforePromptingAgain: number
): boolean {
    const lastPrompt = moment(getInstallPromptLastSeenAt(promptName));
    const daysSinceLastPrompt = moment().diff(lastPrompt, "days");
    return (
        isNaN(daysSinceLastPrompt) ||
        daysSinceLastPrompt > daysToWaitBeforePromptingAgain
    );
}

const useShouldShowPrompt = (
    promptName: string,
    daysToWaitBeforePromptingAgain = 5
): [boolean, () => void] => {
    const [userShouldBePromptedToInstall, setUserShouldBePromptedToInstall] =
        useState(
            getUserShouldBePromptedToInstall(
                promptName,
                daysToWaitBeforePromptingAgain
            )
        );

    const handleUserSeeingInstallPrompt = () => {
        setUserShouldBePromptedToInstall(false);
        setInstallPromptSeenToday(promptName);
    };

    return [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt];
};
export default useShouldShowPrompt;
