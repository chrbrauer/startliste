import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";

export const routes: Routes = [{
  path: '/starterlisteV2', component: AppComponent,
  children: []
},  {
  path: '/starterlisteV2', redirectTo: '/starterlisteV2', pathMatch: 'full'
}];
