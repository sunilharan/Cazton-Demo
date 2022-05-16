import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('selectLanguage') selectLanguage: IonSelect;
  defaultLanguage = this.languageService.getDefaultLanguage();
  langaugeSelectOptions: any = {
    header: '',
    subHeader: '',
  };
  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.langaugeSelectOptions = {
      header: this.languageService.getVal('select-language'),
      subHeader: this.languageService.getVal('language'),
    };
  }
  async openSelectLangauge() {
    await this.selectLanguage.open();
  }
  changeLanguage(ev) {
    if (ev?.detail?.value) {
      this.languageService.setLanguage(this.defaultLanguage);
      setTimeout(() => {
        this.langaugeSelectOptions = {
          header: this.languageService.getVal('select-language'),
          subHeader: this.languageService.getVal('language'),
        };
      }, 200);
    }
  }
}
