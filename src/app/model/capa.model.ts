import { TipoTrazo } from "./tipo-trazo.model";
import { Color } from "./color.model";

/**
 * @name Capa 
 * @description Representa una capa del dibujo, contiene la infornacion para realizar el trazo de un objeto
 * selected: boolean puntos: paresCoordenadas[]
 */
export interface Capa {
  index: number
  puntoA: ParCoordenada, //centro del trazo
  puntoB: ParCoordenada, //punto base para el trazo de la capa
  vertices?: ParCoordenada[], //vertices del trazo
  indexPuntoRisize?: number, //usado cuando se ridemensiona la capa
  numeroLados: number,
  tipoTrazo: TipoTrazo,
  colorTrazo: Color,
  colorRelleno: Color,
  anchoTrazo: number,
  angulo: number, //angulo de rotacion
  puntos?: ParCoordenada[], //coleccion de puntos que conforman el trazo
}

/**
 * @name ParCoordenada
 * @description Representa un par de coordenadas x, y
 */
export interface ParCoordenada {
  x: number,
  y: number
}

/**
 * @name eventoCanvas
 * @description Eventos que se presentan en el canvas de manera exclusiva
 */
export enum eventoCanvas {
  sinEvento = 0,
  isDrawin = 1,
  isResize = 2,
  isMove = 3,
  isRotate = 4,
}