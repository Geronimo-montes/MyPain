import { Injectable } from '@angular/core';
import { buttonsNavbar, CoordenadaTrazo } from '../model/buttonsNavbar.model';
import { Color } from '../model/color.model';

enum signo {
  negativo = -1,
  positivo = 1,
}

@Injectable({
  providedIn: 'root'
})
export class DibujarLineaService {

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


  /**
   * @name drawLine
   * @description Dado dos pares de cooerdenas del tipo (x, y), realiza el trazo de una linea recta
   * @param x 
   * @param y 
   * @param fx 
   * @param fy 
   */
  public drawLine(x: number, y: number, fx: number, fy: number) {
    this.cx.fillStyle = "white";
    this.cx.fillRect(0, 0, this.width, this.height);

    for (var i = 0; i < this._points.length; ++i) {
      this.identificarCuadrante(
        this._points[i].startX, this._points[i].startY,
        this._points[i].endX, this._points[i].endY,
        this._points[i].colorTrazo,
        this._points[i].anchoTrazo,
      );
    }

    if (this.isDrawin) {
      this.identificarCuadrante(x, y, fx, fy, this.colorTrazo, this.anchoTrazo);
    }
  }

  /**
   * @name identificarCuadrante
   * @description Dados dos pares de coordenadas identifica a que cuadrannte pertenece el trazo despues manda llamar a bresenhamLine_II
   * @param x1 Coordenada x del punto inicial 
   * @param y1 Coordenada y del punto inicial
   * @param x2 Coordenada x del punto final
   * @param y2 Coordenada y del punto final
   * @param colorTrazo Color de la linea a trazar
   * @param anchoTrazo Grosor de la linea a trazar
   */
  private identificarCuadrante(x1, y1, x2, y2, colorTrazo, anchoTrazo) {
    this.cx.fillStyle = colorTrazo;
    var
      x = Math.trunc(x1),
      y = Math.trunc(y1),
      dx = Math.abs(x2 - x1),
      dy = Math.abs(y2 - y1),
      e = 2 * dy - dx; //Distancia entre la linea ideal que se desea trazar y el pixel que queda mas cerc,
    const
      _anchoTrazo = anchoTrazo / 2,
      pendiente = (dx === 0 || dy === 0) ? 0 : (y2 - y1) / (x2 - x1);

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
    this.cx.beginPath();

    if (pendiente >= 0)
      /**Cuadrante 2 */
      if (x1 >= x2 && y1 >= y2)
        this.bresenhamLine_II(x, y, dx, dy, e, _anchoTrazo, signo.negativo, signo.negativo);
      /**Cuadrante 4 */
      else
        this.bresenhamLine_II(x, y, dx, dy, e, _anchoTrazo, signo.positivo, signo.positivo);
    else if (pendiente < 0)
      /** Cuadrante 3 */
      if (x1 >= x2 && y1 <= y2)
        this.bresenhamLine_II(x, y, dx, dy, e, _anchoTrazo, signo.negativo, signo.positivo);
      /** Cuadrante 1 */
      else
        this.bresenhamLine_II(x, y, dx, dy, e, _anchoTrazo, signo.positivo, signo.negativo);

    this.cx.fill();
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
  private bresenhamLine(x: number, y: number, dx: number, dy: number, e: number, _anchoTrazo, signoX: signo, signoY: signo) {
    if (dx > dy)
      for (let i = 0; i < dx; i++) {             //Paso #1 recorremos de 1 hasta dx = (x2 - x1)
        this.cx.arc(x, y, _anchoTrazo, 0, 360);  //Dibujamos el punto en las cordenadas indicadas esto incluye en punto inicial y el punto final      
        while (e >= 0) {
          y = y + (signoY * 1);                  //aunmentamos los valores con respecto a y  
          e = e - 2 * dx;                        //recalculamos e
        }
        x = x + (signoX * 1);
        e = e + 2 * dy;
      }
    else
      for (let i = 0; i < dy; i++) {             //Paso #1 recorremos de 1 hasta dx = (x2 - x1)
        this.cx.arc(x, y, _anchoTrazo, 0, 360);  //Dibujamos el punto en las cordenadas indicadas esto incluye en punto inicial y el punto final      
        while (e >= 0) {
          x = x + (signoX * 1);                                //aunmentamos los valores con respecto a y  
          e = e - 2 * dy;                        //recalculamos e
        }
        y = y + (signoY * 1);
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
  private bresenhamLine_II(x: number, y: number, dx: number, dy: number, e: number, _anchoTrazo, signoX: signo, signoY: signo) {
    const
      dosD = (dx > dy) ? 2 * dy : 2 * dx,
      dosD_dosD = (dx > dy) ? 2 * (dy - dx) : 2 * (dx - dy);

    if (dx > dy) {
      for (let i = 0; i < dx; i++) {
        this.cx.arc(x, y, _anchoTrazo, 0, 360);
        x += (1 * signoX);
        if (e < 0) {
          e += dosD;
        } else {
          y += (1 * signoY);
          e += dosD_dosD;
        }
      }
    } else {
      for (let i = 0; i < dy; i++) {
        this.cx.arc(x, y, _anchoTrazo, 0, 360);
        y += (1 * signoY);

        if (e < 0) {
          e += dosD;
        } else {
          x += (1 * signoX);
          e += dosD_dosD;
        }
      }
    }
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
  public anchoTrazo: number = 1;
}
