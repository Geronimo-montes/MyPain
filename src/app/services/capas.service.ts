import { Injectable } from '@angular/core';
import { Capa, ParCoordenada } from '../model/capa.model';
import { TipoTrazo } from "../model/tipo-trazo.model";
import { Color } from '../model/color.model';
import { DibujarLineaService } from './dibujar-linea.service';

@Injectable({
  providedIn: 'root',
})
export class CapasService {

  constructor(private dibujarLinea: DibujarLineaService) { }

  /**
   * @name render
   * @description Este metodo se encarga de realizar un renderizado al
   * inicio de la ejecucion, solo se disparara una vez dentro del metodo
   * ngAfterViewInit.
   * @param canvasEl Elmento canvas que funcionara como lienzo, solo debe
   * existir uno
   */
  public render(canvasEl: any) {
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.cx = canvasEl.getContext('2d');
  }

  /**
   * @name setNewPoint
   * @description Agrega un nuevo punto al arreglo de puntos
   * @param puntoA par de coordenadas de inicio del trazo 
   * @param puntoB par de coordenadas del fin del trazo
   */
  public setNewPoint(puntoA: ParCoordenada, puntoB: ParCoordenada) {
    this.capas.push(this.capaAtiva);
  }

  /**
   * @name drawCapas
   * @description Dado un array del tipo CoordenadaTrazo, realiza el trazo en el canvas
   */
  public drawCapas(puntoA: ParCoordenada, puntoB: ParCoordenada) {
    this.cx.fillStyle = 'white';
    this.cx.fillRect(0, 0, this.width, this.height);
    /**Recorre el arreglo de capas y las dibuja */
    this.capas.forEach(capa => this.trazarPunto(capa));

    if (this.isDrawin) {
      this.capaAtiva = {
        PuntoA: { x: ~~(.5 + puntoA.x), y: ~~(.5 + puntoA.y), },
        PuntoB: { x: ~~(.5 + puntoB.x), y: ~~(.5 + puntoB.y), },
        tipoTrazo: this.buttonActive,
        colorTrazo: this.colorTrazo,
        anchoTrazo: this.anchoTrazo,
        puntos: []
      };
      this.tipoTrazo(this.capaAtiva);
      this.trazarPunto(this.capaAtiva);
    } else {
      this.capaAtiva = null;
    }
  }

  /**
   * @name trazarPunto
   * @param capa Objeto capa que contiene los parametros del trazo
   * @description Recorre los pares de coordenadas y traza un punto por cada uno
   */
  private trazarPunto(capa: Capa) {
    const _anchoTrazo = capa.anchoTrazo / 2;
    this.cx.beginPath();
    this.cx.fillStyle = capa.colorTrazo;
    capa.puntos.forEach((punto: ParCoordenada) =>
      this.cx.arc(punto.x, punto.y, _anchoTrazo, 0, 360));
    this.cx.fill();

  }

  /**
   * @name tipoTrazo
   * @param capa 
   * @description llama la función correspondiente al boton activo y llena el arreglo de puntos
   */
  private tipoTrazo(capa: Capa) {
    switch (capa.tipoTrazo) {
      case TipoTrazo.linea:
        capa.puntos = this.dibujarLinea.bresenhamLine(capa, this.cx);
        break;
      case TipoTrazo.lapiz:

        break;
      case TipoTrazo.pincel:

        break;
      case TipoTrazo.extractor:

        break;
    }
  }

  /**Lienzo para dibujar*/
  private cx: CanvasRenderingContext2D;
  /** Dimensiones del cavas */
  private width = 1000;
  private height = 680;
  /** ¿Dibujando? */
  public isDrawin: boolean = false;
  /** Array de puntos dibujados */
  private capas: Capa[] = [];
  /** Capa que se esta trazado en el evento click del moue*/
  private capaAtiva: Capa;
  /** button active */
  public buttonActive: TipoTrazo = 1;
  /** Color del trazo */
  public colorTrazo: Color = Color.Black;
  /** Ancho trazo */
  public anchoTrazo: number = 5;
}
