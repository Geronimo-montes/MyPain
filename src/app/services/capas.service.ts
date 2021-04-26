import { Injectable } from '@angular/core';
import { Capa, eventoCanvas, ParCoordenada } from '../model/capa.model';
import { HerramientaCapa, TipoTrazo } from "../model/tipo-trazo.model";
import { Color } from '../model/color.model';
import { DibujarLineaService } from './dibujar-linea.service';
import { DibujarLapizService } from './dibujar-lapiz.service';
import { DibujarCirculoElipseService } from './dibujar-circulo-elipse.service';
import { DibujarPoligonoService } from './dibujar-poligono.service';
import { DibujarRotacionService } from './dibujar-rotacion.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class CapasService {

  constructor(
    private dibujarLinea: DibujarLineaService,
    private dibujarLapiz: DibujarLapizService,
    private dibujarCirculo: DibujarCirculoElipseService,
    private dibujarPoligono: DibujarPoligonoService,
    private rotar: DibujarRotacionService,
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
   * @description genera una nueva capa para el trazo que se esta realizando y la agrega al array de capas
   */
  public setNewCapa(puntoA: ParCoordenada, puntoB: ParCoordenada) {
    if (!this.validDimesionesCavas(puntoA) || !this.validDimesionesCavas(puntoB)) return;
    this.capas.push({
      index: this.index,
      puntoA: puntoA,
      puntoB: puntoB,
      vertices: [],
      numeroLados: this.numeroLados,
      tipoTrazo: this.trazoActiva,
      colorTrazo: this.colorTrazo,
      colorRelleno: this.colorRelleno,
      anchoTrazo: this.anchoTrazo,
      angulo: 0,
      puntos: [],
    });

    this.indexSelected = this.index;
    this.capas[this.indexSelected] = this.calcularCoordenadasTrazo(this.capas[this.indexSelected]);
    this.isSelected = true;
    this.eventoActual = eventoCanvas.isDrawin;
    this.index++;
    this.trazarCapas();
  }

  /**
   * @name setCapa
   * @param puntoA 
   * @param puntoB 
   * @description setea la que se trazo con los ultimos valores enviados
   */
  public setCapa(puntoA: ParCoordenada, puntoB: ParCoordenada) {
    if (!this.validDimesionesCavas(puntoA) || !this.validDimesionesCavas(puntoB) || this.eventoActual !== eventoCanvas.isDrawin) return;
    if (puntoA.x === puntoB.x && puntoA.y === puntoB.y) {
      this.capas.splice(this.indexSelected, 1);//eliminamos el elemento top
      this.index--;//disminuimos el indezador de capas
      this.isSelected = false;//apagamos la bandera de seleccion
      return;
    }
    this.capas[this.indexSelected].puntoB = puntoB;
    this.capas[this.indexSelected].angulo = this.rotar.calcularGradoInclinacion({ x: puntoB.x, y: puntoA.y }, puntoB, puntoA);
    this.capas[this.indexSelected] = this.calcularCoordenadasTrazo(this.capas[this.indexSelected]);
    this.trazarCapas();
  }

  /**
   * @name seleccionarCapa
   * @param punto Par de coordenadas donde se dio el clic
   * @description Verifica si el lugar donde se dio clic corresponde al trazo de una capa
   */
  public seleccionarCapa(punto: ParCoordenada) {
    if (!this.validDimesionesCavas(punto)) return;
    this.isSelected = false;
    this.indexSelected = -1;
    let index = this.buscarPuntoCapas(punto);//Buscamos el punto el el array de capas
    if (index > -1) {
      this.isSelected = true;
      this.indexSelected = index;
    }
    this.trazarCapas();
  }

  /**
   * @name buscarPuntoCapas
   * @param punto 
   * @returns index de la capa donde se encuentra el punto, else -1
   * @description Busca un punto en el array de capas. Utilizado en el evneto de seleccion de capa
   */
  public buscarPuntoCapas(punto: ParCoordenada): number {
    let index = -1;
    this.capas.reverse();//invertimos el array. La ultima capa del array es la primera en el canvas
    this.capas.every((capa: Capa) => {
      capa.puntos.every((coordenada: ParCoordenada) => {
        const
          ancho = ~~(0.5 + capa.anchoTrazo / 2),
          xInint = punto.x - ancho,
          xFin = punto.x + ancho,
          yInint = punto.y - ancho,
          yFin = punto.y + ancho;

        for (let x = xInint; x <= xFin; x++)
          for (let y = yInint; y <= yFin; y++)
            if (coordenada.x === x && coordenada.y === y) {
              index = capa.index;
              return (index > -1) ? false : true;
            }
        return (index > -1) ? false : true;
      });
      return (index > -1) ? false : true;
    });
    this.capas.reverse();
    return index;
  }

  /**
   * @name seleccionarPuntoCapa
   * @param punto 
   * @returns true: si se ha modificado algun valor de control (isResize)
   */
  public seleccionarPuntoCapa(punto: ParCoordenada): boolean {
    if (!this.validDimesionesCavas(punto)) return;
    const
      capa = this.capas[this.indexSelected],
      ancho = ~~(0.5 + capa.anchoTrazo / 2),
      xInint = punto.x - ancho,
      xFin = punto.x + ancho,
      yInint = punto.y - ancho,
      yFin = punto.y + ancho;

    for (let x = xInint; x <= xFin; x++)
      for (let y = yInint; y <= yFin; y++)
        this.capas[this.indexSelected].vertices
          .forEach((vertice: ParCoordenada, index) => {
            if (vertice.x === x && vertice.y === y) {
              this.eventoActual = eventoCanvas.isResize;
              this.capas[this.indexSelected].indexPuntoRisize = index; //almacenamos la ubicacion del vertise seleccionado
              return true;
            }
          });
    return false;
  }

  /**
   * @name seleccionarPuntoTrazo
   * @param punto 
   * @returns true: si el punto esta dentro del array de puntos del trazo
   */
  public seleccionarPuntoTrazo(punto: ParCoordenada): boolean {
    if (!this.validDimesionesCavas(punto)) return;
    const
      ancho = ~~(0.5 + this.capas[this.indexSelected].anchoTrazo / 2),
      xInint = punto.x - ancho,
      xFin = punto.x + ancho,
      yInint = punto.y - ancho,
      yFin = punto.y + ancho;

    let seleccionado = false;
    this.capas[this.indexSelected].puntos.every((punto: ParCoordenada) => {
      for (let x = xInint; x <= xFin; x++)
        for (let y = yInint; y <= yFin; y++)
          if (this.herramientaActiva === HerramientaCapa.rotar) {
            this.capas[this.indexSelected].vertices
              .forEach((vertice: ParCoordenada, index) => {
                if (vertice.x === x && vertice.y === y) {
                  seleccionado = true;
                  return !seleccionado;
                }
              });
          } else {
            if (punto.x === x && punto.y === y) {
              seleccionado = true;
              return !seleccionado;
            }
          }
      return !seleccionado;
    });

    return seleccionado;
  }

  /**
   * @name moverCapa
   * @param tipoTrazo Posicion a la que se va a mover la capa 
   * @description posiciona la capa en una nueva posicion: Al frente, al fondo, una capa al frente, una capa atras
   */
  public moverCapa(tipoHerramienta: HerramientaCapa): void {
    if (!this.isSelected) return;
    var capaMover = this.capas[this.indexSelected];
    switch (tipoHerramienta) {
      case HerramientaCapa.movarUnaCapaAdelante:
        if (this.indexSelected < this.capas.length - 1) {
          this.capas[this.indexSelected] = this.capas[this.indexSelected + 1];
          this.capas[this.indexSelected + 1] = capaMover;
          //reindexamos las capas movidas
          this.capas[this.indexSelected].index = this.indexSelected;
          this.capas[this.indexSelected + 1].index = this.indexSelected + 1;
          this.indexSelected = this.indexSelected + 1;
        }
        break;
      case HerramientaCapa.movarUnaCapaAtras:
        if (this.indexSelected > 0) {
          this.capas[this.indexSelected] = this.capas[this.indexSelected - 1];
          this.capas[this.indexSelected - 1] = capaMover;
          //reindexamos las capas movidas
          this.capas[this.indexSelected].index = this.indexSelected;
          this.capas[this.indexSelected - 1].index = this.indexSelected - 1;
          this.indexSelected = this.indexSelected - 1;
        }
        break;
      case HerramientaCapa.moverAdelante:
      case HerramientaCapa.moverAtras:
        this.capas.splice(this.indexSelected, 1);//La eliminamos del array
        if (HerramientaCapa.moverAdelante === tipoHerramienta) {
          this.capas.push(capaMover);//Insertamos al final del array
          this.indexSelected = this.capas.length - 1;
        } else if (HerramientaCapa.moverAtras === tipoHerramienta) {
          this.capas.unshift(capaMover);//Insertamos al inicio del array
          this.indexSelected = 0;
        }
        let i = 0;
        this.capas.map(((capa: Capa) => {
          capa.index = i++;
          return capa;
        }));
        break;
    }
    this.trazarCapas();
  }

  /**
   * @name resizeTrazo
   * @param punto 
   * @description Una vez identitidaco el punto de redimensionado, se establecen nuevos valores
   * para los puntos A y B de la capa, ademas se recalcula el valores de los putnos de dicho trazo
   */
  public resizeTrazo(punto: ParCoordenada) {
    if (!this.validDimesionesCavas(punto) || this.capas[this.indexSelected].tipoTrazo === TipoTrazo.lapiz) return;
    const
      capa: Capa = this.capas[this.indexSelected], //creamos una copia de la capa
      desplazamientoX: number = punto.x - capa.vertices[capa.indexPuntoRisize].x, //calculamos el desplazamiento en x
      desplazamientoY: number = punto.y - capa.vertices[capa.indexPuntoRisize].y; //calculamos el desplazamiento en y
    //posicionamiento del vertise hasta la posicion del mouse
    capa.vertices[capa.indexPuntoRisize].x += desplazamientoX;
    capa.vertices[capa.indexPuntoRisize].y += desplazamientoY;

    switch (capa.tipoTrazo) {
      case TipoTrazo.linea: //cada vertice corresponde al puntoA y puntoB respectivamente
        capa.puntoA = capa.vertices[0];
        capa.puntoB = capa.vertices[1];
        break;
      case TipoTrazo.elipse://el punto b se desplaza con respecto al movimiento del mouse
        capa.puntoB.x += desplazamientoX;
        capa.puntoB.y += desplazamientoY;
        this.capas[this.indexSelected] = this.calcularCoordenadasTrazo(capa); //recalculamos vertices y puntos
        this.trazarCapas();
        return this.capas[this.indexSelected].vertices[capa.indexPuntoRisize];
      default: //cuadrado rombo pentagono hexagono octagono poligono triangulo circulo
        capa.puntoB = capa.vertices[capa.indexPuntoRisize];
        break;
    }

    this.capas[this.indexSelected] = this.calcularCoordenadasTrazo(capa); //recalculamos vertices y puntos
    this.trazarCapas();
  }

  /**
   * @name moverTrazo
   * @param puntoA 
   * @param puntoB 
   * @returns el punto del calculo. Que despues de ejecutar la funcion es el puntoA
   * @description Dado un punto contenido en el trazo (no aplica a linea), se recalculan 
   * los putos a y b en base al movimiento de dicho punto. se recualcula los putnos del trazo
   */
  public moverTrazo(puntoA: ParCoordenada, puntoB: ParCoordenada): ParCoordenada {
    if (!this.validDimesionesCavas(puntoA) || !this.validDimesionesCavas(puntoB)) return;
    const
      desplazamientoX: number = puntoB.x - puntoA.x,
      desplazamientoY: number = puntoB.y - puntoA.y;

    if (this.capas[this.indexSelected].tipoTrazo !== TipoTrazo.lapiz) {
      this.capas[this.indexSelected].puntoA.x += desplazamientoX;
      this.capas[this.indexSelected].puntoA.y += desplazamientoY;
      this.capas[this.indexSelected].puntoB.x += desplazamientoX;
      this.capas[this.indexSelected].puntoB.y += desplazamientoY;
      this.capas[this.indexSelected] = this.calcularCoordenadasTrazo(this.capas[this.indexSelected]);
    } else {
      this.capas[this.indexSelected].puntoB.x += desplazamientoX;
      this.capas[this.indexSelected].puntoB.y += desplazamientoY;

      this.capas[this.indexSelected].puntos.forEach((punto: ParCoordenada) => {
        punto.x += desplazamientoX;
        punto.y += desplazamientoY;
      });
    }
    this.trazarCapas();
    return puntoB;
  }

  /**
   * @name rotarTrazo
   * @param punto posición del cursor dentro del canvas
   * @description rota el trazo con respecto a la posicion del raton
   */
  public rotarTrazo(punto: ParCoordenada) {
    if (!this.isSelected) return;
    let capa: Capa = this.capas[this.indexSelected], angulo: number;

    this.capas[this.indexSelected].angulo += angulo =
      this.rotar.rotacionMouse(punto, this.capas[this.indexSelected]);

    if (capa.tipoTrazo === TipoTrazo.linea)
      this.capas[this.indexSelected].puntoB =
        this.rotar.rotacion(capa.puntoA, capa.puntoB, angulo);

    this.capas[this.indexSelected] =
      this.calcularCoordenadasTrazo(this.capas[this.indexSelected]);

    this.trazarCapas();
  }

  /**
   * @name borrarTrazo
   * @description Dado un trazo seleccionado en el canvas, es eliminado del array de capas
   */
  public borrrarTrazo(): void {
    this.capas.splice(this.indexSelected, 1);
    this.isSelected = false;
    this.indexSelected = -1;
    this.index--;
    let i = 0;
    this.capas.forEach((capa: Capa) => capa.index = i++);
    this.trazarCapas();
  }

  /**
   * @name getColorTrazo
   * @returns color del trazo sobre el que se hizo click
   * @description Extractor de color
   */
  public getColorTrazo(index: number): Color {
    return this.capas[index].colorTrazo;
  }

  /**
   * @name trazarCapas
   * @description Recorre los pares de coordenadas y traza un punto por cada uno
   */
  private trazarCapas() {
    this.cx.fillStyle = 'white';
    this.cx.lineCap = 'round';
    this.cx.fillRect(0, 0, this.width, this.height);
    this.capas.forEach(capa => {
      const _anchoTrazo = capa.anchoTrazo / 2;
      //relleno de la capa
      if (capa.colorRelleno !== Color.Transparent && (capa.tipoTrazo !== TipoTrazo.linea && capa.tipoTrazo !== TipoTrazo.lapiz)) {
        this.cx.strokeStyle = capa.colorRelleno;
        this.cx.beginPath();
        capa.puntos.forEach(punto => this.cx.arc(punto.x, punto.y, _anchoTrazo, 0, 360));
        this.cx.closePath();
        this.cx.stroke();
      }
      //contorno de la forma
      this.cx.fillStyle = capa.colorTrazo;
      capa.puntos.forEach((punto: ParCoordenada) => {
        this.cx.beginPath();
        this.cx.arc(punto.x, punto.y, _anchoTrazo, 0, 360);
        this.cx.closePath();
        this.cx.fill();
      });
      //vertices de la figura
      if (capa.index === this.indexSelected) {
        this.cx.fillStyle = Color.White;
        this.cx.strokeStyle = Color.Black;
        capa.vertices.forEach((punto: ParCoordenada) => {
          this.cx.beginPath();
          this.cx.arc(punto.x, punto.y, 4, 0, 360);
          this.cx.closePath();
          this.cx.stroke();
          this.cx.fill();
        });
      }
    });
  }

  public saveProyecto(nameFile: string) {
    //convierte el array capas en un json
    //ramplace agrega el casteo a los campos de tipo Color Ejm.(<Color>"#FFFFFF")
    let
      extension: string = ".json",
      json = JSON.stringify(this.capas);
    nameFile = (nameFile !== "") ? nameFile : 'proyecto';
    // creas el fichero con la API File
    var file = new File([json], `${nameFile}.${extension}`, { type: "application/json;charset=utf-8" });
    // obtienes una URL para el fichero que acabas de crear
    var url = window.URL.createObjectURL(file);
    // creas un enlace y lo añades al documento
    var a = document.createElement("a");
    // actualizas los parámetros del enlace para descargar el fichero creado
    a.href = url;
    a.download = file.name;
    a.click();
  }

  abrirProyecto(capas: Capa[]): boolean {
    this.capas = capas;
    this.index = this.capas.length;
    this.trazarCapas();
    return true;
  }

  generarImg(nameFile: string): boolean {
    var dataURL = this.canvas.toDataURL('image/jpeg', 1.0);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = dataURL;
    a.download = `${nameFile}.jpeg`;
    a.click();
    return true;
  }


  /**
   * @name calcularCoordenadasTrazo
   * @param capa 
   * @returns capa con los vertices y los puntos por donde pasa la figura
   */
  private calcularCoordenadasTrazo(capa: Capa): Capa {
    switch (capa.tipoTrazo) {
      case TipoTrazo.elipse:
        return this.dibujarCirculo.elipse(capa);
      case TipoTrazo.rectangulo:
        return this.dibujarPoligono.rectangulo(capa);
      case TipoTrazo.lapiz:
        capa.vertices = [];
        capa.vertices.push(capa.puntoA);
        capa.vertices.push(capa.puntoB);
        capa.puntos = this.dibujarLapiz.lapiz(capa.puntoB, capa.puntos, capa.anchoTrazo);
        return capa;
      case TipoTrazo.linea:
        capa.vertices = [];
        capa.vertices.push(capa.puntoA);
        capa.vertices.push(capa.puntoB);
        capa.puntos = this.dibujarLinea.bresenhamLine(capa.puntoA, capa.puntoB, capa.anchoTrazo);
        return capa;
      default://triangulo, cuadrado, rombo, pentagono, hexagono, octagono, poligono, circulo
        return this.dibujarPoligono.poligono(capa);
    }
  }

  /**Get y Set de las variables privadas */
  get numeroLados(): number {
    return (TipoTrazo.triangulo === this._trazoActiva) ? 3 :
      (TipoTrazo.cuadrado === this._trazoActiva || TipoTrazo.rectangulo === this._trazoActiva || TipoTrazo.rombo === this._trazoActiva) ? 4 :
        (TipoTrazo.pentagono === this._trazoActiva) ? 5 :
          (TipoTrazo.hexagono === this._trazoActiva) ? 6 :
            (TipoTrazo.octagono === this._trazoActiva) ? 8 :
              (TipoTrazo.circulo === this._trazoActiva || TipoTrazo.elipse === this._trazoActiva) ? 16 :
                (TipoTrazo.poligono === this._trazoActiva) ? 10 :
                  1; //caso de la linea y el lapiz
  }
  public get colorTrazo(): Color { return this._colorTrazo; }
  public set colorTrazo(value: Color) {
    this._colorTrazo = value;
    if (this.isSelected) {//si hay elemento seleccionado le seteamos el valor a la capa
      this.capas[this.indexSelected].colorTrazo = value;
      this.trazarCapas();
    }
  }
  public get colorRelleno(): Color { return this._colorRelleno; }
  public set colorRelleno(value: Color) {
    this._colorRelleno = value;
    if (this.isSelected) {//si hay elemento seleccionado le seteamos el valor a la capa
      this.capas[this.indexSelected].colorRelleno = value;
      this.trazarCapas();
    }
  }
  public get anchoTrazo(): number {
    return this._anchoTrazo;
  }
  public set anchoTrazo(value: number) {
    this._anchoTrazo = value;
    if (this.isSelected) {//si esta seleecionado un trazo modificamos se valor
      this.capas[this.indexSelected].anchoTrazo = value;
      this.capas[this.indexSelected] = this.calcularCoordenadasTrazo(this.capas[this.indexSelected]);
      this.trazarCapas();
    }
  }
  public get trazoActiva(): TipoTrazo {
    return this._trazoActiva;
  }
  public set trazoActiva(value: TipoTrazo) {
    this._trazoActiva = value;
    this._herramientaActiva = HerramientaCapa.sinSeleccion;
  }
  public get herramientaActiva(): HerramientaCapa {
    return this._herramientaActiva;
  }
  public set herramientaActiva(value: HerramientaCapa) {
    this._herramientaActiva = value;
    this._trazoActiva = TipoTrazo.sinSeleccion;
  }

  private validDimesionesCavas(punto: ParCoordenada): boolean {
    let margin = 10;
    return (punto.x > 0 + margin && punto.x < this.width - margin &&
      punto.y > 0 + margin && punto.y < this.height - margin);
  }

  /**Lienzo para dibujar*/
  private cx: CanvasRenderingContext2D;
  /** Dimensiones del cavas */
  private width = 1600;
  /** Dimensiones del cavas */
  private height = 650;
  /** ¿Trazo Seleccionado? */
  public isSelected: boolean = false;
  /** ¿Dibujando? ¿Redimensionanado ¿Redimensionanado? ¿Moviendo capa? ¿Rotando capa? */
  public eventoActual: eventoCanvas = 0;
  /** trazo activa que se esta usando*/
  private _trazoActiva: TipoTrazo = TipoTrazo.linea;
  /** herramienta que se esta usando */
  private _herramientaActiva: HerramientaCapa = HerramientaCapa.sinSeleccion;
  /** Array de puntos dibujados */
  private capas: Capa[] = [];
  /**PAra indexar las capas */
  private index = 0;
  /**index de la capa selecionada */
  private indexSelected: number = -1;
  /** Color del trazo */
  private _colorTrazo: Color = Color.Black;
  /** Color del trazo */
  private _colorRelleno: Color = Color.Transparent;
  /** Ancho trazo */
  private _anchoTrazo: number = 5;

  public canvas: any;
}
