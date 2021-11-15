import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  userID = localStorage.getItem('userID');

  constructor(private categoryService: CategoryService, private router: Router) {

  }

  ngOnInit(): void {
  }

  categoryCreation(form: NgForm) {
    console.log(form.value);
    this.categoryService.createCategory(form.value.name, form.value.description, this.userID);
    this.router.navigate(['/home/'])
  }

}
