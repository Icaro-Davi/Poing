import mongoose from 'mongoose';
import { IWelcomeMemberModuleSettings, WelcomeMemberModule } from '../memberWelcomeModule/WelcomeModule.schema';

export interface IMemberLeaveModule extends IWelcomeMemberModuleSettings {}

const MemberLeaveModuleSchema = new mongoose.Schema<IMemberLeaveModule>(WelcomeMemberModule as mongoose.SchemaDefinition<IMemberLeaveModule>);

export default mongoose.model<IMemberLeaveModule>('MemberLeaveModule', MemberLeaveModuleSchema);