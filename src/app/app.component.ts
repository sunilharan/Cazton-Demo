import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private langaugeService: LanguageService,
    private authService: AuthService
  ) {
    this.langaugeService.init();
    this.authService.init();
  }
}
