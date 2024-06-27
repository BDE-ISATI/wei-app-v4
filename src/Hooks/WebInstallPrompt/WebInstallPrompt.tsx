import {useEffect, useState} from "react";
import {useShouldShowPrompt} from "../ShouldShowPrompt";

const webInstallPromptedAt = "webInstallPromptedAt";

const useWebInstallPrompt = (
    daysToWaitBeforePromptingAgain = 5
): [any, () => void, () => void] => {
    const [installPromptEvent, setInstallPromptEvent] = useState<any>();
    const [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt] =
        useShouldShowPrompt(webInstallPromptedAt, daysToWaitBeforePromptingAgain);

    useEffect(() => {
        const beforeInstallPromptHandler = (event: any) => {
            event.preventDefault();

            // check if user has already been asked
            if (userShouldBePromptedToInstall) {
                // store the event for later use
                setInstallPromptEvent(event);
            }
        };
        window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
        return () =>
            window.removeEventListener(
                "beforeinstallprompt",
                beforeInstallPromptHandler
            );
    }, [userShouldBePromptedToInstall]);

    const handleInstallDeclined = () => {
        handleUserSeeingInstallPrompt();
        setInstallPromptEvent(undefined);
    };

    const handleInstallAccepted = () => {
        // show native prompt
        installPromptEvent.prompt();

        // decide what to do after the user chooses
        installPromptEvent.userChoice.then((choice: any) => {
            // if the user declined, we don't want to show the prompt again
            if (choice.outcome !== "accepted") {
                handleUserSeeingInstallPrompt();
            }
            setInstallPromptEvent(undefined);
        });
    };
    return [installPromptEvent, handleInstallDeclined, handleInstallAccepted];
};
export default useWebInstallPrompt;
