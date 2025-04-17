import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-article.component.html',
  styleUrls: ['./side-article.component.css']
})
export class SideArticleComponent {
  @Input() news: any;
}
