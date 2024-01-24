import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule, HttpClient} from "@angular/common/http";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppComponent} from "./app.component";
import {ElementComponent} from "./element/element.component";

import {FormsModule} from "@angular/forms";
import {NgbAlertModule, NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule} from "@angular/router";
import {routes} from "./app.routes";
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
import {CreateStarterComponent} from "./create-starter/create-starter.component";



@NgModule({
  declarations: [
    AppComponent,
    ElementComponent,
    CreateStarterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgbDropdownModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    NgbAlertModule,
     BrowserAnimationsModule
  ],
  providers: [provideAnimations()],
  bootstrap:[AppComponent]

})
export class AppModule { }
