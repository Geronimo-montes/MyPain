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
      this.puntoA.x = $event.clientX - bounds.left - this.margenError;
      this.puntoA.y = $event.clientY - bounds.top - this.margenError;
      this.servicioCapas.isDrawin = true;
    } else {

    }
    /**Trazar capas */
    this.dibujarTrazos();
  }

  /** El cursor es movido dentro del elemento*/
  public oMouseMove(canvas: HTMLElement, $event) {
    /** Posicion del cursor */
    var bounds = canvas.getBoundingClientRect();
    this.setWidth.emit(~~($event.clientX - bounds.left));
    this.setHeight.emit(~~($event.clientY - bounds.top));
    /**Para dibujar la liena */
    this.puntoB.x = $event.clientX - bounds.left - this.margenError;
    this.puntoB.y = $event.clientY - bounds.top - this.margenError;
    /**Trazar capas */
    this.dibujarTrazos();
  }

  /**El click de mouse es saltado */
  public oMouseUp(canvas: HTMLElement, $event) {
    if (this.servicioCapas.isDrawin)
      this.setPoint();
  }

  /**El mouse se mueve fuera del elemento */
  public oMouseOver(canvas: HTMLElement, $event) {
    if (this.servicioCapas.isDrawin)
      this.setPoint();

  }

  /**Refactor. Metodo llamado oMouseDown y oMouseMove */
  private dibujarTrazos() {
    switch (this.buttonActive) {
      case TipoTrazo.linea:
        if (this.servicioCapas.isDrawin)
          this.servicioCapas.drawCapas(this.puntoA, this.puntoB);
        break;
      case TipoTrazo.lapiz:

        break;
      case TipoTrazo.pincel:

        break;
      case TipoTrazo.extractor:

        break;
    }
  }

  private setPoint() {
    this.servicioCapas.setNewPoint(this.puntoA, this.puntoB)
    this.servicioCapas.isDrawin = false;
    this.servicioCapas.drawCapas(this.puntoA, this.puntoB);
  }

  get buttonActive(): TipoTrazo {
    return this.servicioCapas.buttonActive;
  }

  private margenError = 15;

  private puntoA: ParCoordenada = { x: 0, y: 0 };
  private puntoB: ParCoordenada = { x: 0, y: 0 };
}
