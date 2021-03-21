import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MyPaintComponent } from './pages/my-paint/my-paint.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HerramientasComponent } from './components/utilidades/herramientas/herramientas.component';
import { OpcionesComponent } from './components/utilidades/opciones/opciones.component';
import { FigurasComponent } from './components/utilidades/figuras/figuras.component';
import { LienzoComponent } from './components/lienzo/lienzo.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MyPaintComponent,
    NavbarComponent,
    FooterComponent,
    HerramientasComponent,
    OpcionesComponent,
    FigurasComponent,
    LienzoComponent,
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
