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
    private static scheduledEvents: Map<string, ScheduleMuteEvent> = new Map<string, ScheduleMuteEvent>();
    private static loopTime = 1000 * 60 * 60 * 1; // 1 hour
    private static reconnect: {
        timeoutRef?: NodeJS.Timeout;
        time: number;
    } = { time: 1000 * 30 };

    static start() {
        this.scheduleUnmuteMembersEvents();
        this.startScheduleInterval();
        return !!this.mainEventLoop;
    }

    private static startScheduleInterval() {
        this.mainEventLoop = setInterval(() => {
            this.scheduleUnmuteMembersEvents();
        }, this.loopTime);
    }

    private static onErrorWaitToReconnect() {
        this.reconnect.timeoutRef = setTimeout(() => {
            if (mongoose.connection.readyState !== 1) {
                console.warn('ScheduleEvent try reconnect');
                this.onErrorWaitToReconnect();
            } else {
                this.reconnect.timeoutRef && clearTimeout(this.reconnect.timeoutRef);
                this.startScheduleInterval();
                console.warn('ScheduleEvent Reconnected');
            }
        }, this.reconnect.time);
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
        try {
            if (mongoose.connection.readyState === 1) {
                (await ScheduleUnmuteRepository.listByDate(moment(moment.utc().valueOf() + this.loopTime).toDate()))
                    .forEach(mute => {
                        moment(mute.timeout).valueOf() < moment.utc().valueOf()
                            ? MuteApplication.unmute(mute._id, mute.guildId, mute.memberId).catch(err => console.log(err))
                            : this.scheduleUnmute(mute._id, mute.guildId, mute.memberId, moment(mute.timeout).valueOf() - moment.utc().valueOf())
                    });
            } else {
                this.stop();
                this.onErrorWaitToReconnect();
            }
        } catch (error) {
            console.error('[src.config.schedule.ScheduleEvent.scheduleUnmuteMembersEvents] Failed to get members');
        }
    }
}

export default ScheduleEvent;