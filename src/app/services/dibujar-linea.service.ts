import { Injectable } from '@angular/core';
import { ParCoordenada } from '../model/capa.model';

enum signo {
  negativo = -1,
  positivo = 1,
}
/**
 * @name DibujarLineaService
 * @description Clase que contiene los metodos para trazar una linea recta con el algoritmo de bresebham
 */
@Injectable({
  providedIn: 'root',
})
export class DibujarLineaService {
  constructor() { }

  /**
   * @name bresenhamLine
   * @param puntoA Coordenada inicial
   * @param puntoB Coordenada final
   * @param factorReduce Factor para la reducion de puntos a trazar
   * @returns Array de puntos correspondiente a la linea
   */
  public bresenhamLine(puntoA: ParCoordenada, puntoB: ParCoordenada, factorReduce: number): ParCoordenada[] {
    return this.identificarCuadrante(puntoA, puntoB)
      .filter((_punto, index) => {
        let factor = ((factorReduce - 2) <= 1) ? 2 : (factorReduce - 2);
        return index % factor === 0;
      });
  }

  /**
   * @name identificarCuadrante
   * @description Dados dos pares de coordenadas identifica a que cuadrannte pertenece el trazo despues manda llamar a bresenhamLine_II
   * @param capa contiene la informacion del trazo a realizar
   * @param cx Lienzo donde se realizaran los trazos
   * @returns Array de coordenadas
   */
  private identificarCuadrante(puntoA: ParCoordenada, puntoB: ParCoordenada): ParCoordenada[] {
    var
      dx = ~~(0.5 + Math.abs(puntoB.x - puntoA.x)),
      dy = ~~(0.5 + Math.abs(puntoB.y - puntoA.y)),
      x = puntoA.x,
      y = puntoA.y,
      e = ~~(2 * dy - dx); //Distancia entre la linea ideal que se desea trazar y el pixel que queda mas cerc,
    const
      e1 = ~~(dx > dy ? 2 * dy : 2 * dx),
      e2 = ~~(dx > dy ? 2 * (dy - dx) : 2 * (dx - dy)),
      m = dx === 0 || dy === 0 ? 0 : (puntoB.y - puntoA.y) / (puntoB.x - puntoA.x);

    if (m >= 0)
      if (puntoA.x >= puntoB.x && puntoA.y >= puntoB.y)
        /**Cuadrante 2 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.negativo, signo.negativo);
      else
        /**Cuadrante 4 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.positivo, signo.positivo);
    else if (m < 0)
      if (puntoA.x >= puntoB.x && puntoA.y <= puntoB.y)
        /** Cuadrante 3 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.negativo, signo.positivo);
      else
        /** Cuadrante 1 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.positivo, signo.negativo);
  }

  /**
   * @name calcularPuntosLinea
   * @description Algoritmo de bresenham para el trazado de lieneas
   * @param x Representa la x en el par de coordenadas (x,y)
   * @param y Representa la y en el par de coordenadas (x,y)
   * @param signoa Indica si el valor de a aumenta o disminuye
   * @param signob Indica si el valor de b aumenta o disminuye
   * @param db Math.abs(y2 - y1)
   * @param da Math.abs(x2 - x1)
   * @param e Factor de desicion
   * @param e1 dx > dy ? 2 * dy : 2 * dx,
   * @param e2 dx > dy ? 2 * (dy - dx) : 2 * (dx - dy),
   * @param ciclos cantidad de ciclos a realizar. La delta con mayor valor indica su valor
   * @returns Array de coordenadas coloreadas
   */
  private calcularPuntosLinea(x: number, y: number, dx: number, dy: number, e: number, e1: number,
    e2: number, signoX: signo, signoY: signo
  ): ParCoordenada[] {
    const puntos: ParCoordenada[] = [];
    if (dx > dy) {
      for (let i = 0; i < dx; i++) {
        puntos.push({ x: x, y: y });
        x += (1 * signoX);
        if (e < 0) {
          e += e1;
        } else {
          y += (1 * signoY);
          e += e2;
        }
      }
    } else {
      for (let i = 0; i < dy; i++) {
        puntos.push({ x: x, y: y });
        y += (1 * signoY);
        if (e < 0) {
          e += e1;
        } else {
          x += (1 * signoX);
          e += e2;
        }
      }
    }
    return puntos;
  }
}