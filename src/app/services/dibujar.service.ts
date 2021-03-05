import { Injectable } from '@angular/core';
import { buttonsNavbar, CoordenadaTrazo } from '../model/buttonsNavbar.model';
import { Color } from '../model/color.model';

@Injectable({
  providedIn: 'root'
})
export class DibujarService {

  constructor() { }

  /** 
   * @name render
   * @description Este metodo se encarga de realizar un renderizado al
   * inicio de la ejecucion, solo se disparara una vez dentro del metodo
   * ngAfterViewInit.
   * @param canvasEl Elmento canvas que funcionara como lienzo, solo debe
   * existir uno 
   */
  public render(canvasEl: any): any {
    this.cx = canvasEl.getContext('2d');
    canvasEl.width = this.width;
    canvasEl.height = this.height;
  }

  /** 
   * @name drawLine
   * @description desconocida
   */
  public drawLine(x: number, y: number, fx: number, fy: number) {
    this.cx.fillStyle = "white";
    this.cx.fillRect(0, 0, this.width, this.height);

    for (var i = 0; i < this._points.length; ++i) {
      this.pintar(
        this._points[i].startX, this._points[i].startY,
        this._points[i].endX, this._points[i].endY,
        this._points[i].colorTrazo,
        this._points[i].anchoTrazo,
      );
    }

    if (this.isDrawin) {
      this.pintar(x, y, fx, fy, this.colorTrazo, this.anchoTrazo);
    }
  }

  /**
   * @name pintar
   * @description Dados dos pares de coordenadas realiza un trazada de una 
   * linea recta dentro del canvas
   * @param x1 Coordenada x del punto inicial 
   * @param y1 Coordenada y del punto inicial
   * @param x2 Coordenada x del punto final
   * @param y2 Coordenada y del punto final
   */
  private pintar(x1, y1, x2, y2, colorTrazo, anchoTrazo) {
    this.cx.fillStyle = colorTrazo;

    var _x1 = Math.round(x1);
    var _y1 = Math.round(y1);
    var _x2 = Math.round(x2);
    var _y2 = Math.round(y2);

    const dx = Math.abs(_x2 - _x1);
    const sx = _x1 < _x2 ? 1 : -1;
    const dy = Math.abs(_y2 - _y1);
    const sy = _y1 < _y2 ? 1 : -1;

    var error, len, rev, count = dx;

    this.cx.beginPath();

    if (dx > dy) {
      error = dx / 2;
      rev = _x1 > _x2 ? 1 : 0;
      if (dy > 1) {
        error = 0;
        count = dy - 1;
        do {
          len = error / dy + 2 | 0;
          this.cx.rect(_x1 - len * rev, _y1, len, anchoTrazo);
          _x1 += len * sx;
          _y1 += sy;
          error -= len * dy - dx;
        } while (count--);
      }
      if (error > 0) { this.cx.rect(_x1, _y2, _x2 - _x1, anchoTrazo) }
    } else if (dx < dy) {
      error = dy / 2;
      rev = _y1 > _y2 ? 1 : 0;
      if (dx > 1) {
        error = 0;
        count--;
        do {
          len = error / dx + 2 | 0;
          this.cx.rect(_x1, _y1 - len * rev, anchoTrazo, len);
          _y1 += len * sy;
          _x1 += sx;
          error -= len * dx - dy;
        } while (count--);
      }
      if (error > 0) { this.cx.rect(_x2, _y1, anchoTrazo, _y2 - _y1) }
    } else {
      do {
        this.cx.rect(_x1, _y1, anchoTrazo, 1);
        _x1 += sx;
        _y1 += sy;
      } while (count--);
    }
    this.cx.fill();
  }

  /**
   * @name setNewPoint
   * @description Agrega un nuevo punto al arreglo de puntos
   * @param x Coordenada x para el par de coordenadas del punto de inicio
   * @param y Coordenada y para el par de coordenadas del punto de inicio
   * @param fx Coordenada x para el par de coordenadas del punto de termino
   * @param fy Coordenada y para el par de coordenadas del punto de termino
   */
  public setNewPoint(x: number, y: number, fx: number, fy: number) {
    this._points.push({
      startX: x,
      startY: y,
      endX: fx,
      endY: fy,
      tipoTrazo: this.buttonActive,
      colorTrazo: this.colorTrazo,
      anchoTrazo: this.anchoTrazo,
    });
  }

  /** */
  private cx: CanvasRenderingContext2D;
  /** Dimensiones del cavas */
  private width = 1200;
  private height = 680;
  /** Array de puntos dibujados */
  public _points: CoordenadaTrazo[] = [];

  public isAvailable: boolean = false;
  public isDrawin: boolean = false;

  /** button active */
  public buttonActive: buttonsNavbar = 1;
  /** Color del trazo */
  public colorTrazo: Color = Color.Black;
  /** Ancho trazo */
  public anchoTrazo: number = 10;
}
