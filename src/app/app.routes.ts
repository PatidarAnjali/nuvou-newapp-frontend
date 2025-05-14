// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
    { path: '', component: DashboardComponent},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { 
      path: 'dashboard', 
      component: UserDashboardComponent, 
      canActivate: [AuthGuard]
    },
    { 
      path: 'portfolio', 
      component: UserDashboardComponent,
      canActivate: [AuthGuard]
    },
    { 
      path: 'journal', 
      component: UserDashboardComponent,
      canActivate: [AuthGuard]
    },
    { 
      path: 'explore', 
      component: UserDashboardComponent,
      canActivate: [AuthGuard]
    },
    { 
      path: 'account', 
      component: UserDashboardComponent,
      canActivate: [AuthGuard]
    },
    // tha catch-all route should come last
    { path: '**', redirectTo: '' }  // redirect to home instead of login
];