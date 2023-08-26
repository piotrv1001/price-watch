import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProfilePictureComponent } from "../components/profile-picture/profile-picture.component";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from "primeng/button";

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule
  ],
  declarations: [
    ProfilePictureComponent
  ],
  exports: [
    ProfilePictureComponent,
    InputTextModule,
    ButtonModule,
    FormsModule,
    CommonModule
  ]
})
export class SharedModule {

}
