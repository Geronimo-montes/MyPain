import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MyPaintComponent } from './pages/my-paint/my-paint.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FigurasComponent } from './components/utilidades/figuras/figuras.component';
import { LienzoComponent } from './components/lienzo/lienzo.component';
import { FormsModule } from '@angular/forms';
import { ArchivoComponent } from './components/utilidades/archivo/archivo.component';
import { CapaComponent } from './components/utilidades/capa/capa.component';
import { ImagenComponent } from './components/utilidades/imagen/imagen.component';
import { SombraComponent } from './components/utilidades/sombra/sombra.component';

@NgModule({
  declarations: [
    AppComponent,
    MyPaintComponent,
    NavbarComponent,
    FooterComponent,
    FigurasComponent,
    LienzoComponent,
    ArchivoComponent,
    CapaComponent,
    ImagenComponent,
    SombraComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
