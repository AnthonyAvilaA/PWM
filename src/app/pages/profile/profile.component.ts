import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'main';
  loading: boolean = false;
  userData = {
    name: 'User Name',
    joinDate: '01/01/2023',
    location: 'City, Country',
    title: 'Member'
  };
  
  // UI preferences
  uiPreferences = {
    theme: 'default', // 'white', 'default', or 'dark'
    highContrast: false,
    enableKeyboardShortcuts: false
  };
  
  // Mock user publications
  userPublications = [
    {
      id: 1,
      title: 'Main News Headline',
      image: '/assets/images/placeholder.jpg',
      author: 'John Doe',
      location: 'New York',
      description: 'This is a sample description for the news article that would typically go here.'
    },
    {
      id: 2,
      title: 'Secondary News',
      image: '/assets/images/placeholder.jpg',
      author: 'Jane Smith',
      location: 'London'
    },
    {
      id: 3,
      title: 'Technology Update',
      image: '/assets/images/placeholder.jpg',
      author: 'Sam Wilson',
      location: 'San Francisco'
    },
    {
      id: 4,
      title: 'Sports Highlight',
      image: '/assets/images/placeholder.jpg',
      author: 'Alex Johnson',
      location: 'Chicago'
    },
    {
      id: 5,
      title: 'Politics News',
      image: '/assets/images/placeholder.jpg',
      author: 'Maria Garcia',
      location: 'Washington'
    }
  ];
  
  // Active section in options tab
  activeSection: string = 'editProfile';

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.setPageTitle();
    this.loading = false;
  }

  setPageTitle(): void {
    const title = this.translateService.instant('PROFILE.TITLE');
    this.titleService.setTitle(title);
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  showSection(section: string): void {
    this.activeSection = section;
  }

  saveProfile(): void {
    // Mock save profile function
    console.log('Profile saved');
    // Here you would typically make an API call to save the profile
  }

  saveUIPreferences(): void {
    // Mock save UI preferences function
    console.log('UI preferences saved', this.uiPreferences);
    // Here you would typically make an API call to save the UI preferences
  }
}
