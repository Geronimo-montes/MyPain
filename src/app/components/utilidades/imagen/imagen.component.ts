import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { eventoCanvas } from 'src/app/model/capa.model';
import { HerramientaCapa } from "src/app/model/tipo-trazo.model";
import { CapasService } from 'src/app/services/capas.service';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
})
export class ImagenComponent implements OnInit {

  @Input() herramientaActiva: HerramientaCapa;
  @Output() setButtonActive = new EventEmitter<HerramientaCapa>();

  constructor(
    private servicioCapas: CapasService,
  ) { }
  ngOnInit(): void { }

  public _setButtonActive(valor: HerramientaCapa) {
    this.setButtonActive.emit(valor);
  }

  public rotarTrazo(valor) {
    if (this.servicioCapas.isSelected && !(this.servicioCapas.eventoActual === eventoCanvas.isDrawin)) {

    }
  }

  get isSelected(): boolean {
    return this.servicioCapas.isSelected;
  }
}