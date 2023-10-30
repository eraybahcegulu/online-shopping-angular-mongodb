import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../../../../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'productTypes',
  templateUrl: './productTypes.component.html',
  styleUrls: ['./productTypes.component.css']
})
export class ProductTypesComponent implements AfterViewInit {
  @Input() dataSourceProductTypes: any;
  
  newProductTypesForm: FormGroup;

  addProductTypeMessage: string = '';
  addProductTypeMessageType: string = '';

  message: string = '';
  messageType: string = '';

  displayedColumns: string[] = ['_id', 'type', 'actions'];
  constructor(private productService: ProductService, private formBuilder: FormBuilder) {
    this.newProductTypesForm = this.formBuilder.group({
      productType: ['', [Validators.required]],

    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSourceProductTypes.paginator = this.paginator;
    }
  }

  get formControls() {
    return this.newProductTypesForm.controls;
  }

  deleteProductType(productTypeId: string) {
    this.productService.deleteProductType(productTypeId).subscribe(
      (response) => {
        this.handleDeleteProductResponse(response);
        this.dataSourceProductTypes.data = this.dataSourceProductTypes.data.filter((productType: { _id: string; }) => productType._id !== productTypeId);
      },
      (error) => {
        this.handleDeleteProductError(error);
      }
    );
  }

  private handleDeleteProductResponse(response: any): void {
    this.message = response.message;
    this.messageType = 'success';
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 2000);
  }

  private handleDeleteProductError(error: HttpErrorResponse): void {
    if (error.status === 400) {
      this.message = error.error.message;
      this.messageType = 'danger';
    } else {
      console.error('Failed', error);
    }
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 2000);
  }

  addErrors(inputProductType: any): boolean {
    if (inputProductType.value.trim() < 1 ) {
      return true;
    }
    return false;
  }

  editErrors(productType: any): boolean {
    if (productType.type.trim().length < 1 ) {
      return true;
    }
    return false;
  }

  startEditing(productType: any) {
    productType.isEditing = true;
  }

  saveEditedProductType(productType: any) {
    productType.isEditing = false;
  
    const updatedProductTypeData = {
      type: productType.type,

    };

    this.productService.updateProductType(productType._id, updatedProductTypeData).subscribe(
      (response) => {
        this.message = response.message;
        this.messageType = 'success';
        setTimeout(() => {
          this.message = '';
          this.messageType = '';
        }, 2000);
      },
      (error) => {
        if (error.status === 400) {
          this.message = error.error.message;
          this.messageType = 'danger';
        } else {
          console.error('Failed', error);
        }
        setTimeout(() => {
          this.message = '';
          this.messageType = '';
        }, 2000);
      }
    );

  }

  addProductType() {
    if (this.newProductTypesForm.valid) {

      const productTypeData = {
        type: this.newProductTypesForm.controls['productType'].value,
      };
  
      this.productService.addProductType(productTypeData).subscribe(
        (response) => {
          this.handleAddProductResponse(response);
        },
        (error) => {
          this.handleAddProductError(error);
        }
      );
    }
  }

  

  private handleAddProductResponse(response: any): void {
    this.addProductTypeMessage = response.message;
    this.addProductTypeMessageType = 'success';
    this.newProductTypesForm.reset();
    setTimeout(() => {
      this.addProductTypeMessage = '';
      this.addProductTypeMessageType = '';
    }, 2000);
  }

  private handleAddProductError(error: HttpErrorResponse): void {
    if (error.status === 400) {
      this.addProductTypeMessage = error.error.message;
      this.addProductTypeMessageType = 'danger';
    } else {
      console.error('Registration failed', error);
    }
    setTimeout(() => {
      this.addProductTypeMessage = '';
      this.addProductTypeMessageType = '';
    }, 2000);
  }
}