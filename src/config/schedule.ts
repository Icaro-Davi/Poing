import moment from "moment";
import mongoose from "mongoose";
import { MuteApplication } from "../application";
import ScheduleUnmuteRepository from "../domain/schedule/unmute/ScheduleUnmuteRepository";

type ScheduleMuteEvent = {
    _id: mongoose.Types.ObjectId;
    guildId: string;
    memberId: string;
    eventRef: NodeJS.Timeout;
}

class ScheduleEvent {
    private static unmuteEvents: ScheduleMuteEvent[] = [];
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

    static unmuteCountdown(_id: mongoose.Types.ObjectId, guildId: string, memberId: string, time: number) {
        const muteEvent = this.unmuteEvents.find(_event => _event._id === _id);
        muteEvent && this.removeMuteEvent(muteEvent._id);
        this.unmuteEvents.push({
            guildId, memberId, _id,
            eventRef: setTimeout(() => {
                MuteApplication.unmute(_id, guildId, memberId).catch(error => console.log(error));
                this.removeMuteEvent(_id);
            }, time)
        });
    }

    static removeMuteEvent(_id: mongoose.Types.ObjectId) {
        const eventIndex = this.unmuteEvents.findIndex(event => event._id);
        if (eventIndex > -1) {
            clearTimeout(this.unmuteEvents[eventIndex].eventRef);
            this.unmuteEvents.splice(eventIndex, 1);
            return true;
        }
        return false;
    }

    private static async scheduleUnmuteMembersEvents() {
        (await ScheduleUnmuteRepository.listByDate(moment(moment.utc().valueOf() + this.loopTime).toDate()))
            .forEach(mute => {         
                moment(mute.timeout).valueOf() < moment.utc().valueOf()
                    ? MuteApplication.unmute(mute._id, mute.guildId, mute.memberId).catch(err => console.log(err))
                    : this.unmuteCountdown(mute._id, mute.guildId, mute.memberId, moment(mute.timeout).valueOf() - moment.utc().valueOf())
            });
    }
}

export default ScheduleEvent;