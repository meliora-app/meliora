import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-page',
  templateUrl: './quote-page.component.html',
  styleUrls: ['./quote-page.component.css'],
})
export class QuotePageComponent implements OnInit {
  quoteContainer: boolean = false;
  loader: boolean = true;

  authorText: string;
  quoteText: string;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.getQuote();
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);
  }

  async getQuote() {
    const proxyUrl = 'https://desolate-inlet-19096.herokuapp.com/';
    const apiUrl =
      'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
      const response = await fetch(proxyUrl + apiUrl);
      const data = await response.json();
      // const data = null;
      // If Author is blank, add 'Unknown'
      if (data == null) {
        this.quoteText = 'Good Today, Better Tomorrow';
        this.authorText = 'Meliora';
      } else {
        if (data.quoteText === '' || data.quoteText === null) {
          this.quoteText = 'Good Today, Better Tomorrow';
          this.authorText = 'Meliora';
        }
        if (data.quoteAuthor === '') {
          this.authorText = 'Unknown';
        } else {
          this.authorText = data.quoteAuthor;
        }
        this.quoteText = data.quoteText;
      }
      // Reduce font size for long quotes
      // if (data.quoteText.length > 120) {
      //     quoteText.classList.add('long-quote');
      // } else {
      //     quoteText.classList.remove('long-quote');
      // }
      // quoteText.innerText = data.quoteText;
      // Stop loader and show quote
      this.quoteContainer = !this.quoteContainer;
      this.loader = !this.loader;
    } catch (error) {
      // console.log(error);
      if ((this.quoteText = '')) {
        this.quoteText = 'Good Today, Better Tomorrow';
        this.authorText = 'Meliora';
      }
      this.getQuote();
    }
  }
}
