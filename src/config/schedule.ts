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
    private static mainEventLoop: NodeJS.Timer;
    private static loopTime = 1000 * 60 * 60;
    private static scheduledEvents: Map<string, ScheduleMuteEvent> = new Map<string, ScheduleMuteEvent>();

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

    public static createReference(guildId: string, memberId: string) {
        return `${guildId}:${memberId}`;
    }

    public static getScheduledEvent(guildId: string, memberId: string) {
        return this.scheduledEvents.get(this.createReference(guildId, memberId));
    }

    static scheduleUnmute(_id: mongoose.Types.ObjectId, guildId: string, memberId: string, time: number) {
        let reference = this.createReference(guildId, memberId);
        this.removeScheduledEvent(reference);
        this.scheduledEvents.set(reference, {
            guildId, memberId, _id,
            eventRef: setTimeout(() => {
                MuteApplication.unmute(_id, guildId, memberId).catch(error => console.log(error));
                this.removeScheduledEvent(reference);
            }, time)
        });
    }

    static removeScheduledEvent(reference: string) {
        const scheduledMember = this.scheduledEvents.get(reference);
        if (scheduledMember) {
            clearTimeout(scheduledMember.eventRef);
            this.scheduledEvents.delete(reference);
        }
    }

    private static async scheduleUnmuteMembersEvents() {
        (await ScheduleUnmuteRepository.listByDate(moment(moment.utc().valueOf() + this.loopTime).toDate()))
            .forEach(mute => {
                moment(mute.timeout).valueOf() < moment.utc().valueOf()
                    ? MuteApplication.unmute(mute._id, mute.guildId, mute.memberId).catch(err => console.log(err))
                    : this.scheduleUnmute(mute._id, mute.guildId, mute.memberId, moment(mute.timeout).valueOf() - moment.utc().valueOf())
            });
    }
}

export default ScheduleEvent;