import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ElementRef,
  HostListener,
  NgZone,
  ViewChild,
  Input,
  ViewEncapsulation
} from '@angular/core';

interface Particle {
  id: number;
  fillStyle: string | CanvasGradient | CanvasPattern;
  viewPosition: Coordinates;
}

interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'heart-parametric-particles',
  template: `<canvas #heart class="heart" width="100" height="100" ></canvas>`,
  // styles: [`#heart { position: fixed; top: 0; left: 0; z-index: -1; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HeartParametricParticlesComponent implements OnInit {

  constructor(private ngZone: NgZone) { }

  @Input('options') options: any = {};

  @ViewChild('heart', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = this.canvas.nativeElement.width = window.innerWidth;
    this.height = this.canvas.nativeElement.height = window.innerHeight;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  ctx!: CanvasRenderingContext2D;
  width!: number;
  height!: number;
  heartPlotPoints!: Coordinates[];
  particles: Particle[] = [];

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.onResize(null);

    this.heartPlotPoints = this.getPointsOfHeart();
    this.particles = this.createParticles(this.heartPlotPoints);

    this.ngZone.runOutsideAngular(() => this.loop());
  }

  loop() {
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.particles.forEach((particle) => this.drawParticle(particle));
    this.ctx.fillStyle = 'rgb(255,255,255)';

    requestAnimationFrame(() => this.loop());
  }

  drawParticle(particle: Particle) {
    this.ctx.fillStyle = particle.fillStyle;
    this.ctx.fillRect(particle.viewPosition.x, particle.viewPosition.y, 5, 5);
  }

  getPointsOfHeart(timeDelta = 0.1): Coordinates[] {
    const points: Coordinates[] = [];
    for (let rad = 0; rad < Math.PI * 2; rad += timeDelta) {
      points.push(this.scaleAndTranslate(this.heartParametric(rad), 210, 13, 0, 0));
    }
    return points;
  }

  createParticles(plotPoints: Coordinates[]): Particle[] {
    const particles: Particle[] = [];
    plotPoints.forEach((point, i) => {
      particles.push({
        id: i,
        fillStyle: 'rgb(0,0,0)',
        viewPosition: {
          x: ~~(point.x),
          y: ~~(point.y)
        }
      });
    });
    return particles;
  }

  scaleAndTranslate(pos: Coordinates, sx: number, sy: number, dx: number, dy: number): Coordinates {
    const centerWidth = this.width * 0.5;
    const centerHeight = this.height * 0.5;
    return {
      x: (dx + pos.x * sx) + centerWidth,
      y: (dy + pos.y * sy) + centerHeight
    };
  };

  heartParametric(rad: number): Coordinates {
    return {
      x: Math.pow(Math.sin(rad), 3),
      y: -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
    }
  };

  getRandomArbitary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  getRandomArbitaryFloor(min: number, max: number): number {
    return ~~(Math.random() * (max - min + 1)) + min;
  }
}
