import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ParCoordenada } from 'src/app/model/capa.model';
import { TipoTrazo } from "src/app/model/tipo-trazo.model";
import { CapasService } from 'src/app/services/capas.service';

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
  }

  /**Se da clic al mouse dentro del elemento */
  public oMouseDown(canvas: HTMLElement, $event) {
    if (!this.servicioCapas.isDrawin) {
      var bounds = canvas.getBoundingClientRect();
      this.puntoA = {
        x: ~~(0.5 + ($event.clientX - bounds.left - this.margenError)),
        y: ~~(0.5 + ($event.clientY - bounds.top - this.margenError))
      };

      switch (this.buttonActive) {
        case TipoTrazo.linea:
        case TipoTrazo.lapiz:
        case TipoTrazo.circulo:
        case TipoTrazo.elipse:
        case TipoTrazo.cuadrado:
        case TipoTrazo.rectangulo:
        case TipoTrazo.pentagono:
        case TipoTrazo.hexagono:
        case TipoTrazo.octagono:
        case TipoTrazo.poligono:
        case TipoTrazo.triangulo:
          this.servicioCapas.isDrawin = true;
          this.servicioCapas.setNewCapa(this.puntoA, this.puntoA);
          break;

        case TipoTrazo.seleccionar:
          this.servicioCapas.seleccionarCapa(this.puntoA);
          break;

        case TipoTrazo.redimensionar:
          if (this.servicioCapas.isSelected) {
            if (!this.servicioCapas.seleccionarPuntoCapa(this.puntoA))
              this.servicioCapas.seleccionarCapa(this.puntoA);
          } else {
            this.servicioCapas.seleccionarCapa(this.puntoA);
          }
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

    switch (this.buttonActive) {
      case TipoTrazo.linea:
      case TipoTrazo.lapiz:
      case TipoTrazo.circulo:
      case TipoTrazo.elipse:
      case TipoTrazo.cuadrado:
      case TipoTrazo.rectangulo:
      case TipoTrazo.pentagono:
      case TipoTrazo.hexagono:
      case TipoTrazo.octagono:
      case TipoTrazo.poligono:
      case TipoTrazo.triangulo:
        if (this.servicioCapas.isDrawin)
          this.servicioCapas.setCapa(this.puntoA, this.puntoB);
        break;

      case TipoTrazo.redimensionar:
        if (this.servicioCapas.isSelected && (this.servicioCapas.isResizeA || this.servicioCapas.isResizeB)) {
          this.servicioCapas.setCapaResize(this.puntoB);
        }

        break;
    }
  }

  /**El click de mouse es saltado */
  public oMouseUp(canvas: HTMLElement, $event) {
    switch (this.buttonActive) {
      case TipoTrazo.linea:
      case TipoTrazo.lapiz:
      case TipoTrazo.circulo:
      case TipoTrazo.elipse:
      case TipoTrazo.cuadrado:
      case TipoTrazo.rectangulo:
      case TipoTrazo.pentagono:
      case TipoTrazo.hexagono:
      case TipoTrazo.octagono:
      case TipoTrazo.poligono:
      case TipoTrazo.triangulo:
        if (this.servicioCapas.isDrawin) {
          this.servicioCapas.isDrawin = false;
          this.servicioCapas.setCapa(this.puntoA, this.puntoB);
        }
        break;

      case TipoTrazo.redimensionar:
        if (this.servicioCapas.isSelected && (this.servicioCapas.isResizeA || this.servicioCapas.isResizeB)) {
          this.servicioCapas.setCapaResize(this.puntoB);
          /**Cuando se suelta el clic del se acaba el evento de redimensionar*/
          this.servicioCapas.isResizeA = false;
          this.servicioCapas.isResizeB = false;
        }

        break;
    }
  }

  /**El mouse se mueve fuera del elemento */
  public oMouseOver(canvas: HTMLElement, $event) {
    if (this.servicioCapas.isDrawin) {
      this.servicioCapas.isDrawin = false;
      this.servicioCapas.setCapa(this.puntoA, this.puntoB);
    }
  }

  get buttonActive(): TipoTrazo {
    return this.servicioCapas.buttonActive;
  }

  private margenError = 15;
  private puntoA: ParCoordenada = { x: 0, y: 0 };
  private puntoB: ParCoordenada = { x: 0, y: 0 };
}
