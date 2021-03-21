import { Component, OnInit } from '@angular/core';
import { TipoTrazo } from "src/app/model/tipo-trazo.model";
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

  ngOnInit(): void {
  }

  public setbuttonActive(valor: TipoTrazo) {
    this.servicioCapas.buttonActive = valor;
  }

  get buttonActive(): TipoTrazo {
    return this.servicioCapas.buttonActive;
  }
}
