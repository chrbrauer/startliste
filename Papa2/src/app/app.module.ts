import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';


import {AppComponent} from './app.component';
import {TabelleComponent} from './tabelle/tabelle.component';
import {ElementComponent} from './element/element.component';
import {DragulaModule} from 'ng2-dragula';


@NgModule({
  declarations: [
    AppComponent,
    TabelleComponent,
    ElementComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DragulaModule.forRoot()
  ],
  providers: [],
  bootstrap: [TabelleComponent]
})
export class AppModule {
}
