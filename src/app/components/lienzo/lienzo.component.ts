import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { buttonsNavbar } from 'src/app/model/buttonsNavbar.model';
import { DibujarService } from 'src/app/services/dibujar.service';

@Component({
  selector: 'app-lienzo',
  templateUrl: './lienzo.component.html',
})
export class LienzoComponent implements AfterViewInit {

  @Output() setWidth = new EventEmitter<number>();
  @Output() setHeight = new EventEmitter<number>();
  @ViewChild('canvas', { static: false }) canvas: any;

  constructor(
    private servicioDibujar: DibujarService,
  ) { }

  ngAfterViewInit() {
    this.servicioDibujar.render(this.canvas.nativeElement);
  }


  public oMouseDown(canvas: HTMLElement, $event) {
    switch (this.buttonActive) {
      case buttonsNavbar.linea:
        if (!this.servicioDibujar.isDrawin) {
          var bounds = canvas.getBoundingClientRect();
          this.x = $event.clientX - bounds.left - this.margenError;
          this.y = $event.clientY - bounds.top - this.margenError;
          this.servicioDibujar.isAvailable = true;
          this.servicioDibujar.isDrawin = true;
        }
        this.servicioDibujar.drawLine(this.x, this.y, this.fx, this.fy);
        break;
      case buttonsNavbar.lapiz:

        break;
      case buttonsNavbar.pincel:

        break;
      case buttonsNavbar.extractor:

        break;
    }
  }

  public oMouseMove(canvas: HTMLElement, $event) {
    /** Posicion del cursor */
    var bounds = canvas.getBoundingClientRect();
    this.setWidth.emit($event.clientX - bounds.left);
    this.setHeight.emit($event.clientY - bounds.top);

    switch (this.buttonActive) {
      case buttonsNavbar.linea:
        /**Para dibujar la liena */
        this.fx = $event.clientX - bounds.left - this.margenError;
        this.fy = $event.clientY - bounds.top - this.margenError;

        if (this.servicioDibujar.isDrawin)
          this.servicioDibujar.drawLine(this.x, this.y, this.fx, this.fy);
        break;
      case buttonsNavbar.lapiz:

        break;
      case buttonsNavbar.pincel:

        break;
      case buttonsNavbar.extractor:
        break;

    }
  }

  public oMouseUp(canvas: HTMLElement, $event) {
    switch (this.buttonActive) {
      case buttonsNavbar.linea:
        if (this.servicioDibujar.isAvailable && this.servicioDibujar.isDrawin) {
          this.setPoint();
          this.servicioDibujar.drawLine(this.x, this.y, this.fx, this.fy);
        }
        break;
      case buttonsNavbar.lapiz:
        console.log('lapiz');
        break;
      case buttonsNavbar.pincel:
        console.log('pincel');
        break;
      case buttonsNavbar.extractor:
        console.log('chupador');
        break;
    }

  }

  /**
   * @description Setea un punto dentro del array de puntos y desactivas las banderas isDrawin
   * isAvailable
   */
  private setPoint() {
    this.servicioDibujar.setNewPoint(this.x, this.y, this.fx, this.fy)

    console.log(this.servicioDibujar._points);
    this.servicioDibujar.isDrawin = false;
    this.servicioDibujar.isAvailable = false;
  }

  get buttonActive(): buttonsNavbar {
    return this.servicioDibujar.buttonActive;
  }

  private margenError = 15;

  private x: number = 0;
  private y: number = 0;
  private fx: number = 0;
  private fy: number = 0;
}
