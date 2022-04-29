import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.page.html',
  styleUrls: ['./login-form.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginFormPage implements OnInit {
  loginForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private commonUi: CommonUiService,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {}

  back() {
    this.navigationService.back(true);
  }

  resetPassword() {
    this.navigationService.navigateForward('reset-password');
  }

  register() {
    this.navigationService.navigateForward('register');
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        await this.commonUi.presentLoading();
        const user = await this.authService.signinWithEmail(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        await this.commonUi.dismissLoading();
        this.navigationService.navigateForward('dashboard', true);
      } catch (e) {
        this.authService.authError(e);
        this.commonUi.dismissLoading();
      }
    }
  }
}
