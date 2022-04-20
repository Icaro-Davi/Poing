import moment from "moment";
import { Mute } from "../application";

type ScheduleMuteEvent = {
    guildId: string;
    memberId: string;
    eventRef: NodeJS.Timeout,
}

class ScheduleEvent {
    private static muteEvents: ScheduleMuteEvent[] = [];
    private static mainEventLoop: NodeJS.Timer;
    private static loopTime = 1000 * 60 * 60;

    static start() {
        this.scheduleUnmuteMembersEvents();
        this.mainEventLoop = setInterval(() => {
            this.scheduleUnmuteMembersEvents();
        }, this.loopTime);
        return !!this.mainEventLoop;
    }

    static stop() {
        clearInterval(this.mainEventLoop);
    }

    static getLoopTimeMs() {
        return this.loopTime;
    }

    static unmuteCountdown(guildId: string, memberId: string, time: number) {
        const muteEvent = this.muteEvents.find(_event => _event.guildId === guildId && _event.memberId === memberId);
        muteEvent && this.removeMuteEvent(guildId, memberId);
        this.muteEvents.push({
            guildId, memberId,
            eventRef: setTimeout(() => {
                Mute.unmute(guildId, memberId).catch(error => console.log(error));
                this.removeMuteEvent(guildId, memberId);
            }, time)
        });
    }

    static removeMuteEvent(guildId: string, memberId: string) {
        const eventIndex = this.muteEvents.findIndex(event => event.guildId === guildId && event.memberId === memberId);
        if (eventIndex > -1) {
            clearTimeout(this.muteEvents[eventIndex].eventRef);
            this.muteEvents.splice(eventIndex, 1);
            return true;
        }
        return false;
    }

    private static scheduleUnmuteMembersEvents() {
        Mute.filterMutedMembersByTime(moment.utc().valueOf() + this.loopTime)
            .forEach(mute => {
                mute.mutedTime < moment.utc().valueOf()
                    ? this.removeMuteEvent(mute.guildId, mute.memberId) && Mute.unmute(mute.guildId, mute.memberId).catch(err => console.log(err))
                    : this.unmuteCountdown(mute.guildId, mute.memberId, mute.mutedTime - moment.utc().valueOf())
            });

    }
}

export default ScheduleEvent;