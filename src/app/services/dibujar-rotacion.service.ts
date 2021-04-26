import { Injectable } from '@angular/core';
import { Capa, ParCoordenada } from '../model/capa.model';

@Injectable({
  providedIn: 'root'
})
export class DibujarRotacionService {
  constructor() { }

  /**
   * @name rotacionMouse
   * @param punto
   * @param capa
   * @returns diferencia del angulo de inclinacion : number
   */
  public rotacionMouse(punto: ParCoordenada, capa: Capa): number {
    let
      angulo: number = this.calcularGradoInclinacion(
        { x: punto.x, y: capa.puntoA.y }, punto, capa.puntoA
      ),
      diff: number = angulo - capa.angulo;
    return diff;
  }

  /**
   * @name calcularGradoInclinacion
   * @param punto_A punto que se forma tomando las coordenadas { puntoA.x, puntoB.y }
   * @param punto_B puntoB de la capa
   * @param punto_C centro/origen del trazo
   * @returns El grado de inclunacion en escala de grados
   */
  public calcularGradoInclinacion(punto_A: ParCoordenada, punto_B: ParCoordenada, punto_C: ParCoordenada): number {
    const
      //deacuerdo al teorema del coseno. Calculamos la dimensiones del triangulo
      a: number = Math.sqrt(Math.pow(punto_C.x - punto_B.x, 2) + Math.pow(punto_C.y - punto_B.y, 2)),
      b: number = Math.sqrt(Math.pow(punto_A.x - punto_C.x, 2) + Math.pow(punto_A.y - punto_C.y, 2)),
      c: number = Math.sqrt(Math.pow(punto_B.x - punto_A.x, 2) + Math.pow(punto_B.y - punto_A.y, 2)),
      //Con el teorema del coseno resolvemos para el angulo del punto__C (punto origen)
      anguloRad: number = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    let angulo: number = ~~(0.5 + (anguloRad * 180 / Math.PI));
    //casos particulares para calcular la inclinacion de acuerdo a la posicion del mouse
    if (punto_C.x > punto_B.x && punto_C.y < punto_B.y)
      angulo = 90 + (90 - angulo);
    else if (punto_C.x > punto_B.x && punto_C.y > punto_B.y)
      angulo += 180;
    else if (punto_C.x < punto_B.x && punto_C.y > punto_B.y)
      angulo = 270 + (90 - angulo);

    return angulo;
  }

  /**
   * 
   * @param centro 
   * @param puntoB 
   * @param angulo
   * @returns Parcoordenada
   */
  public rotacion(centro: ParCoordenada, puntoB: ParCoordenada, angulo: number): ParCoordenada {
    let rads = angulo * Math.PI / 180;
    return {
      x:
        ~~(.5 +
          ((puntoB.x - centro.x) * Math.cos(rads) -
            (puntoB.y - centro.y) * Math.sin(rads) +
            centro.x)),
      y:
        ~~(.5 +
          ((puntoB.x - centro.x) * Math.sin(rads) +
            (puntoB.y - centro.y) * Math.cos(rads) +
            centro.y)),
    };
  }
}
