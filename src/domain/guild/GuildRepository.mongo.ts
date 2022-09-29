import mongoose, { ClientSession } from 'mongoose';
import { Modify } from '../../utils/typescript.funcs';
import { IBotRolesSchema, IBotSchema } from '../bot/Bot.schema';
import GuildSchema, { IGuildSchema } from './Guild.schema';

type SelectGuildValues = Partial<{
    _id: 0 | 1,
    bot: Omit<Partial<Modify<IBotSchema, 0 | 1>>, 'roles'> & { roles?: Partial<Modify<IBotRolesSchema, 0 | 1>> }
}>;

type GuildOptionalValues = Partial<Omit<IGuildSchema, 'bot'>> & { bot?: Partial<IBotSchema> };

class GuildRepository {

    static async create(guild: IGuildSchema) {
        try {
            return await GuildSchema.create(guild) as IGuildSchema;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async findById(guildId: string) {
        try {
            return await GuildSchema.findById(guildId).lean();
        } catch (error) {
            console.error(error);
            throw new Error('[errorGuildFindById]');
        }
    }

    static async update(guildId: string, update: mongoose.UpdateQuery<GuildOptionalValues>) {
        try {
            await GuildSchema.findByIdAndUpdate(guildId, update);
        } catch (error) {
            console.error(error);
            throw new Error('[errorGuildUpdate]');
        }
    }

    static async findByIdAndOmitValues(guildId: string, select: SelectGuildValues) {
        try {
            return (await GuildSchema.findById(guildId).select(select))?.toJSON();
        } catch (error) {
            console.error(error);
            throw new Error('[errorGuildFindByIdAndOmitValues]');
        }
    }

    static async delete(guildId: string, session?: ClientSession) {
        try {
            await GuildSchema.findByIdAndDelete(guildId, session ? { session } : {});
        } catch (error) {
            throw new Error('[errorGuildDelete]');
        }
    }

}

export default GuildRepository;