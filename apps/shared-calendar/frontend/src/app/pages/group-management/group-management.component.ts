import { Component } from '@angular/core';
import { Group } from '../../models/group';
import { User } from '../../models/interface/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent {
  groups: Group[] = [];
  groupMembers: User[] = [];
  selectedGroupId: string | null = null;
  groupForm: FormGroup;
  memberForm: FormGroup;

  constructor(private fb: FormBuilder, private groupService: GroupService) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.memberForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  addGroup() {
    if (this.groupForm.valid) {
      this.groupService.createGroup(this.groupForm.value).subscribe(() => {
        this.loadGroups();
        this.groupForm.reset();
      });
    }
  }

  deleteGroup(groupId: string) {
    this.groupService.deleteGroup(groupId).subscribe(() => {
      this.loadGroups();
    });
  }

  toggleMemberForm(groupId: string) {
    this.selectedGroupId = this.selectedGroupId === groupId ? null : groupId;
    if (this.selectedGroupId) {
      this.loadGroupMembers(this.selectedGroupId);
    }
  }

  loadGroupMembers(groupId: string) {
    this.groupService.getGroupMembers(groupId).subscribe(members => {
      this.groupMembers = members;
    });
  }

  addMember() {
    if (this.memberForm.valid && this.selectedGroupId) {
      this.groupService.addMemberToGroup(this.selectedGroupId, this.memberForm.value.userId).subscribe(() => {
        this.loadGroupMembers(this.selectedGroupId!);
        this.memberForm.reset();
      });
    }
  }

  removeMember(memberId: string) {
    if (this.selectedGroupId) {
      this.groupService.removeMemberFromGroup(this.selectedGroupId, memberId).subscribe(() => {
        this.loadGroupMembers(this.selectedGroupId!);
      });
    }
  }
}
