import { Injectable } from '@angular/core';
import { Color } from '../model/color.model';

enum signo {
  negativo = -1,
  positivo = 1,
}
/**
 * @name DibujarLineaService
 * @description Clase que contiene los metodos para trazar una linea recta con el algoritmo 
 * de bresebham
 */
@Injectable({
  providedIn: 'root',
})
export class DibujarLineaService {
  constructor() { }

  /**
   * @name identificarCuadrante
   * @description Dados dos pares de coordenadas identifica a que cuadrannte pertenece el 
   * trazo despues manda llamar a bresenhamLine_II
   * @param x1 Coordenada x del punto inicial
   * @param y1 Coordenada y del punto inicial
   * @param x2 Coordenada x del punto final
   * @param y2 Coordenada y del punto final
   * @param colorTrazo Color de la linea a trazar
   * @param anchoTrazo Grosor de la linea a trazar
   */
  public identificarCuadrante(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    colorTrazo: Color,
    anchoTrazo: number,
    cx: CanvasRenderingContext2D
  ) {
    cx.fillStyle = colorTrazo;
    var dx = Math.abs(x2 - x1),
      dy = Math.abs(y2 - y1),
      e = 2 * dy - dx; //Distancia entre la linea ideal que se desea trazar y el pixel que 
    //queda mas cerc,
    const _anchoTrazo = anchoTrazo / 2,
      pendiente = dx === 0 || dy === 0 ? 0 : (y2 - y1) / (x2 - x1);

    /* (0,0)
     *   Cuadrante |   Cuadrante
     *      2      |      1
     *   x--       |   x++
     *   y--       |   y--
     *_____________|______________
     *             |
     *   Cuadrante |   Cuadrante
     *      3      |      4
     *    x--      |   x++
     *    y++      |   y++
     */
    cx.beginPath();

    if (pendiente >= 0)
      if (x1 >= x2 && y1 >= y2)
        /**Cuadrante 2 */
        this.bresenhamLine_II(x1, y1, dx, dy, e, _anchoTrazo, signo.negativo, signo.negativo, cx);
      else
        /**Cuadrante 4 */
        this.bresenhamLine_II(x1, y1, dx, dy, e, _anchoTrazo, signo.positivo, signo.positivo, cx);
    else if (pendiente < 0)
      if (x1 >= x2 && y1 <= y2)
        /** Cuadrante 3 */
        this.bresenhamLine_II(x1, y1, dx, dy, e, _anchoTrazo, signo.negativo, signo.positivo, cx);
      else
        /** Cuadrante 1 */
        this.bresenhamLine_II(x1, y1, dx, dy, e, _anchoTrazo, signo.positivo, signo.negativo, cx);

    cx.fill();
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
   * @param ciclos cantidad de ciclos a realizar. La delta con mayor valor indica su valor
   * @param anchoTrazo
   */
  private bresenhamLine(
    x: number,
    y: number,
    dx: number,
    dy: number,
    e: number,
    _anchoTrazo,
    signoX: signo,
    signoY: signo,
    cx: CanvasRenderingContext2D
  ) {
    if (dx > dy)
      for (let i = 0; i < dx; i++) {
        //Paso #1 recorremos de 1 hasta dx = (x2 - x1)
        cx.arc(x, y, _anchoTrazo, 0, 360); //Dibujamos el punto en las cordenadas indicadas esto incluye en punto inicial y el punto final
        while (e >= 0) {
          y = y + signoY * 1; //aunmentamos los valores con respecto a y
          e = e - 2 * dx; //recalculamos e
        }
        x = x + signoX * 1;
        e = e + 2 * dy;
      }
    else
      for (let i = 0; i < dy; i++) {
        //Paso #1 recorremos de 1 hasta dx = (x2 - x1)
        cx.arc(x, y, _anchoTrazo, 0, 360); //Dibujamos el punto en las cordenadas indicadas esto incluye en punto inicial y el punto final
        while (e >= 0) {
          x = x + signoX * 1; //aunmentamos los valores con respecto a y
          e = e - 2 * dy; //recalculamos e
        }
        y = y + signoY * 1;
        e = e + 2 * dx;
      }
  }

  /**
   * @name bresenhamLine_II
   * @description Algoritmo de bresenham para el trazado de lieneas
   * @param x Representa la x en el par de coordenadas (x,y)
   * @param y Representa la y en el par de coordenadas (x,y)
   * @param signoa Indica si el valor de a aumenta o disminuye
   * @param signob Indica si el valor de b aumenta o disminuye
   * @param db Math.abs(y2 - y1)
   * @param da Math.abs(x2 - x1)
   * @param e Factor de desicion
   * @param ciclos cantidad de ciclos a realizar. La delta con mayor valor indica su valor
   * @param anchoTrazo
   */
  private bresenhamLine_II(
    x: number,
    y: number,
    dx: number,
    dy: number,
    e: number,
    _anchoTrazo,
    signoX: signo,
    signoY: signo,
    cx: CanvasRenderingContext2D
  ) {
    const dosD = dx > dy ? 2 * dy : 2 * dx,
      dosD_dosD = dx > dy ? 2 * (dy - dx) : 2 * (dx - dy);

    if (dx > dy) {
      for (let i = 0; i < dx; i++) {
        cx.arc(x, y, _anchoTrazo, 0, 360);
        x += 1 * signoX;
        if (e < 0) {
          e += dosD;
        } else {
          y += 1 * signoY;
          e += dosD_dosD;
        }
      }
    } else {
      for (let i = 0; i < dy; i++) {
        cx.arc(x, y, _anchoTrazo, 0, 360);
        y += 1 * signoY;

        if (e < 0) {
          e += dosD;
        } else {
          x += 1 * signoX;
          e += dosD_dosD;
        }
      }
    }
  }
}
