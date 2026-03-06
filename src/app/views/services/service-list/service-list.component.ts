import { Component, HostListener, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {

  scrollY = 0;

  services = [
    {
      icon: 'fa-hard-hat',
      title: 'General Construction',
      description: 'We offer comprehensive general construction services for residential, commercial, and industrial projects. Our expert team ensures quality workmanship from foundation to finishing.',
      keyFeatures: ['Site preparation', 'Foundation work', 'Structural framing', 'Interior/exterior finishing', 'Quality control']
    },
    {
      icon: 'fa-road',
      title: 'Road Works',
      description: 'Specialized road construction and maintenance services including asphalt paving, concrete roads, and road rehabilitation. We deliver durable infrastructure for smooth transportation.',
      keyFeatures: ['Asphalt paving', 'Concrete road construction', 'Road maintenance', 'Traffic management', 'Drainage systems']
    },
    {
      icon: 'fa-building',
      title: 'Building Works',
      description: 'Professional building construction services with focus on safety, quality, and timely delivery. We handle all aspects from design to completion.',
      keyFeatures: ['Residential buildings', 'Commercial complexes', 'Industrial facilities', 'Renovations', 'Extensions']
    },
    {
      icon: 'fa-water',
      title: 'Water Works',
      description: 'Comprehensive water infrastructure solutions including water supply systems, drainage, and sewage treatment. We ensure reliable water management for communities.',
      keyFeatures: ['Water supply networks', 'Drainage systems', 'Sewage treatment', 'Pump stations', 'Pipeline installation']
    },
    {
      icon: 'fa-bolt',
      title: 'Electrical Works',
      description: 'Complete electrical solutions for residential, commercial, and industrial projects. Our licensed electricians ensure safe and efficient electrical installations.',
      keyFeatures: ['Wiring and cabling', 'Power distribution', 'Lighting systems', 'Electrical maintenance', 'Safety inspections']
    },
    {
      icon: 'fa-cogs',
      title: 'Mechanical Works',
      description: 'Mechanical engineering and installation services for HVAC systems, plumbing, and industrial machinery. We optimize systems for efficiency and reliability.',
      keyFeatures: ['HVAC systems', 'Plumbing installations', 'Industrial machinery', 'Maintenance services', 'Energy efficiency']
    },
    {
      icon: 'fa-file-invoice',
      title: 'Bill of Quantities (BOQ)',
      description: 'Accurate and detailed quantity surveying services including bill of quantities, cost estimation, and tender documentation.',
      keyFeatures: ['Quantity takeoff', 'Cost estimation', 'BOQ preparation', 'Tender documentation', 'Valuation services']
    },
    {
      icon: 'fa-chart-line',
      title: 'Project Management',
      description: 'Professional project management services to ensure your construction project is delivered on time, within budget, and to the highest quality standards.',
      keyFeatures: ['Project planning', 'Cost control', 'Schedule management', 'Quality assurance', 'Risk management']
    }
  ];

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    this.initAnimations();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY = window.scrollY;
  }

  initAnimations(): void {
    // Animate header
    gsap.from('.section-header', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.2
    });

    // Animate service cards with stagger
    gsap.from('.services-card', {
      duration: 0.8,
      y: 80,
      opacity: 0,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.services-cards-sec',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    // Animate cards on hover
    const cards = document.querySelectorAll('.services-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (event) => {
        const target = event.currentTarget as HTMLElement;
        gsap.to(target, {
          duration: 0.3,
          y: -10,
          scale: 1.02,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', (event) => {
        const target = event.currentTarget as HTMLElement;
        gsap.to(target, {
          duration: 0.3,
          y: 0,
          scale: 1,
          ease: 'power2.out'
        });
      });
    });
  }
}
