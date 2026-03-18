import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit, OnDestroy {
  careerImages: string[] = [
    'assets/careers/Careers1.jpg',
    'assets/careers/Careers2.jpg',
    'assets/careers/Careers3.jpg',
    'assets/careers/Careers4.jpg',
    'assets/careers/Careers5.jpg',
    'assets/careers/Careers6.jpg',
    'assets/careers/Careers7.jpg'
  ];
  
  currentImageIndex: number = 0;
  slideInterval: any;

  ngOnInit() {
    this.startSlideshow();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextImage();
    }, 4000); // Change image every 4 seconds
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.careerImages.length;
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
    // Restart the interval to ensure consistent timing after manual change
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startSlideshow();
  }

  navigateToCareers() {
    window.open('https://domysumaarchitects.co.ke/careers', '_blank');
  }
}
