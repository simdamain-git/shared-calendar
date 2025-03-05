export class Note {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public groupId: string | null,
    public visibility: 'private' | 'group',
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}