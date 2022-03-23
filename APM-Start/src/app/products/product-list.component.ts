import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, filter, map, startWith, Subject } from 'rxjs';

import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

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
  
  
  // selectedCategoryId = 1;

  //startwith(0) --> for initial value

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable(); //exposing the subjects observable

  //products: Product[] = [];
  //Declarative data retrieval pattern
  // products$=this.productService.products$.pipe(
  //   catchError(err => {
  //     this.errorMessage = err;
  //     return EMPTY;//return an empty Observable
  //   })
  // );//undefined so it doesn't need to be initialized
  
  // products$ = this.productService.productsWithCategory$.pipe(
  //     catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })
  // );

  products$ = combineLatest([
    // this.productService.productsWithCategory$,
    this.productService.productsWithAdd$,
    //two ways to set an initial value startWith or BehaviorSubject
    // this.categorySelectedAction$.pipe(
    //   startWith(0)
    // )
    this.categorySelectedAction$
    
    
  ]).pipe(
    map(([products , selectedCategoryId ]) => //deestructure arrays assigns variables to the arrays
      products.filter(product => 
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )),
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;//return an empty Observable
        })               
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
);

  // productsSimpleFilter$= this.productService.productsWithCategory$.pipe(
  //   map(products => 
  //       products.filter(p => this.selectedCategoryId ? p.categoryId  === this.selectedCategoryId : true))
  // );

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

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
    this.productService.addProduct();//with no parameter the method uses de fakeProduct 
  }

  onSelected(categoryId: string): void {
    // this.selectedCategoryId = +categoryId;
    this.categorySelectedSubject.next(+categoryId);
  }
}
