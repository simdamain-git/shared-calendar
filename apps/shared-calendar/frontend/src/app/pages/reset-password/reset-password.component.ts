import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public isLoading = false;
  private token: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || this.resetPasswordForm.value.password !== this.resetPasswordForm.value.confirmPassword) {
      return;
    }

    this.isLoading = true;
    this.auth.resetPassword(this.token, this.resetPasswordForm.value.password).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error => {
        this.isLoading = false;
        console.error('Erreur lors de la réinitialisation du mot de passe', error);
      }
    );
  }
}