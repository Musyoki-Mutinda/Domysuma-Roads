import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  blogPosts: any[] = [];
  rssPosts: any[] = [];
  allPosts: any[] = [];
  loading = true;
  error = false;

  categories = ['All', 'Residential', 'Commercial', 'Interior', 'Urban', 'Sustainability'];
  selectedCategory = 'All';

  localPosts = [
    {
      title: 'Modern House Design in Nairobi',
      author: 'Leone Mutinda',
      date: new Date('2025-09-01'),
      image: '/assets/images/blog1.jpg',
      excerpt: 'A look into modern residential architecture inspired by minimalism.',
      category: 'Residential',
      link: '/blog/modern-house-nairobi'
    },
    {
      title: 'Sustainable Building Practices in Kenya',
      author: 'Domysuma Team',
      date: new Date('2025-08-20'),
      image: '/assets/images/blog2.jpg',
      excerpt: 'Exploring eco-friendly materials shaping construction in East Africa.',
      category: 'Sustainability',
      link: '/blog/sustainable-building-kenya'
    },
    {
      title: 'The Future of Urban Planning in Africa',
      author: 'Domysuma Insights',
      date: new Date('2025-07-15'),
      image: '/assets/images/blog3.jpg',
      excerpt: 'A vision for more sustainable, people-centered African cities.',
      category: 'Urban',
      link: '/blog/urban-planning-africa'
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRSSFeed();
  }

  fetchRSSFeed(): void {
    const rssUrl = 'https://constructionkenyashowcase.com/feed/';
    const proxyUrl = 'https://corsproxy.io/?';
    const fullUrl = proxyUrl + encodeURIComponent(rssUrl);

    this.http.get(fullUrl, { responseType: 'text' }).subscribe({
      next: (xmlText) => {
        this.rssPosts = this.parseRSS(xmlText);

        if (this.rssPosts.length > 0) {
          this.allPosts = [...this.rssPosts];
        } else {
          this.allPosts = [...this.localPosts];
        }

        this.blogPosts = this.allPosts;
        this.loading = false;
      },
      error: (err) => {
        console.error('RSS fetch failed:', err);
        this.error = true;
        this.allPosts = [...this.localPosts];
        this.blogPosts = this.allPosts;
        this.loading = false;
      }
    });
  }

  parseRSS(xmlText: string): any[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');

      return Array.from(items).map(item => {
        const title = item.querySelector('title')?.textContent || 'Untitled';

        // FIX: <link> in RSS is a sibling text node, not a child element.
        // querySelector('link') can grab wrong nodes. Walk child nodes instead.
        const link = this.getLinkFromItem(item);

        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        const description = item.querySelector('description')?.textContent || '';

        // FIX: content:encoded needs namespace-aware lookup
        const contentEncoded = this.getContentEncoded(item);
        const creator = this.getDcCreator(item);

        const rawContent = contentEncoded || description;

        return {
          title: title.trim(),
          author: creator,
          date: new Date(pubDate),
          image: this.getImage(item, rawContent),
          excerpt: this.extractExcerpt(rawContent),
          link: link,
          category: this.detectCategory(title)
        };
      });

    } catch (error) {
      console.error('RSS parsing error:', error);
      return [];
    }
  }

  // FIX: Walk child nodes to safely get <link> text (it's a text sibling in RSS)
  private getLinkFromItem(item: Element): string {
    const children = Array.from(item.childNodes);
    for (const node of children) {
      if (node.nodeName === 'link') {
        // In RSS 2.0, <link> text is often in a following sibling text node
        const next = node.nextSibling;
        if (next && next.nodeType === Node.TEXT_NODE && next.textContent?.trim()) {
          return next.textContent.trim();
        }
        if (node.textContent?.trim()) {
          return node.textContent.trim();
        }
      }
    }
    return item.querySelector('link')?.textContent?.trim() || '#';
  }

  // FIX: Use getElementsByTagNameNS for namespaced elements — querySelector('content\\:encoded') is unreliable cross-browser
  private getContentEncoded(item: Element): string {
    // Try namespace-aware lookup first
    const ns = 'http://purl.org/rss/1.0/modules/content/';
    const el = item.getElementsByTagNameNS(ns, 'encoded')[0];
    if (el?.textContent) return el.textContent;

    // Fallback: some parsers strip namespace, try direct tag name
    const fallback = item.getElementsByTagName('content:encoded')[0];
    if (fallback?.textContent) return fallback.textContent;

    return '';
  }

  // FIX: Same namespace issue for dc:creator
  private getDcCreator(item: Element): string {
    const ns = 'http://purl.org/dc/elements/1.1/';
    const el = item.getElementsByTagNameNS(ns, 'creator')[0];
    if (el?.textContent) return el.textContent.trim();

    const fallback = item.getElementsByTagName('dc:creator')[0];
    if (fallback?.textContent) return fallback.textContent.trim();

    return 'Construction Kenya Showcase';
  }

  // FIX: Use getElementsByTagNameNS for media:thumbnail and media:content
  private getImage(item: Element, content: string): string {
    const mediaNs = 'http://search.yahoo.com/mrss/';

    // 1. media:thumbnail (most common in WordPress feeds)
    const thumbnail = item.getElementsByTagNameNS(mediaNs, 'thumbnail')[0];
    if (thumbnail?.getAttribute('url')) {
      return this.ensureHttps(thumbnail.getAttribute('url')!);
    }

    // 2. media:content
    const mediaContent = item.getElementsByTagNameNS(mediaNs, 'content')[0];
    if (mediaContent?.getAttribute('url')) {
      return this.ensureHttps(mediaContent.getAttribute('url')!);
    }

    // 3. Enclosure (standard RSS image attach)
    const enclosure = item.querySelector('enclosure');
    if (enclosure?.getAttribute('url')) {
      return this.ensureHttps(enclosure.getAttribute('url')!);
    }

    // 4. Parse first <img src="..."> from HTML content
    if (content) {
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch?.[1]) {
        return this.ensureHttps(imgMatch[1]);
      }
    }

    // 5. Try WordPress featured image in description CDATA
    const desc = item.querySelector('description')?.textContent || '';
    const descMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (descMatch?.[1]) {
      return this.ensureHttps(descMatch[1]);
    }

    return '';
  }

  private ensureHttps(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://')) return url.replace('http://', 'https://');
    if (url.startsWith('/')) return `https://constructionkenyashowcase.com${url}`;
    return url;
  }

  private extractExcerpt(content: string): string {
    const stripped = content.replace(/<[^>]+>/g, '').trim();
    return stripped.length > 180 ? stripped.slice(0, 180) + '...' : stripped;
  }

  private detectCategory(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('residential') || lower.includes('house')) return 'Residential';
    if (lower.includes('office') || lower.includes('commercial')) return 'Commercial';
    if (lower.includes('interior')) return 'Interior';
    if (lower.includes('urban')) return 'Urban';
    if (lower.includes('sustain') || lower.includes('green')) return 'Sustainability';
    return 'All';
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.blogPosts = category === 'All'
      ? this.allPosts
      : this.allPosts.filter(post => post.category === category);
  }

  // Inline SVG placeholder — no external file needed, prevents 404 loop
  private readonly PLACEHOLDER_SVG =
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E` +
    `%3Crect width='400' height='250' fill='%23e8e8e8'/%3E` +
    `%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' ` +
    `font-family='sans-serif' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;

  private readonly IMAGE_PROXY = 'https://corsproxy.io/?';

  // Two-stage fallback:
  // Stage 1: direct URL failed → retry through CORS proxy
  // Stage 2: proxy also failed → show inline SVG placeholder
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    // Already showing placeholder — stop to prevent infinite loop
    if (img.src.startsWith('data:image/svg+xml')) return;

    // Already tried proxy — give up and show placeholder
    if (img.src.startsWith(this.IMAGE_PROXY)) {
      img.src = this.PLACEHOLDER_SVG;
      return;
    }

    // First failure: retry through CORS proxy
    const originalSrc = img.getAttribute('data-original-src') || img.src;
    img.setAttribute('data-original-src', originalSrc);
    img.src = this.IMAGE_PROXY + encodeURIComponent(originalSrc);
  }

  testRSSFeed(): void {
    this.fetchRSSFeed();
  }
}