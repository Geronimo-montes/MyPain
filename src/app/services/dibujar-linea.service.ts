import { Injectable } from '@angular/core';
import { Capa, ParCoordenada } from '../model/capa.model';
import { Color } from '../model/color.model';

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

  public bresenhamLine(capa: Capa, cx: CanvasRenderingContext2D): ParCoordenada[] {
    return this.identificarCuadrante(capa, cx);
  }

  /**
   * @name identificarCuadrante
   * @description Dados dos pares de coordenadas identifica a que cuadrannte pertenece el trazo despues manda llamar a bresenhamLine_II
   * @param capa contiene la informacion del trazo a realizar
   * @param cx Lienzo donde se realizaran los trazos
   * @returns Array de coordenadas
   */
  private identificarCuadrante(capa: Capa, cx: CanvasRenderingContext2D): ParCoordenada[] {
    var
      dx = ~~(Math.abs(capa.PuntoB.x - capa.PuntoA.x)),
      dy = ~~(Math.abs(capa.PuntoB.y - capa.PuntoA.y)),
      x = capa.PuntoA.x,
      y = capa.PuntoA.y,
      e = ~~(2 * dy - dx); //Distancia entre la linea ideal que se desea trazar y el pixel que queda mas cerc,
    const
      e1 = ~~(dx > dy ? 2 * dy : 2 * dx),
      e2 = ~~(dx > dy ? 2 * (dy - dx) : 2 * (dx - dy)),
      m = dx === 0 || dy === 0 ? 0 : (capa.PuntoB.y - capa.PuntoA.y) / (capa.PuntoB.x - capa.PuntoA.x);


    if (m >= 0)
      if (capa.PuntoA.x >= capa.PuntoB.x && capa.PuntoA.y >= capa.PuntoB.y)
        /**Cuadrante 2 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.negativo, signo.negativo, cx);
      else
        /**Cuadrante 4 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.positivo, signo.positivo, cx);
    else if (m < 0)
      if (capa.PuntoA.x >= capa.PuntoB.x && capa.PuntoA.y <= capa.PuntoB.y)
        /** Cuadrante 3 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.negativo, signo.positivo, cx);
      else
        /** Cuadrante 1 */
        return this.calcularPuntosLinea(x, y, dx, dy, e, e1, e2, signo.positivo, signo.negativo, cx);
  }

  /**
   * @name bresenhamLine
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
    e2: number, signoX: signo, signoY: signo, cx: CanvasRenderingContext2D
  ): ParCoordenada[] {
    const puntos: ParCoordenada[] = [];
    if (dx > dy) {
      for (let i = 0; i < dx; i++) {
        //Puseamos la coordenada
        puntos.push({ x: x, y: y });
        //Coloreamos el pixel
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
        //Puseamos la coordenada
        puntos.push({ x: x, y: y });
        //Coloreamos el pixel
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
