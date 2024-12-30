import { User } from "./user";

export interface GroupResponse {
    error: null | string;
    groups: {
        _id: string;
        name: string;
        members: User[];
        createdBy: string;
        createdAt: string;
        updatedAt: string;
    }[];
}