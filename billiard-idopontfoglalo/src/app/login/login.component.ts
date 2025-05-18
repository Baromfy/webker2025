import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    CommonModule, 
    RouterLink, 
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  error: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = false;
      
      const { email, password } = this.form.value;
      
      this.authService.login(email, password)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Sikeres bejelentkezés!', 'Bezár', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            this.isLoading = false;
            this.error = true;
          }
        });
    }
  }
}
