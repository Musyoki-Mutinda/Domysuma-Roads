import {
  Component, OnInit, OnDestroy, AfterViewInit,
  HostListener, ElementRef, ViewChild, NgZone
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface LetterItem {
  char: string;
  visible: boolean;
  color: 'orange' | 'white' | 'yellow';
}

@Component({
  selector: 'app-parallax-hero',
  templateUrl: './parallax-hero.component.html',
  styleUrls: ['./parallax-hero.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ParallaxHeroComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Parallax ──────────────────────────────────────────────────────────────
  scrollY = 0;

  // ── Letter data ───────────────────────────────────────────────────────────
  row1Letters: LetterItem[] = [];
  row2Letters: LetterItem[] = [];
  private row1Text = 'DOMYSUMA BUILDING & ROAD WORKS';
  private row2Text = 'CONSTRUCTION COMPANY LTD';

  // ── Vehicle render + animation state ─────────────────────────────────────
  isTruckActive   = false;
  isTruckDriving  = false;
  isTipping       = false;

  isRollerActive  = false;
  isRollerDriving = false;

  // ── Completion flag ───────────────────────────────────────────────────────
  animationComplete = false;

  // ── Timing constants — MUST match CSS animation-duration values ───────────
  private readonly TRUCK_DURATION_MS  = 4000;
  private readonly ROLLER_DURATION_MS = 4000;
  // How many ms AFTER the vehicle passes each character before it appears
  private readonly TRAIL_DELAY_MS = 120;

  // ── DOM refs ──────────────────────────────────────────────────────────────
  @ViewChild('row1Track') row1TrackRef!: ElementRef<HTMLElement>;
  @ViewChild('row2Track') row2TrackRef!: ElementRef<HTMLElement>;

  private timeouts: ReturnType<typeof setTimeout>[] = [];

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void { this.buildLetterArrays(); }

  ngAfterViewInit(): void {
    setTimeout(() => this.startTipperTruck(), 600);
  }

  ngOnDestroy(): void {
    this.timeouts.forEach(t => clearTimeout(t));
  }

  private buildLetterArrays(): void {
    const ampIndex = this.row1Text.indexOf('&');
    this.row1Letters = this.row1Text.split('').map((char, i) => ({
      char,
      visible: false,
      color: 'white' as 'white'
    }));
    this.row2Letters = this.row2Text.split('').map(char => ({
      char,
      visible: false,
      color: 'white' as const
    }));
  }

  // ── PHASE 1: Tipper Truck ─────────────────────────────────────────────────
  // Vehicle travels from -100vw (off left) to +100vw (off right).
  // Total travel distance = 2 × viewport width.
  // We measure the text block's actual screen position so letter reveals fire
  // exactly when the truck physically crosses each character — plus the trail offset.

  private startTipperTruck(): void {
    this.isTruckActive = true;
    const totalChars = this.row1Letters.length;

    setTimeout(() => { this.isTruckDriving = true; }, 30);

    this.ngZone.runOutsideAngular(() => {
      const vw         = window.innerWidth;
      const trackEl    = this.row1TrackRef?.nativeElement;
      const trackRect  = trackEl?.getBoundingClientRect();
      const trackLeft  = trackRect?.left  ?? (vw - vw * 0.7) / 2;
      const trackWidth = trackRect?.width ?? vw * 0.7;

      // The CSS animation moves the truck from translateX(-100vw - 4em)
      // to translateX(+100vw + 4em). The total pixel travel is ~2vw + icon width.
      // We approximate total travel as 2 × vw (icon offset is small vs vw).
      const totalTravel = 2 * vw;

      // Fraction of total travel when truck reaches the LEFT edge of the text
      const textStartFraction = (vw + trackLeft) / totalTravel;
      // Fraction when truck reaches the RIGHT edge of the text
      const textEndFraction   = (vw + trackLeft + trackWidth) / totalTravel;

      for (let i = 0; i < totalChars; i++) {
        // Character i is at a proportional position within the text block
        const charFraction = textStartFraction +
          (i / totalChars) * (textEndFraction - textStartFraction);
        const fireAt = charFraction * this.TRUCK_DURATION_MS + this.TRAIL_DELAY_MS;

        const t = setTimeout(() => {
          this.ngZone.run(() => {
            this.row1Letters[i].visible = true;
            this.isTipping = true;
            setTimeout(() => { this.isTipping = false; }, 250);
          });
        }, fireAt);
        this.timeouts.push(t);
      }

      const exitT = setTimeout(() => {
        this.ngZone.run(() => {
          this.isTruckDriving = false;
          setTimeout(() => {
            this.isTruckActive = false;
            setTimeout(() => this.startRoadRoller(), 400);
          }, 300);
        });
      }, this.TRUCK_DURATION_MS + 200);
      this.timeouts.push(exitT);
    });
  }

  // ── PHASE 2: Road Roller ──────────────────────────────────────────────────
  // Roller enters from the RIGHT (+100vw), drives LEFT, exits off the left (-100vw).
  // It passes the RIGHTMOST character first, so we reveal letters right→left
  // (charIndex = totalChars - 1 - i).

  private startRoadRoller(): void {
    this.isRollerActive = true;
    const totalChars = this.row2Letters.length;

    setTimeout(() => { this.isRollerDriving = true; }, 30);

    this.ngZone.runOutsideAngular(() => {
      const vw         = window.innerWidth;
      const trackEl    = this.row2TrackRef?.nativeElement;
      const trackRect  = trackEl?.getBoundingClientRect();
      const trackRight = trackRect ? vw - trackRect.right : (vw - vw * 0.5) / 2;
      const trackWidth = trackRect?.width ?? vw * 0.5;

      const totalTravel = 2 * vw;

      // Fraction when roller reaches the RIGHT edge of the text (first contact)
      const textStartFraction = (vw + trackRight) / totalTravel;
      // Fraction when roller reaches the LEFT edge of the text (last contact)
      const textEndFraction   = (vw + trackRight + trackWidth) / totalTravel;

      for (let i = 0; i < totalChars; i++) {
        // i=0 → rightmost char (roller hits it first as it moves left)
        const charFraction = textStartFraction +
          (i / totalChars) * (textEndFraction - textStartFraction);
        const fireAt = charFraction * this.ROLLER_DURATION_MS + this.TRAIL_DELAY_MS;
        const charIndex = totalChars - 1 - i; // rightmost first

        const t = setTimeout(() => {
          this.ngZone.run(() => {
            this.row2Letters[charIndex].visible = true;
          });
        }, fireAt);
        this.timeouts.push(t);
      }

      const exitT = setTimeout(() => {
        this.ngZone.run(() => {
          this.isRollerDriving = false;
          setTimeout(() => {
            this.isRollerActive    = false;
            this.animationComplete = true;
          }, 300);
        });
      }, this.ROLLER_DURATION_MS + 200);
      this.timeouts.push(exitT);
    });
  }

  // ── Scroll ────────────────────────────────────────────────────────────────

  @HostListener('window:scroll', ['$event'])
  onScroll(_event: Event): void {
    this.scrollY = window.scrollY;
  }
}