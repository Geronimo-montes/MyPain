import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { buttonsNavbar } from 'src/app/model/buttonsNavbar.model';

@Component({
  selector: 'app-herramientas',
  templateUrl: './herramientas.component.html',
  styles: [
  ]
})
export class HerramientasComponent implements OnInit {

  @Input() buttonActive: buttonsNavbar;
  @Output() setButtonActive = new EventEmitter<buttonsNavbar>();

  constructor() { }
  ngOnInit(): void { }

  /**
   * @name _setButtonActive
   * @param valor Boton que lanzo la accion
   * @description Funcion que permite emitir un valor al componente padre (navbar)
   * con el valor del boton que lanzo la accion
   */
  public _setButtonActive(valor: buttonsNavbar) {
    this.setButtonActive.emit(valor);
  }
}
