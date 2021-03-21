import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TipoTrazo } from "src/app/model/tipo-trazo.model";
import { CapasService } from 'src/app/services/capas.service';

@Component({
  selector: 'app-my-paint',
  templateUrl: './my-paint.component.html',
})
export class MyPaintComponent implements OnInit {
  constructor(private servicioCapa: CapasService) { }

  ngOnInit(): void { }

  get buttonActive(): TipoTrazo {
    return this.servicioCapa.buttonActive;
  }

  public width: number = 0;
  public height: number = 0;
}
