import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeartParametricParticlesComponent } from './shared/components/heart-parametric-particles/heart-parametric-particles.component';

@NgModule({
  declarations: [
    AppComponent,
    HeartParametricParticlesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    HeartParametricParticlesComponent
  ]
})
export class AppModule { }
