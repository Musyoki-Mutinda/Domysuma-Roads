import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/* IMPORT the shared project categories */
import { PROJECT_CATEGORIES } from '../../shared/data/project-categories.data'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  /* BLOG DATA */
  featuredBlogs: any[] = [];
  loading = true;
  error = false;

  /* CATEGORY PREVIEW — loaded from shared file */
  categoriesPreview: any[] = [];

  /* ============================================ */
  /* REMOVED: Old Hero Carousel Variables */
  /* The parallax-hero component handles this now */
  /* ============================================ */

  /* CATEGORY CAROUSEL FOR MOBILE */
  currentCategoryIndex = 0;
  private categoryInterval!: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient, private router: Router) {}

  /* TYPING EFFECT */
  currentWord = '';
  private fullWord = 'Building & Road Works';
  private isDeleting = false;
  private typingSpeed = 150;
  private deletingSpeed = 100;
  private pauseTime = 1500;

  ngOnInit(): void {
    // Removed: this.startCarousel() - no longer needed
    this.startCategoryCarousel();
    this.fetchFeaturedBlogs();
    this.typeEffect();

    /* Load only first 4 categories from shared source */
    this.categoriesPreview = PROJECT_CATEGORIES.slice(0, 4);
  }

  /** Typing animation for the "Construction" text in "Why Choose Us" section */
  typeEffect(): void {
    const full = this.fullWord;

    if (this.isDeleting) {
      this.currentWord = full.substring(0, this.currentWord.length - 1);
    } else {
      this.currentWord = full.substring(0, this.currentWord.length + 1);
    }

    let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.currentWord === full) {
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentWord === '') {
      this.isDeleting = false;
      delay = 800;
    }

    setTimeout(() => this.typeEffect(), delay);
  }

  ngOnDestroy(): void {
    // Removed: carousel interval cleanup - no longer needed
    if (this.categoryInterval) {
      clearInterval(this.categoryInterval);
    }
  }

  /* ============================================ */
  /* REMOVED: Old Hero Carousel Methods */
  /* startCarousel() and selectSlide() - no longer needed */
  /* ============================================ */

  /* CATEGORY CAROUSEL LOGIC (For Mobile Projects Preview) */
  startCategoryCarousel(): void {
    if (this.categoryInterval) clearInterval(this.categoryInterval);
    this.currentCategoryIndex = 0;

    this.categoryInterval = setInterval(() => {
      this.currentCategoryIndex = (this.currentCategoryIndex + 1) % this.categoriesPreview.length;
    }, 5000); // Change every 5 seconds
  }

  selectCategorySlide(index: number): void {
    this.currentCategoryIndex = index;
  }

  /* BLOG FETCHING */
  fetchFeaturedBlogs(): void {
    const rssToJsonUrl =
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed.xml';

    this.http.get<any>(rssToJsonUrl).subscribe({
      next: (res) => {
        if (res.status === 'ok' && res.items?.length) {
          this.featuredBlogs = res.items.slice(0, 2).map((item: any) => ({
            title: item.title,
            author: item.author || 'ArchDaily',
            date: new Date(item.pubDate),
            image: item.enclosure?.link || '/assets/images/placeholder.jpg',
            excerpt: item.contentSnippet || '',
            link: item.link
          }));
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching blog feed:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  openPost(url: string): void {
    window.open(url, '_blank');
  }

  /* CATEGORY NAVIGATION USED IN TEMPLATE */
  openCategory(slug: string): void {
    this.router.navigate(['/category', slug]);
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Magnetic effect on buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button');
    
    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const distance = Math.sqrt(x * x + y * y);
      
      if (distance < 100) {
        const strength = (100 - distance) / 100;
        (button as HTMLElement).style.transform = `translate(${x * strength * 0.3}px, ${y * strength * 0.3}px)`;
      } else {
        (button as HTMLElement).style.transform = 'translate(0, 0)';
      }
    });
  }
}