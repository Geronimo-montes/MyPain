import { Color } from "./color.model";

/**
 * @name asdfasdfsadf
 * @var flapiz = 0, linea = 1, chupador = 2, pincel = 3,
 */
export enum buttonsNavbar {
  lapiz = 0,
  linea = 1,
  extractor = 2,
  pincel = 3,
}

/** Pares de coordenadas de la forma (x,y) que representan las cordenadas iniciales y 
 * las coordenadas finales del trazo, ademas de indicar a que tipo de trazo pertenecen
 */
export interface CoordenadaTrazo {
  startX: number | string,
  startY: number | string,
  endX: number | string,
  endY: number | string,
  tipoTrazo: buttonsNavbar,
  colorTrazo: Color,
  anchoTrazo: number,
}
