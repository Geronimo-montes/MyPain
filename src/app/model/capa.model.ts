import { TipoTrazo } from "./tipo-trazo.model";
import { Color } from "./color.model";

/**
 * @name Capa 
 * @description Representa una capa del dibujo, contiene la infornacion para realizar el trazo de un objeto
 * selected: boolean puntos: paresCoordenadas[]
 */
export interface Capa {
  PuntoA: ParCoordenada,
  PuntoB: ParCoordenada,
  tipoTrazo: TipoTrazo,
  colorTrazo: Color,
  anchoTrazo: number,
  puntos: ParCoordenada[],
  selected: boolean,
  index: number
}

/**
 * @name ParCoordenada
 * @description Representa un par de coordenadas x, y
 */
export interface ParCoordenada {
  x: number,
  y: number
}