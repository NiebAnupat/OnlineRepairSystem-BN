import { UserRole } from './UserRole';
export default interface User {
[x: string]: any;
    user_id: string;
    username: string;
    password: string;
    avatar: Buffer;
    user_role: UserRole;
    changeAt: Date;
}