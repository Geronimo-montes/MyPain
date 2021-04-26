import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { eventoCanvas, ParCoordenada } from 'src/app/model/capa.model';
import { Color } from 'src/app/model/color.model';
import { HerramientaCapa, TipoTrazo } from "src/app/model/tipo-trazo.model";
import { CapasService } from 'src/app/services/capas.service';
// import * as $ from 'jquery';

@Component({
  selector: 'app-lienzo',
  templateUrl: './lienzo.component.html',
})
export class LienzoComponent implements AfterViewInit {

  @Output() setWidth = new EventEmitter<number>();
  @Output() setHeight = new EventEmitter<number>();
  @ViewChild('canvas', { static: false }) canvas: any;

  constructor(
    private servicioCapas: CapasService,
  ) { }

  ngAfterViewInit() {
    this.servicioCapas.render(this.canvas.nativeElement);
    this.servicioCapas.canvas = this.canvas.nativeElement;
  }

  //clic derecho del mouse
  public oMouseClicDer(canvas: HTMLElement, $event) {
    if (this.servicioCapas.eventoActual !== eventoCanvas.isDrawin) {
      var bounds = canvas.getBoundingClientRect();
      this.puntoA = {
        x: ~~(0.5 + ($event.clientX - bounds.left - this.margenError)),
        y: ~~(0.5 + ($event.clientY - bounds.top - this.margenError))
      };

      switch (this.herramientaActiva) {
        case HerramientaCapa.extractor: //buscamos el punto el las capa y tomamos el color setedo
          let index = this.servicioCapas.buscarPuntoCapas(this.puntoA);
          this.servicioCapas.colorRelleno =
            (index > -1) ? this.servicioCapas.getColorTrazo(index)
              : Color.Transparent;
          break;
        default:
          this.servicioCapas.seleccionarCapa(this.puntoA);
          break;
      }
    }
    //desactiva el menu contextual pordefecto
    return false;
  }
  //clic rapido sin dejarlo presionado
  public oMouseClic(canvas: HTMLElement, $event) {
    if (this.servicioCapas.eventoActual !== eventoCanvas.isDrawin) {
      var bounds = canvas.getBoundingClientRect();
      this.puntoA = {
        x: ~~(0.5 + ($event.clientX - bounds.left - this.margenError)),
        y: ~~(0.5 + ($event.clientY - bounds.top - this.margenError))
      };

      switch (this.herramientaActiva) {
        case HerramientaCapa.seleccionar:
          this.servicioCapas.seleccionarCapa(this.puntoA);
          break;
        case HerramientaCapa.borrador:
          if (this.servicioCapas.isSelected) {
            if (this.servicioCapas.seleccionarPuntoTrazo(this.puntoA))
              this.servicioCapas.borrrarTrazo();
            else//si no se reselecciona el trazo se quita la seleccion, verificamos de nuevo
              this.servicioCapas.seleccionarCapa(this.puntoA);
          } else {
            //para seleccionar la capa si que coincide con el punto del clic
            this.servicioCapas.seleccionarCapa(this.puntoA);
            //si ademas se quiere borrar junto con el vento de seleccion se agrega
            if (this.servicioCapas.isSelected) {
              if (this.servicioCapas.seleccionarPuntoTrazo(this.puntoA))
                this.servicioCapas.borrrarTrazo();
              else
                this.servicioCapas.seleccionarCapa(this.puntoA);
            }
          }
          break;
        case HerramientaCapa.extractor:
          let index = this.servicioCapas.buscarPuntoCapas(this.puntoA);
          this.servicioCapas.colorTrazo =
            (index > -1) ? this.servicioCapas.getColorTrazo(index)
              : Color.Transparent;
          break;
      }
    }
  }

  /**Se presiona el click del mouse sin soltarlo dentro del elemento */
  public oMouseDown(canvas: HTMLElement, $event) {
    if (this.servicioCapas.eventoActual !== eventoCanvas.isDrawin) {
      var bounds = canvas.getBoundingClientRect();
      this.puntoA = {
        x: ~~(0.5 + ($event.clientX - bounds.left - this.margenError)),
        y: ~~(0.5 + ($event.clientY - bounds.top - this.margenError))
      };

      switch (this.herramientaActiva) {
        case HerramientaCapa.redimensionar:
          if (this.servicioCapas.isSelected) {//verifica si existe capa seleccionada
            if (!this.servicioCapas.seleccionarPuntoCapa(this.puntoA))
              this.servicioCapas.seleccionarCapa(this.puntoA);
          } else {
            this.servicioCapas.seleccionarCapa(this.puntoA);
          }
          break;
        case HerramientaCapa.moverTrazo:
          if (this.servicioCapas.isSelected) {
            this.servicioCapas.eventoActual = this.servicioCapas.seleccionarPuntoTrazo(this.puntoA) ? eventoCanvas.isMove : eventoCanvas.sinEvento;
            if (this.servicioCapas.eventoActual !== eventoCanvas.isMove) {
              this.servicioCapas.seleccionarCapa(this.puntoA);
            }
          } else {
            this.servicioCapas.seleccionarCapa(this.puntoA);
          }
          break;
        case HerramientaCapa.rotar:
          if (this.servicioCapas.isSelected) {
            this.servicioCapas.eventoActual =
              this.servicioCapas.seleccionarPuntoTrazo(this.puntoA)
                ? eventoCanvas.isRotate : eventoCanvas.sinEvento;

            if (this.servicioCapas.eventoActual === eventoCanvas.isRotate) {
              this.servicioCapas.rotarTrazo(this.puntoA);
            } else if (this.servicioCapas.eventoActual === eventoCanvas.sinEvento) {
              this.servicioCapas.seleccionarCapa(this.puntoA);
            }
          } else {
            this.servicioCapas.seleccionarCapa(this.puntoA);
          }
          break;
        default:
          if (this.trazoActive !== TipoTrazo.sinSeleccion)
            this.servicioCapas.setNewCapa(this.puntoA, this.puntoA);
          break;
      }
    }
  }

  /** El cursor es movido dentro del elemento*/
  public oMouseMove(canvas: HTMLElement, $event) {
    /** Posicion del cursor */
    var bounds = canvas.getBoundingClientRect();
    this.setWidth.emit(~~($event.clientX - bounds.left));
    this.setHeight.emit(~~($event.clientY - bounds.top));
    /**Para dibujar la liena */
    this.puntoB = {
      x: ~~(0.5 + ($event.clientX - bounds.left - this.margenError)),
      y: ~~(0.5 + ($event.clientY - bounds.top - this.margenError))
    };

    switch (this.herramientaActiva) {
      case HerramientaCapa.redimensionar:
        if (this.servicioCapas.isSelected && this.servicioCapas.eventoActual === eventoCanvas.isResize) {
          this.servicioCapas.resizeTrazo(this.puntoB);
        }
        break;
      case HerramientaCapa.moverTrazo:
        if (this.servicioCapas.isSelected && this.servicioCapas.eventoActual === eventoCanvas.isMove) {
          this.puntoA = this.servicioCapas.moverTrazo(this.puntoA, this.puntoB);
        }
        break;
      case HerramientaCapa.rotar:
        if (this.servicioCapas.isSelected && this.servicioCapas.eventoActual === eventoCanvas.isRotate) {
          this.servicioCapas.rotarTrazo(this.puntoB);
        }
        break;
      default:
        if (this.servicioCapas.eventoActual === eventoCanvas.isDrawin) {
          this.servicioCapas.setCapa(this.puntoA, this.puntoB);
        }
        break;
    }
  }

  /**El click de mouse es saltado */
  public oMouseUp(canvas: HTMLElement, $event) {
    switch (this.herramientaActiva) {
      case HerramientaCapa.redimensionar:
        if (this.servicioCapas.isSelected && this.servicioCapas.eventoActual === eventoCanvas.isResize) {
          this.servicioCapas.resizeTrazo(this.puntoB);
          /**Cuando se suelta el clic del se acaba el evento de redimensionar  */
          this.servicioCapas.eventoActual = eventoCanvas.sinEvento;
        }
        break;
      case HerramientaCapa.moverTrazo:
        if (this.servicioCapas.isSelected && this.servicioCapas.eventoActual === eventoCanvas.isMove) {
          this.servicioCapas.moverTrazo(this.puntoA, this.puntoB);
          this.servicioCapas.eventoActual = eventoCanvas.sinEvento;
        }
        break;
      case HerramientaCapa.rotar:
        if (this.servicioCapas.isSelected && this.servicioCapas.eventoActual === eventoCanvas.isRotate) {
          this.servicioCapas.rotarTrazo(this.puntoB);
          this.servicioCapas.eventoActual = eventoCanvas.sinEvento;
        }
        break;
      default:
        if (this.servicioCapas.eventoActual === eventoCanvas.isDrawin) {
          this.servicioCapas.eventoActual = eventoCanvas.sinEvento;
          this.servicioCapas.setCapa(this.puntoA, this.puntoB);
        }
        break;
    }
  }


  get trazoActive(): TipoTrazo {
    return this.servicioCapas.trazoActiva;
  }
  get herramientaActiva(): HerramientaCapa {
    return this.servicioCapas.herramientaActiva;
  }

  src = "assets/img.png";
  private margenError = 15;
  private puntoA: ParCoordenada = { x: 0, y: 0 };
  private puntoB: ParCoordenada = { x: 0, y: 0 };
}
