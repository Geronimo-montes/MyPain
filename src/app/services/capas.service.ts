import { Injectable } from '@angular/core';
import { Capa, ParCoordenada } from '../model/capa.model';
import { TipoTrazo } from "../model/tipo-trazo.model";
import { Color } from '../model/color.model';
import { DibujarLineaService } from './dibujar-linea.service';
import { DibujarLapizService } from './dibujar-lapiz.service';
import { DibujarCirculoElipseService } from './dibujar-circulo-elipse.service';
import { DibujarCuadrilateroService } from './dibujar-cuadrilatero.service';
import { DibujarPoligonoService } from './dibujar-poligono.service';

@Injectable({
  providedIn: 'root',
})
export class CapasService {

  constructor(
    private dibujarLinea: DibujarLineaService,
    private dibujarLapiz: DibujarLapizService,
    private dibujarCirculo: DibujarCirculoElipseService,
    private dibujarCuadrilatero: DibujarCuadrilateroService,
    private dibujarPoligono: DibujarPoligonoService,
  ) { }

  /**
   * @name render
   * @description Este metodo se encarga de realizar un renderizado al inicio de la ejecucion, solo se disparara una vez dentro del metodo * ngAfterViewInit.
   * @param canvasEl Elmento canvas que funcionara como lienzo, solo debe existir uno
   */
  public render(canvasEl: any) {
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.cx = canvasEl.getContext('2d');
  }

  /**
   * @name setNewCapa
   * @description Agrega la capa al array de capas
   */
  public setNewCapa(puntoA: ParCoordenada, puntoB: ParCoordenada) {
    /**como se esta realizando un trazo, ninguna capa esta seleccionada */
    this.capas.forEach((capa: Capa) => { capa.selected = false; });
    /**Datos del trazo que se esta realizando */
    let capa = {
      index: this.index,
      PuntoA: puntoA,
      PuntoB: puntoB,
      tipoTrazo: this.buttonActive,
      colorTrazo: this.colorTrazo,
      anchoTrazo: this.anchoTrazo,
      puntos: this.tipoTrazo(puntoA, puntoB, this.buttonActive),
      selected: true
    };

    this.capas.push(capa);
    this.indexSelected = this.index;
    this.isSelected = true;
    this.index++;
    this.trazarCapas();
  }

  /**
   * @name setCapa
   * @param puntoA 
   * @param puntoB 
   * @description establece nuevos valores para la capa seleccionada. Usada para el evento move del
   * mouse
   */
  public setCapa(puntoA: ParCoordenada, puntoB: ParCoordenada) {
    /**Cuando el usuario esta realizando un trazo nuevo */
    if (this.isDrawin) {
      /**Datos del trazo que se esta realizando */
      let capa = {
        index: this.capas[this.indexSelected].index,
        PuntoA: puntoA,
        PuntoB: puntoB,
        tipoTrazo: this.buttonActive,
        colorTrazo: this.colorTrazo,
        anchoTrazo: this.anchoTrazo,
        puntos: this.tipoTrazo(puntoA, puntoB, this.buttonActive),
        selected: true
      };

      this.capas[this.indexSelected] = capa;
      this.trazarCapas();
    }
  }

  /**
   * @name setCapaResize
   * @param punto 
   * @description Una vez identitidaco el punto de redimensionado, se establecen nuevos avalores
   * para los puntos A y B de la capa, ademas se recalcula el valores de los putnos de dicho trazo
   */
  setCapaResize(punto: ParCoordenada) {
    //Una capa tiene que estar seleccionada para poder realizar el redimesionado
    if (this.isSelected) {
      if (this.isResizeA) //isResizeA indica se se a seleccionado el puntoA de la capa
        this.capas[this.indexSelected].PuntoA = punto;
      else if (this.isResizeB)//isResizeA indica se se a seleccionado el puntoB de la capa
        this.capas[this.indexSelected].PuntoB = punto;

      this.capas[this.indexSelected].puntos = this.tipoTrazo(
        this.capas[this.indexSelected].PuntoA,
        this.capas[this.indexSelected].PuntoB,
        this.capas[this.indexSelected].tipoTrazo
      );
      this.trazarCapas();
    }
  }

  /**
   * @name seleccionarCapa
   * @param punto Par de coordenadas donde se dio el clic
   * @description Verifica si el lugar donde se dio clic corresponde al trazo de una capa
   */
  public seleccionarCapa(punto: ParCoordenada) {
    /**ninguna capa seleccionada */
    this.capas.map((capa: Capa) => capa.selected = false);
    /**Antes de buscar el punto invertimos el array */
    this.capas.reverse();
    /**buscar el punto dentro del arreglo de puntos de cada capa*/
    this.capas.every((capa: Capa) =>
      capa.puntos.every((coordenada: ParCoordenada) => {
        const
          ancho = ~~(0.5 + capa.anchoTrazo / 2),
          xInint = punto.x - ancho,
          xFin = punto.x + ancho,
          yInint = punto.y - ancho,
          yFin = punto.y + ancho;
        this.indexSelected = -1;
        for (let x = xInint; x <= xFin; x++)
          for (let y = yInint; y <= yFin; y++)
            if (coordenada.x === x && coordenada.y === y) {
              capa.selected = true;
              this.isSelected = true;
              this.indexSelected = capa.index;
              return false;
            }
        this.isSelected = false;
        return true;
      })
    );
    /**Ya que terminamos regresamos el array a su estado */
    this.capas.reverse();
    /**Recorre el arreglo de capas y las dibuja */
    this.trazarCapas();
  }

  /**
   * @name seleccionarPuntoCapa
   * @param punto 
   * @returns true: si se ha modificado algun valor de control (isResizeA ó isResizeB)
   */
  public seleccionarPuntoCapa(punto: ParCoordenada): boolean {
    const
      capa = this.capas[this.indexSelected],
      ancho = ~~(0.5 + capa.anchoTrazo / 2),
      xInint = punto.x - ancho,
      xFin = punto.x + ancho,
      yInint = punto.y - ancho,
      yFin = punto.y + ancho;
    this.isDrawin = false;
    //debido a que los puntos son circulos con anchura, debemos valorar el area que el circulo 
    //abarca, y verificar todos esos puntos. Aunque esta verificacion realiza el calculo como
    //si de un cuadrado se tratase
    for (let x = xInint; x <= xFin; x++)
      for (let y = yInint; y <= yFin; y++)
        if (capa.PuntoA.x === x && capa.PuntoA.y === y) {
          this.isResizeA = true;
          this.isResizeB = false;
          return true;
        } else if (capa.PuntoB.x === x && capa.PuntoB.y === y) {
          this.isResizeA = false;
          this.isResizeB = true;
          return true;
        }
    return false;
  }

  /**
   * @name moverCapa
   * @param posicion Posicion a la que se va a mover la capa 
   * @description posiciona la capa en una nueva posicion: Al frente, al fondo, una capa al frente, una capa atras
   */
  public moverCapa(posicion: TipoTrazo): void {
    var capaMover = this.capas[this.indexSelected];
    switch (posicion) {
      case TipoTrazo.movarUnaCapaAdelante:
        if (this.indexSelected < this.capas.length - 1) {
          this.capas[this.indexSelected] = this.capas[this.indexSelected + 1];
          this.capas[this.indexSelected + 1] = capaMover;
          this.indexSelected = this.indexSelected + 1;
        }
        break;
      case TipoTrazo.movarUnaCapaAtras:
        if (this.indexSelected > 0) {
          this.capas[this.indexSelected] = this.capas[this.indexSelected - 1];
          this.capas[this.indexSelected - 1] = capaMover;
          this.indexSelected = this.indexSelected - 1;
        }
        break;
      case TipoTrazo.moverAdelante:
        /**La eliminamos del array */
        this.capas.splice(this.indexSelected, 1);
        /**Insertamos al inicio la capa */
        this.capas.push(capaMover);
        this.indexSelected = this.capas.length - 1;
        break;
      case TipoTrazo.moverAtras:
        /**La eliminamos del array */
        this.capas.splice(this.indexSelected, 1);
        /**Insertamos al inicio la capa */
        this.capas.unshift(capaMover);
        this.indexSelected = 0;
        break;

    }
    let i = 0;
    this.capas.map(((capa: Capa) => {
      capa.index = i++;
      return capa;
    }));
    this.trazarCapas();
  }

  /**
   * @name trazarCapas
   * @description Recorre los pares de coordenadas y traza un punto por cada uno
   */
  private trazarCapas() {
    this.cx.fillStyle = 'white';
    this.cx.fillRect(0, 0, this.width, this.height);
    //trazado de capas
    this.capas.forEach(capa => {
      this.cx.fillStyle = capa.colorTrazo;
      const _anchoTrazo = capa.anchoTrazo / 2;

      capa.puntos.forEach((punto: ParCoordenada) => {
        this.cx.beginPath();
        this.cx.arc(punto.x, punto.y, _anchoTrazo, 0, 360);
        this.cx.closePath();
        this.cx.fill();
      });

      if (capa.selected) {
        this.cx.fillStyle = Color.White;
        this.cx.strokeStyle = Color.Black;
        this.cx.beginPath();
        this.cx.arc(capa.PuntoA.x, capa.PuntoA.y, 3, 0, 360);
        this.cx.closePath();
        this.cx.stroke();
        this.cx.fill();
        this.cx.beginPath();
        this.cx.arc(capa.PuntoB.x, capa.PuntoB.y, 3, 0, 360);
        this.cx.closePath();
        this.cx.stroke();
        this.cx.fill();
      }
    });
  }

  /**
   * @name tipoTrazo
   * @param capa 
   * @description llama la función correspondiente al boton activo y llena el arreglo de puntos
   */
  private tipoTrazo(puntoA: ParCoordenada, puntoB: ParCoordenada, tipoTrazo: TipoTrazo): ParCoordenada[] {
    switch (tipoTrazo) {
      case TipoTrazo.linea:
        return this.dibujarLinea.bresenhamLine(puntoA, puntoB, this.anchoTrazo);

      case TipoTrazo.lapiz:
        let puntos = (this.capaActiva === null) ? [] : this.capaActiva.puntos;
        return this.dibujarLapiz.lapiz(puntoB, puntos, this.anchoTrazo);

      case TipoTrazo.circulo:
        return this.dibujarCirculo.circulo(puntoA, puntoB, this.anchoTrazo);

      case TipoTrazo.elipse:
        return this.dibujarCirculo.elipse(puntoA, puntoB, this.anchoTrazo);

      case TipoTrazo.cuadrado:
        return this.dibujarPoligono.poligono(puntoA, puntoB, 4, this.anchoTrazo);
      // return this.dibujarCuadrilatero.cuadrado(puntoA, puntoB, this.anchoTrazo);

      case TipoTrazo.rectangulo:
        return this.dibujarCuadrilatero.rectangulo(puntoA, puntoB, this.anchoTrazo);

      case TipoTrazo.pentagono:
        return this.dibujarPoligono.poligono(puntoA, puntoB, 5, this.anchoTrazo);

      case TipoTrazo.hexagono:
        return this.dibujarPoligono.poligono(puntoA, puntoB, 6, this.anchoTrazo);

      case TipoTrazo.octagono:
        return this.dibujarPoligono.poligono(puntoA, puntoB, 8, this.anchoTrazo);

      case TipoTrazo.poligono:
        return this.dibujarPoligono.poligono(puntoA, puntoB, 10, this.anchoTrazo);

      case TipoTrazo.triangulo:
        return this.dibujarPoligono.poligono(puntoA, puntoB, 3, this.anchoTrazo);

    }
  }

  /**Get y Set de las variables privadas */
  public get colorTrazo(): Color {
    return this._colorTrazo;
  }

  public set colorTrazo(value: Color) {
    //seteamos el valor indicado
    this._colorTrazo = value;
    //si hay elemento seleccionado le seteamos el valor a la capa
    if (this.isSelected) {
      this.capas[this.indexSelected].colorTrazo = value;
      /**Iniciolizamos el contenedor */
      this.cx.fillStyle = 'white';
      this.cx.fillRect(0, 0, this.width, this.height);
      this.trazarCapas();
    }
  }

  public get anchoTrazo(): number {
    return this._anchoTrazo;
  }

  public set anchoTrazo(value: number) {
    //seteamos el calor del ancho del trazo
    this._anchoTrazo = value;
    //si esta seleecionado un trazo modificamos se valor
    if (this.isSelected) {
      this.capas[this.indexSelected].anchoTrazo = value;
      /**Iniciolizamos el contenedor */
      this.cx.fillStyle = 'white';
      this.cx.fillRect(0, 0, this.width, this.height);
      this.trazarCapas();
    }
  }

  /** ¿Dibujando? */
  public isDrawin: boolean = false;
  /** ¿Trazo Seleccionado? */
  public isSelected: boolean = false;
  /** ¿Redimensionanado */
  public isResizeA: boolean = false;
  public isResizeB: boolean = false;
  /** button active */
  public buttonActive: TipoTrazo = TipoTrazo.linea;
  /**Lienzo para dibujar*/
  private cx: CanvasRenderingContext2D;
  /** Dimensiones del cavas */
  private width = 1000;
  /** Dimensiones del cavas */
  private height = 650;
  /** Array de puntos dibujados */
  private capas: Capa[] = [];
  /**PAra indexar las capas */
  private index = 0;
  /**index de la capa selecionada */
  private indexSelected: number = -1;
  /** Capa que se esta trazado en el evento click del moue*/
  private capaActiva: Capa = null;
  /** Color del trazo */
  private _colorTrazo: Color = Color.Black;
  /** Ancho trazo */
  private _anchoTrazo: number = 5;

}