import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Group } from '../models/group';
import { User } from '../models/interface/user';
import { GroupResponse } from '../models/interface/groupResponse';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.API_URL + 'groups';

  constructor(private http: HttpClient) { }

//   getGroups(): Observable<Group[]> {
//     return this.http.get<GroupResponse>(this.apiUrl).pipe(
//         map(response => {
//             if (response.error) {
//                 throw new Error(response.error);
//             }
//             return response.groups.map((groupData: GroupResponse) => 
//               return groupData.groups.map(new Group({
//                 id: groupData._id,
//                 name: groupData.name,
//                 members: groupData.members,
//                 createdBy: groupData.createdBy,
//                 createdAt: new Date(groupData.createdAt),
//                 updatedAt: new Date(groupData.updatedAt)
//             })));
//         })
//     );
// }

getGroups(): Observable<Group[]> {
  return this.http.get<GroupResponse>(this.apiUrl).pipe(
      map(response => {
          if (response.error) {
              throw new Error(response.error);
          }
          return response.groups.map(groupData => new Group({
              id: groupData._id,
              name: groupData.name,
              members: groupData.members,
              createdBy: groupData.createdBy,
              createdAt: new Date(groupData.createdAt),
              updatedAt: new Date(groupData.updatedAt)
          }));
      })
  );
}

createGroup(groupData: { name: string }): Observable<Group> {
  return this.http.post<Group>(this.apiUrl, groupData);
}

deleteGroup(groupId: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${groupId}`);
}

getGroupMembers(groupId: string): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/${groupId}/members`);
}

addMemberToGroup(groupId: string, email: string): Observable<Group> {
  return this.http.post<Group>(`${this.apiUrl}/${groupId}/members`, { email });
}

removeMemberFromGroup(groupId: string, userId: string): Observable<Group> {
  return this.http.delete<Group>(`${this.apiUrl}/${groupId}/members/${userId}`);
}

}
