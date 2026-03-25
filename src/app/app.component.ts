import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';
import * as AOS from 'aos';
import { SmoothScrollService } from './core/services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { '[class.loading]': 'isLoading' },
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'domysuma';
  isLoading = true;
  showPage = false;

  @ViewChild('stageRef') stage!: ElementRef;
  @ViewChild('gridRef') grid!: ElementRef;
  @ViewChild('placeholderRef') placeholder!: ElementRef;
  @ViewChild('wrapperRef') wrapper!: ElementRef;
  @ViewChild('rollingElRef') rollingEl!: ElementRef;
  @ViewChild('roofRef') roof!: ElementRef;
  @ViewChild('barRef') bar!: ElementRef;
  @ViewChild('loaderRef') loader!: ElementRef;

  constructor(private smoothScroll: SmoothScrollService) {}

  ngOnInit(): void {
    // Initialize smooth scroll
    this.smoothScroll.init();

    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  }

  ngAfterViewInit(): void {
    if (this.isLoading) {
      this.startLoading();
    }
  }

  ngOnDestroy(): void {
    this.smoothScroll.destroy();
  }

  private startLoading(): void {
    /* ── measurements ── */
    const SIZE   = 55;   // px – must match CSS --block-size
    const GAP    =   8;   // px – must match CSS --gap
    const RADIUS =  18;   // px

    const stage       = this.stage.nativeElement;
    const grid        = this.grid.nativeElement;
    const placeholder = this.placeholder.nativeElement;
    const wrapper     = this.wrapper.nativeElement;
    const rollingEl   = this.rollingEl.nativeElement;
    const roof        = this.roof.nativeElement;
    const bar         = this.bar.nativeElement;
    const loader      = this.loader.nativeElement;

    /* position rolling block at the TR cell's location,
       but starting far below the grid                    */
    function positionRolling () {
      const gridRect  = grid.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const phRect    = placeholder.getBoundingClientRect();

      // target position relative to #stage
      const targetLeft = phRect.left - stageRect.left;
      const targetTop  = phRect.top  - stageRect.top;

      wrapper.style.position = 'absolute';
      wrapper.style.left     = targetLeft + 'px';
      wrapper.style.top      = targetTop  + 'px';
      wrapper.style.width    = SIZE + 'px';
      wrapper.style.height   = SIZE + 'px';
    }

    positionRolling();

    /* ── easing helpers ── */
    function easeOutBack(t: number) {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    }

    function animate({ duration, easing = (t: number) => t, onUpdate, onComplete }: { duration: number, easing?: (t: number) => number, onUpdate: (t: number, raw: number) => void, onComplete?: () => void }) {
      const start = performance.now();
      function frame(now: number) {
        const raw = Math.min((now - start) / duration, 1);
        onUpdate(easing(raw), raw);
        if (raw < 1) requestAnimationFrame(frame);
        else onComplete && onComplete();
      }
      requestAnimationFrame(frame);
    }

    /* ── SEQUENCE ── */

    // Phase 0 – small pause then start rolling
    const PHASE_DELAY = 400;   // ms before animation starts
    const PHASE_RISE = 900;   // ms block rises from below
    const PHASE_SETTLE = 0;    // built into easeOutBack
    const PHASE_ROOF = 600;   // ms roof descends
    const PHASE_HOLD = 400;   // ms everything holds
    const PHASE_FADE = 500;   // ms fade-out

    // Total fake "load" we simulate while animating
    let progressValue = 0;
    function setProgress(p: number) {
      progressValue = Math.min(p, 100);
      bar.style.width = progressValue + '%';
    }

    // Smoothly drive progress to a target over duration
    function driveProgress(from: number, to: number, duration: number, cb?: () => void) {
      animate({
        duration,
        easing: easeInOutCubic,
        onUpdate: (t) => setProgress(from + (to - from) * t),
        onComplete: cb
      });
    }

    /* The rolling block starts below the grid and rises up with a roll */
    function phaseRise(onDone: () => void) {
      const startY   =  SIZE * 1.8;   // starts below the grid
      const endY     = 0;
      let   rotation = 0;

      animate({
        duration: PHASE_RISE,
        easing: easeOutBack,
        onUpdate: (t, raw) => {
          const y   = startY * (1 - t);
          const rot = 360 * raw;           // one full roll
          rollingEl.style.transform = `translateY(${y}px) rotate(${-rot}deg)`;
          // also move the wrapper up from below the stage
          wrapper.style.transform = `translateY(${y}px)`;
        },
        onComplete: () => {
          rollingEl.style.transform = 'none';
          wrapper.style.transform   = 'none';
          // reveal placeholder now that block is in place
          placeholder.style.visibility = 'visible';
          placeholder.style.background = 'var(--blue)';
          wrapper.style.display = 'none';
          onDone();
        }
      });
    }

    function phaseRoof(onDone: () => void) {
      animate({
        duration: PHASE_ROOF,
        easing: easeOutCubic,
        onUpdate: (t) => {
          roof.style.opacity   = t.toString();
          roof.style.transform = `translateY(${-40 * (1-t)}px)`;
        },
        onComplete: onDone
      });
    }

    /* start the whole thing */
    setTimeout(() => {

      // kick off a progress counter that fills to 85% while animating
      driveProgress(0, 85, PHASE_DELAY + PHASE_RISE + PHASE_ROOF + 200, undefined);

      // wait initial delay then animate block
      setTimeout(() => {
        phaseRise(() => {
          // after block lands, show roof
          setTimeout(() => {
            phaseRoof(() => {
              // fill progress to 100%
              driveProgress(85, 100, 350, () => {
                // hold a beat then fade loader
                setTimeout(() => {
                  loader.classList.add('fade-out');
                  setTimeout(() => {
                    loader.style.display = 'none';
                    // ← your real page content would appear here
                    this.showPage = true;
                    this.isLoading = false;
                  }, PHASE_FADE);
                }, PHASE_HOLD);
              });
            });
          }, 120);
        });
      }, PHASE_DELAY);

    }, 100);
  }
}