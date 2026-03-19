import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit, OnDestroy {
  careerImages: string[] = [
    'assets/careers/Careers7.jpg',
    'assets/careers/Careers2.jpg',
    'assets/careers/Careers3.jpg',
    'assets/careers/Careers4.jpg',
    'assets/careers/Careers5.jpg',
    'assets/careers/Careers6.jpg',
    'assets/careers/Careers1.jpg'
  ];

  // Background slideshow index
  bgImageIndex: number = 0;

  bgSlideInterval: any;

  ngOnInit(): void {
    this.startBackgroundSlideshow();
  }

  ngOnDestroy(): void {
    if (this.bgSlideInterval) {
      clearInterval(this.bgSlideInterval);
    }
  }

  startBackgroundSlideshow(): void {
    this.bgSlideInterval = setInterval(() => {
      this.nextBackgroundImage();
    }, 5000);
  }

  nextBackgroundImage(): void {
    const total = this.careerImages.length;
    this.bgImageIndex = (this.bgImageIndex + 1) % total;
  }

  navigateToCareers(): void {
    window.open('https://domysumaarchitects.co.ke/careers', '_blank');
  }
}