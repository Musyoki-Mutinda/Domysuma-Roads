import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Equipment {
  name: string;
  icon: string;
  description: string;
  specs: string[];
  position: { x: number; y: number };
}

interface ParallaxScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  number: string;
  background: string;
  equipment?: Equipment[];
}

@Component({
  selector: 'app-parallax-storytelling',
  templateUrl: './parallax-storytelling.component.html',
  styleUrls: ['./parallax-storytelling.component.scss']
})
export class ParallaxStorytellingComponent implements OnInit, AfterViewInit, OnDestroy {

  currentScene = 0;
  scrollProgress = 0;
  selectedEquipment: Equipment | null = null;

  scenes: ParallaxScene[] = [
    {
      id: 'planning',
      number: '01',
      title: 'Planning & Vision',
      subtitle: 'Every Great Project Starts Here',
      description: 'Our expert team transforms your ideas into detailed, actionable construction plans. From initial site analysis to 3D modeling, we ensure every detail is perfect before breaking ground.',
      background: 'assets/carousel/carousel_1.jpg',
      equipment: [
        {
          name: '3D Modeling Software',
          icon: 'fa-cube',
          description: 'Advanced CAD and BIM tools for precise planning',
          specs: ['AutoCAD 2024', 'Revit Architecture', 'SketchUp Pro'],
          position: { x: 20, y: 60 }
        },
        {
          name: 'Survey Equipment',
          icon: 'fa-ruler-combined',
          description: 'High-precision surveying tools',
          specs: ['GPS Surveying', 'Total Station', '3D Laser Scanner'],
          position: { x: 80, y: 70 }
        }
      ]
    },
    {
      id: 'foundation',
      number: '02',
      title: 'Foundation Excellence',
      subtitle: 'Building On Solid Ground',
      description: 'Heavy machinery and expert crews work in perfect harmony. We use cutting-edge equipment and proven techniques to create foundations that last generations.',
      background: 'assets/carousel/carousel_2.jpg',
      equipment: [
        {
          name: 'CAT 320D Excavator',
          icon: 'fa-truck-monster',
          description: 'Heavy-duty excavator for deep excavation',
          specs: ['21 tons operating weight', '1.0m³ bucket capacity', '6.5m max dig depth'],
          position: { x: 30, y: 50 }
        },
        {
          name: 'Komatsu Bulldozer',
          icon: 'fa-tractor',
          description: 'Powerful bulldozer for land clearing',
          specs: ['20 tons', '3.9m³ blade capacity', 'GPS control system'],
          position: { x: 70, y: 55 }
        }
      ]
    },
    {
      id: 'construction',
      number: '03',
      title: 'Construction & Assembly',
      subtitle: 'Watch Your Vision Rise',
      description: 'Precision craftsmanship meets modern technology. Every beam, every bolt, every detail is executed with care. Our skilled workers bring your project to life.',
      background: 'assets/carousel/carousel_3.jpg',
      equipment: [
        {
          name: 'Tower Crane',
          icon: 'fa-helicopter',
          description: 'High-capacity tower crane',
          specs: ['50m height', '10 ton capacity', 'Remote operated'],
          position: { x: 50, y: 40 }
        },
        {
          name: 'Concrete Mixer',
          icon: 'fa-blender',
          description: 'High-volume concrete mixing',
          specs: ['12m³ capacity', 'Automated batching', 'Mobile unit'],
          position: { x: 25, y: 65 }
        }
      ]
    },
    {
      id: 'completion',
      number: '04',
      title: 'Project Completion',
      subtitle: 'Excellence Delivered',
      description: 'Your dream becomes reality. We deliver on time, on budget, and beyond expectations. Each completed project stands as a testament to our commitment.',
      background: 'assets/carousel/carousel_4.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initParallaxAnimations();
    }, 100);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.updateProgress();
  }

  updateProgress(): void {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = (window.scrollY / totalHeight) * 100;
    
    this.scenes.forEach((scene, index) => {
      const element = document.getElementById(`scene-${scene.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          this.currentScene = index;
        }
      }
    });
  }

  roundNumber(num: number): number {
    return Math.round(num);
  }

  initParallaxAnimations(): void {
    this.scenes.forEach((scene, index) => {
      const sceneId = `#scene-${scene.id}`;
      
      gsap.to(`${sceneId} .parallax-bg`, {
        y: () => window.innerHeight * 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: sceneId,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.from(`${sceneId} .scene-content`, {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
          trigger: sceneId,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        }
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sceneId,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });

      timeline
        .from(`${sceneId} .scene-number`, {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        })
        .from(`${sceneId} .scene-title`, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.3')
        .from(`${sceneId} .scene-subtitle`, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.5')
        .from(`${sceneId} .scene-description`, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.5');

      if (index === this.scenes.length - 1) {
        gsap.from(`${sceneId} .cta-button`, {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          delay: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sceneId,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    });
  }

  showEquipmentDetails(equipment: Equipment): void {
    this.selectedEquipment = equipment;
  }

  closeEquipmentModal(): void {
    this.selectedEquipment = null;
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
