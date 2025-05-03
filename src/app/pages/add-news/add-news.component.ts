import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NewsModel } from '@models/news.model';
import { NewsService } from '@services/core/news.service';
@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './add-news.component.html',
  styleUrl: './add-news.component.css'
})
export class AddNewsComponent {
  title: string = "";
  url: string = "";
  place: string = "";
  description: string = "";
  content: string = "";
  categories: string[] = [];
  image_link: string = 'assets/formato_imagen.png';
  errorMessage: string | null = null;
  isLoading: boolean = false;

  countries: string[] = [
    "albania", "alemania", "andorra", "armenia", "austria", "azerbaiyán",
    "bélgica", "bosnia y herzegovina", "bulgaria", "chipre", "croacia", "dinamarca",
    "eslovaquia", "eslovenia", "españa", "estonia", "finlandia", "francia",
    "georgia", "grecia", "hungría", "irlanda", "islandia", "italia", "kazajistán",
    "kosovo", "letonia", "liechtenstein", "lituania", "luxemburgo", "malta",
    "moldavia", "mónaco", "montenegro", "noruega", "países bajos", "polonia",
    "portugal", "reino unido", "república checa", "rumanía", "rusia", "san marino",
    "serbia", "suecia", "suiza", "tailandia", "turquía", "ucrania", "vaticano", "otros"
  ];

  onSelectCategory(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue && !this.categories.includes(selectedValue)) {
      this.categories.push(selectedValue);
    }

    (event.target as HTMLSelectElement).selectedIndex = 0;
  }

  clearCategories(): void{
    this.categories = [];
  }

  load_image(url: string){
    this.image_link = url;
  }

  error_image(){
    this.image_link = 'assets/formato_imagen.png';
  }

  constructor(
    private newsService: NewsService,
    private router: Router
  ){}
  async add_news(form: any): Promise<void> {
    if (!form.valid) {
      this.errorMessage = "** Por favor, corrige los errores antes de continuar **";
      return;
    }

    const regex = /^[a-zA-ZÀ-ÿÑñ0-9\s.,:;'"()\-!?]+$/;
    const countries = [
      "albania", "alemania", "andorra", "armenia", "austria", "azerbaiyán",
      "bélgica", "bosnia y herzegovina", "bulgaria", "chipre", "croacia", "dinamarca",
      "eslovaquia", "eslovenia", "españa", "estonia", "finlandia", "francia",
      "georgia", "grecia", "hungría", "irlanda", "islandia", "italia", "kazajistán",
      "kosovo", "letonia", "liechtenstein", "lituania", "luxemburgo", "malta",
      "moldavia", "mónaco", "montenegro", "noruega", "países bajos", "polonia",
      "portugal", "reino unido", "república checa", "rumanía", "rusia", "san marino",
      "serbia", "suecia", "suiza", "tailandia", "turquía", "ucrania", "vaticano", "otros"
    ];

    if (this.title.length > 50) {
      this.errorMessage = "El título no puede tener más de 50 caracteres.";
      return;
    }

    if (!regex.test(this.title) || !regex.test(this.description) || !regex.test(this.content)) {
      this.errorMessage = "Algun/os caracteres introducidos son inválidos.";
      return;
    }

    if (!countries.includes(this.place.trim().toLowerCase())) {
      this.errorMessage = "El país debe ser europeo y escribirse correctamente.";
      return;
    }

    if (this.content.length > 2000) {
      this.errorMessage = "El contenido no puede exceder los 2000 caracteres.";
      return;
    }

    if (this.description.length > 250) {
      this.errorMessage = "La descripción no puede exceder los 250 caracteres.";
      return;
    }

    if (this.categories.length === 0) {
      this.errorMessage = "Debes seleccionar al menos una categoría.";
      return;
    }


    const news: NewsModel = {
      ID: "",
      title: this.title,
      authorID: localStorage.getItem('user_id') || "error",
      description: this.description,
      content: this.content,
      image: this.image_link,
      categories: this.categories,
      usersCommentsID: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };


    this.isLoading = true;
    try {
      const id = await this.newsService.createNews(news);
      this.isLoading = false;
      this.router.navigate(['/home']); // O la ruta que corresponda tras añadir la noticia
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = "Ocurrió un error al añadir la noticia. Intente de nuevo.";
      console.error(error);
    }
  }
}
