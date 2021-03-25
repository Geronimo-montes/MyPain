import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoTrazo } from "src/app/model/tipo-trazo.model";
import { CapasService } from 'src/app/services/capas.service';

@Component({
  selector: 'app-capa',
  templateUrl: './capa.component.html',
})
export class CapaComponent implements OnInit {
  @Input() buttonActive: TipoTrazo;
  @Output() setButtonActive = new EventEmitter<TipoTrazo>();

  constructor(
    private servicioCapas: CapasService,
  ) { }
  ngOnInit(): void { }

  /**
   * @name _setButtonActive
   * @param valor Boton que lanzo la accion
   * @description Funcion que permite emitir un valor al componente padre (navbar)
   * con el valor del boton que lanzo la accion
   */
  public _setButtonActive(valor: TipoTrazo) {
    this.setButtonActive.emit(valor);
  }

  public moverCapa(valor: TipoTrazo) {
    if (this.servicioCapas.isSelected && !this.servicioCapas.isDrawin) {
      this.servicioCapas.moverCapa(valor);
    }
  }

  get isSelected(): boolean {
    return this.servicioCapas.isSelected;
  }

}
