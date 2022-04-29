import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterPage implements OnInit {
  register: FormGroup;
  showDots = false;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private commonUi: CommonUiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.register = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phoneno: [
        '',
        [Validators.required, Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)],
      ],
    });
  }

  async signup() {
    if (this.register.valid) {
      try {
        await this.commonUi.presentLoading();
        const user = await this.authService.signupWithEmail(
          this.register.value.email,
          this.register.value.password
        );
        const userDetail = {
          uid: user.user?.uid,
          email: user.user?.email,
          providerId: user.credential?.providerId,
          displayName: user.user?.displayName,
          emailVerified: user.user?.emailVerified,
          isAnonymous: user.user?.isAnonymous,
          phoneNumber: user.user?.phoneNumber,
          tenantId: user.user?.tenantId,
          photoUrl: user.user.photoURL,
          name: this.register.value.name,
          phone: this.register.value.phoneno,
        };
        // await this.firebaseStorage.storeUserDetails(userDetail);
        await this.commonUi.dismissLoading();
        this.navigationService.navigateForward('dashboard', true);
      } catch (e) {
        this.authService.authError(e);
        this.commonUi.dismissLoading();
      }
    }
  }

  back() {
    this.navigationService.back(true);
  }

  login() {
    this.navigationService.navigateForward('/login-form');
  }
}
