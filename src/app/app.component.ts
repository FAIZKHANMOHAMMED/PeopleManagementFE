import { Component, OnInit, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'People Management System';
  currentRoute: string = '';
  isSidebarCollapsed = false;
  isMobileView = false;
  private routerSubscription: Subscription | undefined;
  private readonly MOBILE_BREAKPOINT = 991.98; // Bootstrap's lg breakpoint
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkViewport();
    }
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      // Close sidebar on mobile after navigation
      if (this.isMobileView) {
        this.isSidebarCollapsed = false;
        this.toggleBodyClass(false);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isBrowser) {
      this.checkViewport();
    }
  }

  private checkViewport() {
    if (!this.isBrowser) return;
    
    const wasMobileView = this.isMobileView;
    this.isMobileView = window.innerWidth <= this.MOBILE_BREAKPOINT;
    
    // If switching to mobile view, ensure sidebar is closed
    if (this.isMobileView && !wasMobileView) {
      this.isSidebarCollapsed = false;
      this.toggleBodyClass(false);
    }
  }

  private toggleBodyClass(add: boolean) {
    if (!this.isBrowser) return;
    
    if (add) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.toggleBodyClass(this.isSidebarCollapsed);
    
    // Prevent body scroll when sidebar is open on mobile
    if (this.isMobileView) {
      document.body.style.overflow = this.isSidebarCollapsed ? 'hidden' : '';
    }
  }

  getPageTitle(): string {
    if (this.currentRoute.includes('add')) {
      return 'Add New Person';
    } else if (this.currentRoute.includes('edit')) {
      return 'Edit Person';
    } else if (this.currentRoute.includes('people')) {
      return 'People List';
    }
    return 'Dashboard';
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    // Reset body styles
    if (this.isBrowser) {
      document.body.style.overflow = '';
      this.toggleBodyClass(false);
    }
  }
}
