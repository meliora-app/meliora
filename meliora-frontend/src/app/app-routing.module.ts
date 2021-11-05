import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './category-page/category-page.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ExpandedPostCardComponent } from './expanded-post-card/expanded-post-card.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { MentalHealthComponent } from './mental-health/mental-health.component';
import { ProfileComponent } from './profile/profile.component';
import { QuotePageComponent } from './quote-page/quote-page.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';
import { TrendingComponent } from './trending/trending.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-pass', component: ForgotPasswordComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create-post', component: CreatePostComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'quote', component: QuotePageComponent },
  { path: 'mental-health', component: MentalHealthComponent },
  { path: 'expanded-post', component: ExpandedPostCardComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'category/:id', component: CategoryPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
