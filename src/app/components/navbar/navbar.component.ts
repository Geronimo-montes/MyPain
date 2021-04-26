import { Component, OnInit } from '@angular/core';
import { HerramientaCapa, TipoTrazo } from "src/app/model/tipo-trazo.model";
import { CapasService } from 'src/app/services/capas.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  constructor(
    private servicioCapas: CapasService,
  ) { }

  ngOnInit(): void { }

  public setTrazoActivo(valor: TipoTrazo) {
    this.servicioCapas.trazoActiva = valor;
  }

  public setHerramientaActiva(valor: HerramientaCapa) {
    this.servicioCapas.herramientaActiva = valor;
  }

  get trazoActivo(): TipoTrazo {
    return this.servicioCapas.trazoActiva;
  }

  get herramientaActiva(): HerramientaCapa {
    return this.servicioCapas.herramientaActiva;
  }
}
