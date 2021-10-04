import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EmailVerification {
  constructor(
    public firestore: AngularFirestore,
    public firebaseAuth: AngularFireAuth
  ) {}

  async sendVerificationEmail() {
    (await this.firebaseAuth.currentUser)?.sendEmailVerification().then(() => {
      console.log('email sent');
    });
  }
}
