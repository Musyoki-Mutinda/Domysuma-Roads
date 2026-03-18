import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { ParallaxStorytellingComponent } from './components/parallax-storytelling/parallax-storytelling.component';
import { ParallaxHeroComponent } from './components/parallax-hero/parallax-hero.component';

// Shared / layout modules
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './views/layout/layout.module';
import { AboutModule } from './views/about/about.module'

// Auth
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,   // Only AppComponent is declared here
    HomeComponent,
    ParallaxStorytellingComponent,
    ParallaxHeroComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Routing
    AppRoutingModule,

    // Feature / shared
    SharedModule,
    LayoutModule,
    AboutModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
