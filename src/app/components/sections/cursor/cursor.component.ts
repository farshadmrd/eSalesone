import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cursor',
  standalone: true,
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.css']
})
export class CursorComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cursorElement', { static: false }) cursorRef!: ElementRef;

  private mouseX = 0;
  private mouseY = 0;
  private currentX = 0;
  private currentY = 0;
  private prevX = 0;
  private prevY = 0;
  private animationFrameId = 0;

  private lastMoveTime = Date.now();
  private moveTimeout = 200;

  private currentDotRadius = 0;
  private readonly edgeRadius = 6.5;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.cursorRef?.nativeElement) {
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('click', this.handleClick);
      this.animate();
    }
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.lastMoveTime = Date.now();
  };

  private handleClick = () => {
    const cursorEl = this.cursorRef.nativeElement;
    cursorEl.classList.add('tapped');

    setTimeout(() => {
      cursorEl.classList.remove('tapped');
    }, 400); // match CSS animation duration
  };

  private animate = () => {
    const now = Date.now();
    const isMoving = (now - this.lastMoveTime) < this.moveTimeout;

    this.prevX = this.currentX;
    this.prevY = this.currentY;

    this.currentX += (this.mouseX - this.currentX) * 0.1;
    this.currentY += (this.mouseY - this.currentY) * 0.1;

    const cursorEl: HTMLElement = this.cursorRef.nativeElement;
    cursorEl.style.transform = `translate(${this.currentX - 50}px, ${this.currentY - 50}px)`;

    const dx = this.currentX - this.prevX;
    const dy = this.currentY - this.prevY;
    const angle = Math.atan2(dy, dx);

    const targetRadius = isMoving ? this.edgeRadius : 0;
    this.currentDotRadius += (targetRadius - this.currentDotRadius) * 0.1;

    const dotX = 50 + this.currentDotRadius * Math.cos(angle);
    const dotY = 50 + this.currentDotRadius * Math.sin(angle);

    const svg = cursorEl.querySelector('svg');
    const centerDot = svg?.querySelector('#center-dot') as SVGCircleElement;
    const outerRing = svg?.querySelector('#outer-ring') as SVGCircleElement;

    if (centerDot) {
      centerDot.setAttribute('cx', dotX.toString());
      centerDot.setAttribute('cy', dotY.toString());
      centerDot.classList.toggle('moving', isMoving);
    }

    if (outerRing) {
      cursorEl.classList.toggle('moving-ring', isMoving);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public destroy() {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationFrameId);
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('click', this.handleClick);
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
