import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoTrazo } from 'src/app/model/tipo-trazo.model';

@Component({
  selector: 'app-figuras',
  templateUrl: './figuras.component.html',
  styles: [
  ]
})
export class FigurasComponent implements OnInit {

  @Input() buttonActive: TipoTrazo;
  @Output() setButtonActive = new EventEmitter<TipoTrazo>();

  constructor() { }

  ngOnInit(): void {
  }

  public _setButtonActive(valor: TipoTrazo) {
    this.setButtonActive.emit(valor);
  }
}
