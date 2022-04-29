import { Injectable, NgZone } from '@angular/core';
import {
  AuthStateChange,
  FirebaseAuthentication,
  SignInResult,
} from '@capacitor-firebase/authentication';
import { Subject } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/compat';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userDetail = null;
  public uid: string = null;
  private user: firebase.User;
  private unexpectedError = this.languageService.getVal('unexpected-error');
  private readonly authStateSubj = new Subject<AuthStateChange>();
  constructor(
    private auth: AngularFireAuth,
    private readonly ngZone: NgZone,
    private languageService: LanguageService,
    private alertController: AlertController
  ) {
    FirebaseAuthentication.removeAllListeners().then(() => {
      FirebaseAuthentication.addListener('authStateChange', (change) => {
        this.ngZone.run(() => {
          console.log('authStateChange --- ', change);
          this.authStateSubj.next(change);
          this.uid = change?.user?.uid ? change?.user?.uid : null;
          if (this.uid) {
            this.userDetail = {
              ...change.user,
            };
            localStorage.setItem('uid', this.uid);
            localStorage.setItem('user', JSON.stringify(this.userDetail));
          }
        });
      });
    });

    this.auth.onAuthStateChanged((data) => {
      console.log('onAuthStateChanged', data);
      this.uid = data?.uid ? data?.uid : null;
      if (this.uid) {
        this.user = { ...data };
        this.userDetail = {
          ...data,
          photoUrl: null,
        };
        localStorage.setItem('uid', this.uid);
        localStorage.setItem('user', JSON.stringify(this.userDetail));
      }
    });
  }

  init() {
    const app = initializeApp(environment.firebaseConfig);
    if (Capacitor.isNativePlatform) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
    }

    FirebaseAuthentication.setLanguageCode({ languageCode: 'de' });
  }

  public async signinWithEmail(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public async signupWithEmail(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  public async signInWithFacebook(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithFacebook();
  }

  public async signInWithGoogle(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithGoogle();
  }

  public async signInWithTwitter(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithTwitter();
  }

  public async signOut(): Promise<void> {
    await this.auth.signOut();
    await FirebaseAuthentication.signOut();
    localStorage.clear();
  }

  async authError(error) {
    console.log('auth error', error);

    let message = '';
    const errorcode = error.code;

    switch (errorcode) {
      case 'auth/wrong-password':
        message = 'Invalid password.';
        break;
      case 'auth/user-not-found':
        message = 'User does not exist';
        break;
      case 'auth/email-already-in-use':
        message = 'User is already registered. Please login.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operation is not allowed';
        break;
      case 'auth/weak-password':
        message = 'Password is weak.';
        break;
      default:
        message = this.unexpectedError;
        break;
    }

    try {
      const alert = await this.alertController.create({
        header: 'Daily Deals',
        message,
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
    } catch (err) {
      console.log(err);
    }
  }
}
