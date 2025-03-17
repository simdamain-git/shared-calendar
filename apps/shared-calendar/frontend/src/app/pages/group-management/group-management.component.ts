import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss'],
})
export class GroupManagementComponent implements OnInit {
  public groups: any[] = [];
  public groupMembers: any[] = [];
  public selectedGroupId: string | null = null;
  public memberForm: FormGroup;
  public groupForm: FormGroup;
  public errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private groupService: GroupService) {}

  ngOnInit() {
    this.memberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.groupForm = this.fb.group({
      name: ['', [Validators.required]],
    });
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(
      (groups) => {
        this.groups = groups;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  addGroup() {
    if (this.groupForm.invalid) {
      return;
    }
    this.groupService.createGroup({ name: this.groupForm.value.name}).subscribe(
      (response) => {
        this.groupForm.reset();
        this.loadGroups();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  deleteGroup(groupId: string) {
    this.groupService.deleteGroup(groupId).subscribe(
      (result) => {
        this.loadGroups();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  toggleMemberForm(groupId: string) {
    this.selectedGroupId = this.selectedGroupId === groupId ? null : groupId;
    if (this.selectedGroupId) {
      this.groupService.getGroupMembers(groupId).subscribe(
        (members) => {
          this.groupMembers = members;
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  addMember() {
    if (this.memberForm.invalid) {
      return;
    }
    this.groupService
      .addMemberToGroup(this.selectedGroupId, this.memberForm.value.email)
      .subscribe(
        (response) => {
          alert('Membre ajouté avec succès.');
          this.memberForm.reset();
          this.toggleMemberForm(this.selectedGroupId);
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  removeMember(memberId: string) {
    this.groupService
      .removeMemberFromGroup(this.selectedGroupId, memberId)
      .subscribe(
        (response) => {
          this.toggleMemberForm(this.selectedGroupId);
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  handleError(error: any) {
    let message = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    if (error.status === 404) {
      message = 'Ressource non trouvée.';
    } else if (error.status === 500) {
      message = 'Erreur interne du serveur.';
    }
    this.errorMessage = message;
  }
}
