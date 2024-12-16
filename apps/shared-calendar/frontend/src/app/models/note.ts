export class Note {
    constructor(
      public id: string = '',
      public title: string = '',
      public content: string = '',
      public createdAt: Date = new Date(),
      public updatedAt: Date = new Date()
    ) {}

    
  }