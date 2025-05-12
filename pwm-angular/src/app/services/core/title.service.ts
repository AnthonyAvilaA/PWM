import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ITitleService } from './interfaces/title-service.interface';

@Injectable({
  providedIn: 'root'
})
export class TitleService implements ITitleService {
  private readonly baseTitle = 'Argony News';

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Initialize the title service to update page title on route changes
   */
  initTitleService(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const routeTitle = data['title'];
      if (routeTitle) {
        this.setTitle(routeTitle);
      } else {
        // If no title is defined in the route data, use the path
        const path = this.router.url.split('/')[1];
        if (path) {
          const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
          this.setTitle(formattedPath);
        } else {
          this.setTitle('Home');
        }
      }
    });
  }

  /**
   * Set the document title with the base title and page name
   * @param pageTitle The page title to append
   */
  setTitle(pageTitle: string): void {
    this.title.setTitle(`${this.baseTitle} | ${pageTitle}`);
  }
}
