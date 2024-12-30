import { User } from "./interface/user";

export class Group {
  id: string;
  name: string;
  members: User[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Group> = {}) {
      this.id = data.id || '';
      this.name = data.name || '';
      this.members = data.members || [];
      this.createdBy = data.createdBy || '';
      this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
      this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }
  
    addMember(userId: User): void {
      if (!this.members.includes(userId)) {
        this.members.push(userId);
      }
    }
  
    removeMember(userId: User): void {
      this.members = this.members.filter(id => id !== userId);
    }
  
    isMember(userId: User): boolean {
      return this.members.includes(userId);
    }
  }
  