import { Component, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent {
  isLoading: boolean = false;

  username: string = '';
  password: string = '';

  constructor(private auth: AuthService,  private router: Router) {
  }

  onLogin() {
    this.isLoading = true;
   this.auth.userLogin({password: this.password, username: this.username}).subscribe(
    (result) => {
      this.router.navigateByUrl('notes');
    }
   )
  }

  navigate() {
    this.router.navigateByUrl('register');
    }
}