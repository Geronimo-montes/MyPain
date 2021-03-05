import { Component, Input, OnInit } from '@angular/core';
import { Color, colores, interfaceButtonColor } from 'src/app/model/color.model';
import { DibujarService } from 'src/app/services/dibujar.service';

/**Valor minimo que se puede asignar al ancho del trazo */
const minAncho: number = 1;
/**Valor maximo que se puede asignar al ancho del trazo */
const maxAncho: number = 30;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {

  @Input() height: number;
  @Input() width: number;

  constructor(
    private servicioDibujar: DibujarService,
  ) { }

  ngOnInit(): void {
  }

  public setColorTrazo(color: Color) {
    this.servicioDibujar.colorTrazo = color;
  }

  public setAnchoTrazo(valor: string) {
    this.servicioDibujar.anchoTrazo = +valor;
  }

  get colorActivo(): Color {
    return this.servicioDibujar.colorTrazo;
  }

  get anchoTrazo(): number {
    return this.servicioDibujar.anchoTrazo;
  }

  get colores(): interfaceButtonColor[] {
    return colores;
  }

  get min(): number {
    return minAncho;
  }

  get max(): number {
    return maxAncho;
  }
}
