import { Injectable } from '@angular/core';
import { Capa, ParCoordenada } from '../model/capa.model';
import { DibujarRotacionService } from './dibujar-rotacion.service';

@Injectable({
  providedIn: 'root'
})
export class DibujarCirculoElipseService {

  constructor(
    private rotar: DibujarRotacionService,
  ) { }

  /**
   * @name circulo
   * @param puntoA 
   * @param puntoB 
   * @param factorReduce 
   * @returns Array de puntos correspondientes a un circulo
   */
  public circulo(puntoA: ParCoordenada, puntoB: ParCoordenada, factorReduce: number): ParCoordenada[] {
    var
      puntos: ParCoordenada[] = [],
      centro = { x: puntoA.x, y: puntoA.y, },
      //calculo de la distancia entre dos puntos par el valor del radio
      radio = Math.sqrt(Math.pow(puntoB.x - puntoA.x, 2) + Math.pow(puntoB.y - puntoA.y, 2)),
      x = 0,
      y = Math.round(radio),
      p = 1 - radio;

    while (x <= y) {
      puntos = this.agregarOctantes(puntos, centro, x, y);
      x++;
      if (p <= 0) {
        p += 2 * x + 1;
      } else {
        y--;
        p += 2 * (x - y) + 1;
      }
    }
    return puntos;
  }

  /**
   * @name agregarOctantes
   * @param puntos 
   * @param centro 
   * @param x 
   * @param y 
   * @description Establece los ocho octantes con respecto a los valores
   * @returns Calculo de los ocho octantes en base a los datos proporcionados
   */
  private agregarOctantes(puntos: ParCoordenada[], centro: ParCoordenada, x: number, y: number): ParCoordenada[] {
    puntos.push({ x: centro.x + x, y: centro.y + y });
    puntos.push({ x: centro.x + x, y: centro.y - y });
    puntos.push({ x: centro.x - x, y: centro.y + y });
    puntos.push({ x: centro.x - x, y: centro.y - y });
    puntos.push({ x: centro.x + y, y: centro.y + x });
    puntos.push({ x: centro.x + y, y: centro.y - x });
    puntos.push({ x: centro.x - y, y: centro.y + x });
    puntos.push({ x: centro.x - y, y: centro.y - x });
    return puntos;
  }

  /**
 * @name elipse
 * @param capa
 * @returns 
 * @description Calcula los puntos correspondientes a una elipse
 */
  public elipse(capa: Capa): Capa {
    var
      ry = Math.abs(capa.puntoB.y - capa.puntoA.y),
      rx = Math.abs(capa.puntoB.x - capa.puntoA.x),
      puntos: ParCoordenada[] = [],
      vertices: ParCoordenada[] = [],
      x, y, p, px, py,
      rx2, ry2, tworx2, twory2;

    ry2 = ry * ry;
    rx2 = rx * rx;
    twory2 = 2 * ry2;
    tworx2 = 2 * rx2;
    /* región 1 */
    x = 0;
    y = ry;
    puntos = this.agregarPuntosElipse(puntos, capa.puntoA, x, y, capa.angulo);
    vertices = this.agregarPuntosElipse(vertices, capa.puntoA, x, y, capa.angulo);

    p = Math.round(ry2 - rx2 * ry + 0.25 * rx2);
    px = 0;
    py = tworx2 * y;

    while (px < py) { /* se cicla hasta trazar la región 1 */
      x = x + 1;
      px = px + twory2;
      if (p < 0)
        p = p + ry2 + px;
      else {
        y = y - 1;
        py = py - tworx2;
        p = p + ry2 + px - py;
      }
      puntos = this.agregarPuntosElipse(puntos, capa.puntoA, x, y, capa.angulo);
    }

    /* región 2 */
    p = Math.round(ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2);
    px = 0;
    py = tworx2 * y;

    while (y > 0) { /* se cicla hasta trazar la región 2 */
      y = y - 1;
      py = py - tworx2;
      if (p > 0)
        p = p + rx2 - py;
      else {
        x = x + 1;
        px = px + twory2;
        p = p + rx2 + py + px;
      }
      puntos = this.agregarPuntosElipse(puntos, capa.puntoA, x, y, capa.angulo);
    }
    vertices = this.agregarPuntosElipse(vertices, capa.puntoA, x, y, capa.angulo);
    capa.puntos = puntos;
    capa.vertices = vertices;
    return capa;
  }

  /**
   * @name agregarPuntosElipse
   * @param puntos 
   * @param centro 
   * @param x 
   * @param y 
   * @description Agrega cuatro puntos correspondientes a lado contrario del calculo
   * @returns Array con los puntos agregados
   */
  private agregarPuntosElipse(_puntos: ParCoordenada[], centro, x, y, angulo): ParCoordenada[] {
    let puntos: ParCoordenada[] = _puntos;
    let
      punto1: ParCoordenada = this.rotar.rotacion(centro, { x: centro.x + x, y: centro.y + y }, angulo),
      punto2: ParCoordenada = this.rotar.rotacion(centro, { x: centro.x - x, y: centro.y + y }, angulo),
      punto3: ParCoordenada = this.rotar.rotacion(centro, { x: centro.x + x, y: centro.y - y }, angulo),
      punto4: ParCoordenada = this.rotar.rotacion(centro, { x: centro.x - x, y: centro.y - y }, angulo);

    puntos.push(punto1);
    puntos.push(punto2);
    puntos.push(punto3);
    puntos.push(punto4);
    return puntos;
  }
}