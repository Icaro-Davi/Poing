/**
 * Open this reference to knows where use vars.
 *
 * @vars { number1 number2 }
 * @bot { name prefix hexColor \@mention }
 */

export type BaseBanCommand = {
    description: string;
    error: {
        50007: string;
        mustBeNumber: string;
        numberMustBeBetweenTwoValues: string; // [number1 number2]
    };
    interaction: {
        isNotBannable: string;
        banishedCanceled: string;
        banishedFromServer: string;
        bannedWithNoReason: string;
    };
    usage: {
        list: {
            description: string;
        };
        soft_ban: {
            description: string;
        }
        days: {
            description: string;// Bot
        };
        reason: {
            description: string; // Bot
        }
    }
}