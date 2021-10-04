import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { EmailVerification } from './email-verification.service';
import { ToastService } from '../toast.service';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../userServices/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userInfo: any;

  constructor(
    public firestore: AngularFirestore,
    public firebaseAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public emailService: EmailVerification,
    public toastService: ToastService,
    public userService: UserService
  ) {}

  isEmail(email: string) {
    var formControl = new FormControl(email, Validators.email);
    return formControl.valid;
  }

  async signIn(email: string, password: string) {
    var isEmail = this.isEmail(email);
    var username = email;
    var userData;
    // var userEmail = email;

    if (isEmail) {
      this.userService.getUserInfo(email).then((userData) => {
        username = userData.username;
      });
      console.log(username);
    }

    await this.userService.userLogin(username);
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(async () => {
          this.router.navigate(['/quote']);
        });
      })
      .catch((err) => {
        console.log('err is ', err);
        this.toastService.showErrorMessage(err.message, 'Login error');
      });
  }

  async signUp(email: string, password: string) {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/login']);
          this.toastService.showSuccessMessage(
            'Sign up successful!',
            'Sign Up'
          );
          this.emailService.sendVerificationEmail();
        });
      })
      .catch((err) => {
        console.log(err);
        this.toastService.showErrorMessage(err.message, 'Sign up error');
      });
  }

  async logout() {
    console.log('current user before', this.firebaseAuth.currentUser);
    await this.firebaseAuth.signOut().then((result) => {
      this.ngZone.run(() => {
        this.router.navigate(['/landing-page']);
      });
    });
    console.log('current user after', this.firebaseAuth.currentUser);
  }

  async changePasswordEmail() {
    await this.firebaseAuth.sendPasswordResetEmail(
      (
        await this.firebaseAuth.currentUser
      ).email,
      null
    );
  }

  async confirmChangePassword(code: string, newPassword: string) {
    this.firebaseAuth
      .confirmPasswordReset(code, newPassword)
      .then((result) => {
        this.toastService.showSuccessMessage(
          'Your password was changed!',
          'Password Change'
        );
      })
      .catch((err) => {
        console.log(err);
        this.toastService.showErrorMessage(
          'There was an error changing your password!',
          'Password Change'
        );
      });
  }
}
