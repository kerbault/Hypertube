import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgModule} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {KonamiModule} from 'ngx-konami';

import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {AppComponent} from './app.component';
import {FilmComponent} from './film/film.component';
import {AppRouting} from './app.routing';

import {PageNotFoundComponent} from './page_not_found/page_not_found.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {JwtInterceptor} from './_services';
import {PageFilmComponent} from './page-film/page-film.component';
import {RegisterComponent} from './register/register.component';
import {SettingsComponent} from './settings/settings.component';
import {FormInfoComponent} from './form-info/form-info.component';
import {FormLogsComponent} from './form-logs/form-logs.component';
import {ChooseAvatarComponent} from './choose-avatar/choose-avatar.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CommentaireComponent} from './commentaire/commentaire.component';
import {ProfilComponent} from './profil-other/profil-other.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {ResetPasswordComponent} from './form-reset-password/form-reset-password.component';

import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';

//import {SingleMediaPlayer} from './single-media-player';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRouting,
        KonamiModule,
        MatCardModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        InfiniteScrollModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        FilmComponent,
        PageNotFoundComponent,
        HomeComponent,
        LoginComponent,
        PageFilmComponent,
        RegisterComponent,
        SettingsComponent,
        FormInfoComponent,
        FormLogsComponent,
        ChooseAvatarComponent,
        CommentaireComponent,
        ProfilComponent,
        ResetPasswordComponent
//    SingleMediaPlayer
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
    ],
    bootstrap: [
        AppComponent,
//    SingleMediaPlayer
    ]
})
export class AppModule {
}
