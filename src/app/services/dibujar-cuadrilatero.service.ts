import { Injectable } from '@angular/core';
import { ParCoordenada } from '../model/capa.model';
import { DibujarLineaService } from './dibujar-linea.service';

@Injectable({
  providedIn: 'root'
})
export class DibujarCuadrilateroService {

  constructor(
    private dibujarLinea: DibujarLineaService,
  ) { }

  /**
   * @name cuadrilatero
   * @param puntoA 
   * @param puntoB 
   * @param factorReduce 
   * @returns Array de puntos del tipo ParCoordenada
   * @description Dados los puntos a y b traza un cuadrilatero
   */
  public rectangulo(puntoA: ParCoordenada, puntoB: ParCoordenada, factorReduce: number): ParCoordenada[] {
    let
      puntos: ParCoordenada[] = [],
      punto_A, punto_B, punto_C, punto_D, margenB: number = 1, margenD: number = 1;

    /**Para evitar un ligero descuadre se asigna un pixel (+,-) dependiendo el cuadrante */
    if ((puntoA.x <= puntoB.x && puntoA.y <= puntoB.y))
      margenB *= -1;
    else if (puntoA.x >= puntoB.x && puntoA.y >= puntoB.y)
      margenD *= -1;
    else
      margenB = margenD = 0;

    punto_A = puntoA;
    punto_B = { x: puntoA.x + margenB, y: puntoB.y };
    punto_C = puntoB;
    punto_D = { x: puntoB.x + margenD, y: puntoA.y };
    return this.cuadrilateroCalcularPuntos(punto_A, punto_B, punto_C, punto_D, factorReduce);
  }

  public cuadrado(puntoA: ParCoordenada, puntoB: ParCoordenada, factorReduce: number): ParCoordenada[] {
    var
      punto_A: ParCoordenada = puntoA,
      punto_B: ParCoordenada = { x: 0, y: 0 },
      punto_C: ParCoordenada = { x: 0, y: 0 },
      punto_D: ParCoordenada = { x: 0, y: 0 },

      longitudX = ~~(.5 + Math.abs(puntoA.x - puntoB.x)),
      longitudY = ~~(.5 + Math.abs(puntoA.y - puntoB.y));

    if (longitudX <= longitudY) {
      punto_B = { x: puntoB.x, y: puntoA.y };
      if ((puntoA.x <= puntoB.x && puntoA.y <= puntoB.y) || (puntoA.x >= puntoB.x && puntoA.y <= puntoB.y))
        punto_C = { x: punto_B.x, y: punto_B.y + longitudX };
      else if ((puntoA.x >= puntoB.x && puntoA.y >= puntoB.y) || (puntoA.x <= puntoB.x && puntoA.y >= puntoB.y))
        punto_C = { x: punto_B.x, y: punto_B.y - longitudX };
      punto_D = { x: punto_A.x, y: punto_C.y };
    } else {
      punto_D = { x: puntoA.x, y: puntoB.y };
      if ((puntoA.x <= puntoB.x && puntoA.y <= puntoB.y) || (puntoA.x <= puntoB.x && puntoA.y >= puntoB.y))
        punto_C = { x: punto_D.x + longitudY, y: punto_D.y };
      else if ((puntoA.x >= puntoB.x && puntoA.y >= puntoB.y) || (puntoA.x >= puntoB.x && puntoA.y <= puntoB.y))
        punto_C = { x: punto_D.x - longitudY, y: punto_D.y };

      punto_B = { x: punto_C.x, y: punto_A.y };
    }
    return this.cuadrilateroCalcularPuntos(punto_A, punto_B, punto_C, punto_D, factorReduce);
  }

  private cuadrilateroCalcularPuntos(puntoA: ParCoordenada, puntoB: ParCoordenada, puntoC: ParCoordenada, puntoD: ParCoordenada, factorReduce: number): ParCoordenada[] {
    let puntos: ParCoordenada[] = [];
    this.dibujarLinea.bresenhamLine(puntoA, puntoB, factorReduce).forEach(punto => puntos.push(punto));
    this.dibujarLinea.bresenhamLine(puntoB, puntoC, factorReduce).forEach(punto => puntos.push(punto));
    this.dibujarLinea.bresenhamLine(puntoC, puntoD, factorReduce).forEach(punto => puntos.push(punto));
    this.dibujarLinea.bresenhamLine(puntoD, puntoA, factorReduce).forEach(punto => puntos.push(punto));
    return puntos;
  }
}