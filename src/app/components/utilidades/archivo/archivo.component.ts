import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoTrazo } from "src/app/model/tipo-trazo.model";

@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
})
export class ArchivoComponent implements OnInit {
  @Input() buttonActive: TipoTrazo;
  @Output() setButtonActive = new EventEmitter<TipoTrazo>();

  constructor() { }
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
}
