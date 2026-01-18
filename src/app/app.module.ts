import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PartageModule} from './modules/partage/partage.module';
import {FormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {AddHeadersInterceptor} from './services/interceptors/add-headers.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, PartageModule, FormsModule, DragDropModule,
    QuillModule.forRoot({
      format: 'html',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{list: 'ordered'}, {list: 'bullet'}],
          [{indent: '-1'}, {indent: '+1'}],
          [{size: ['small', false, 'large', 'huge']}],
          [{align: []}],
          ['clean'],
          ['link']
        ]
      }
    }),],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AddHeadersInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  exports: [

  ]
})
export class AppModule {}
