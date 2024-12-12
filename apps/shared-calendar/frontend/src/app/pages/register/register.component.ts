import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';


  isLoading: boolean = false;

  constructor(private auth: AuthService, private router: Router) {
  }

  onSignup() {
    this.isLoading = true;
    this.auth.userRegister({username: this.name, password: this.password, mail: this.email})
    .pipe()
    .subscribe(
      () => {
        this.router.navigateByUrl('login');
      }
    )
  }

  navigate() {
    this.router.navigateByUrl('login');
    }
}