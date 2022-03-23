import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';

import { ProductCategory } from '../product-categories/product-category';

import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];

  //products: Product[] = [];
  //Declarative data retrieval pattern
  products$=this.productService.products$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;//return an empty Observable
    })
  );//undefined so it doesn't need to be initialized
  

  constructor(private productService: ProductService) { }

    //Procedural data retrieval pattern
    // this.sub = this.productService.getProducts()
    //   .subscribe({
    //     next: products => this.products = products,
    //     error: err => this.errorMessage = err
    //   });     

    // this.products$ = this.productService.getProducts()
    // .pipe(
    //   catchError(err => {
    //     this.errorMessage = err;
    //     return EMPTY;//return an empty Observable
    //   })
    // );

    
   

    //error strategy
    // this.products$ = this.productService.getProducts().subscribe({
    //   next: products => this.products = products,
    //   error: err => this.errorMessage = err     
    // });
    

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
