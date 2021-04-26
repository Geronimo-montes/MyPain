import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { eventoCanvas } from 'src/app/model/capa.model';
import { HerramientaCapa, TipoTrazo } from "src/app/model/tipo-trazo.model";
import { CapasService } from 'src/app/services/capas.service';

@Component({
  selector: 'app-capa',
  templateUrl: './capa.component.html',
})
export class CapaComponent implements OnInit {
  @Input() herramientaActiva: HerramientaCapa;

  constructor(
    private servicioCapas: CapasService,
  ) { }
  ngOnInit(): void { }

  public moverCapa(valor: HerramientaCapa) {
    if (this.servicioCapas.isSelected && !(this.servicioCapas.eventoActual === eventoCanvas.isDrawin)) {
      this.servicioCapas.moverCapa(valor);
    }
  }

  get isSelected(): boolean {
    return this.servicioCapas.isSelected;
  }

}
