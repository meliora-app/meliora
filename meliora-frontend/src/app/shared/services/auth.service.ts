import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { EmailVerification } from './email-verification.service';

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
    public emailService: EmailVerification
  ) {}

  async signIn(email: string, password: string) {
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['homepage']);
        });
      });
  }

  async signUp(email: string, password: string) {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['login']);
          this.emailService.sendVerificationEmail();
        });
      });
  }
}
