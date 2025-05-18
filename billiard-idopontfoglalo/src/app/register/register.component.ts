import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule, 
    ReactiveFormsModule,  
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
    CommonModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: string | null = null;
  isLoading = false;
  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: any) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;
      
      const { name, email, password, phoneNumber } = this.registerForm.value;
      

      this.authService.register(email!, password!, name!)
        .then((userCredential) => {
          const newUser: User = {
            id: userCredential.user.uid,
            name: name!,
            email: email!,
            phoneNumber: phoneNumber || '',
            createdAt: new Date()
          };
          
          this.userService.createUser(newUser).subscribe({
            next: () => {
              this.snackBar.open('Sikeres regisztráció!', 'Bezár', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/profile']);
            },
            error: (error) => {
              this.errorMessage = 'Sikeres bejelentkezés, de hiba történt a profil létrehozásakor';
              this.isLoading = false;
            }
          });
        })
        .catch(error => {
          this.errorMessage = this.getErrorMessage(error.code);
          this.isLoading = false;
        });
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ez az email cím már regisztrálva van';
      case 'auth/invalid-email':
        return 'Érvénytelen email cím';
      case 'auth/weak-password':
        return 'A jelszó túl gyenge (legalább 6 karakter)';
      default:
        return 'Ismeretlen hiba történt';
    }
  }
}
