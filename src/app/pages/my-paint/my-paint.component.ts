import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { buttonsNavbar } from 'src/app/model/buttonsNavbar.model';
import { DibujarLineaService } from 'src/app/services/dibujar-linea.service';

@Component({
  selector: 'app-my-paint',
  templateUrl: './my-paint.component.html',
})
export class MyPaintComponent implements OnInit {


  constructor(
    private servicioDibujar: DibujarLineaService,
  ) { }

  ngOnInit(): void {
  }

  get buttonActive(): buttonsNavbar {
    return this.servicioDibujar.buttonActive;
  }

  public width: number = 0;
  public height: number = 0;

}