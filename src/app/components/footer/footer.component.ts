import { Component, Input, OnInit } from '@angular/core';
import {
  Color,
  colores,
  interfaceButtonColor,
} from 'src/app/model/color.model';
import { CapasService } from 'src/app/services/capas.service';

/**Valor minimo que se puede asignar al ancho del trazo */
const minAncho: number = 2;
/**Valor maximo que se puede asignar al ancho del trazo */
const maxAncho: number = 6;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  @Input() height: number;
  @Input() width: number;

  constructor(private servicioCapas: CapasService) { }

  ngOnInit(): void { }

  get colorActivo(): Color {
    return this.servicioCapas.colorTrazo;
  }

  get colorRelleno(): Color {
    return this.servicioCapas.colorRelleno;
  }

  set colorActivo(color: Color) {
    this.servicioCapas.colorTrazo = color;
  }

  public setColorRelleno(valor: Color) {
    this.servicioCapas.colorRelleno = valor;
    return false;
  }

  get anchoTrazo(): number {
    return this.servicioCapas.anchoTrazo;
  }

  set anchoTrazo(valor: number) {
    this.servicioCapas.anchoTrazo = valor;
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
