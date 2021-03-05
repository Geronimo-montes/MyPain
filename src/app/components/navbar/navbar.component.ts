import { Component, OnInit, ViewChild } from '@angular/core';
import { buttonsNavbar } from 'src/app/model/buttonsNavbar.model';
import { DibujarService } from 'src/app/services/dibujar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {


  constructor(
    private servicioDibujar: DibujarService,
  ) { }

  ngOnInit(): void {
  }

  public setbuttonActive(valor: buttonsNavbar) {
    this.servicioDibujar.buttonActive = valor;
  }

  get buttonActive(): buttonsNavbar {
    return this.servicioDibujar.buttonActive;
  }
}
