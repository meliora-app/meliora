import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingNavbarComponent } from './landing-navbar/landing-navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeNavbarComponent } from './home-navbar/home-navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostCardComponent } from './post-card/post-card.component';
import { CategoryPillComponent } from './category-pill/category-pill.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

// Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

// Firebase services + enviorment module
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { SettingsComponent } from './settings/settings.component';
import { ToastrModule } from 'ngx-toastr';
import { QuotePageComponent } from './quote-page/quote-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NoPostsCardComponent } from './no-posts-card/no-posts-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LandingNavbarComponent,
    LoginComponent,
    SignupComponent,
    HomepageComponent,
    HomeNavbarComponent,
    ProfileComponent,
    CreatePostComponent,
    PostCardComponent,
    CategoryPillComponent,
    EditProfileComponent,
    SettingsComponent,
    QuotePageComponent,
    ForgotPasswordComponent,
    NoPostsCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
