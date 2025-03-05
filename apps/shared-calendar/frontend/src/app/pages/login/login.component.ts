import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.auth.userLogin({ email, password }).subscribe(
        (result) => {
          this.router.navigateByUrl('');
        },
        (error) => {
          console.error('Login error', error);
          this.isLoading = false;
        }
      );
    }
  }

  onClick(event: 'register' | 'login' | 'forgotpassword') {
    switch(event) {
      case 'register':
        this.router.navigateByUrl('register');
        break;
        case 'forgotpassword':
          this.router.navigateByUrl('forgotpassword');
          break;
      case 'login':
        this.onLogin();
        break;
    }
  }
}
