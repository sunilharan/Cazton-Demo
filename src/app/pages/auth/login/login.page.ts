import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public platform: Platform,
    private navigationService: NavigationService,
    private authService: AuthService,
    private commonUiService: CommonUiService
  ) {}

  ngOnInit() {}

  goToDashboard() {
    this.navigationService.navigateForward('dashboard');
  }

  goToRegister() {
    this.navigationService.navigateForward('register');
  }

  goToLogin() {
    this.navigationService.navigateForward('login-form');
  }

  async googleLogin() {
    try {
      await this.commonUiService.presentLoading();
      await this.authService.signOut();
      const data = await this.authService.signInWithGoogle();
      await this.commonUiService.dismissLoading();
      this.navigationService.navigateForward('dashboard', true);
    } catch (error) {
      this.authService.authError(error);
      console.log(error);
      await this.commonUiService.dismissLoading();
    }
  }
}
