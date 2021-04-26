import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './angular-material/angular-material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';

// component
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ConfirmDialogComponent } from './pages/dialogs/confirm-dialog/confirm-dialog.component';
import { EditUserComponent } from './pages/dialogs/edit-user/edit-user.component';
import { AddUpdateImgComponent } from './pages/dialogs/add-update-img/add-update-img.component';
import { ViewImgComponent } from './pages/dialogs/view-img/view-img.component';
import { CreateNewRoomComponent } from './pages/dialogs/create-new-room/create-new-room.component';
import { InsertDataRoomComponent } from './pages/dialogs/insert-data-room/insert-data-room.component';
import { CreateNewBillComponent } from './pages/dialogs/create-new-bill/create-new-bill.component';
import { ShowDataRoomComponent } from './pages/dialogs/show-data-room/show-data-room.component';
import { EditBillComponent } from './pages/dialogs/edit-bill/edit-bill.component';
import { AddIncomeComponent } from './pages/dialogs/add-income/add-income.component';
import { UploadBillComponent } from './pages/dialogs/upload-bill/upload-bill.component';
import { ViewImageBillComponent } from './pages/dialogs/view-image-bill/view-image-bill.component';
import { ViewCommentComponent } from './pages/dialogs/view-comment/view-comment.component';
import { EditCommentComponent } from './pages/dialogs/edit-comment/edit-comment.component';
import { EditPostComponent } from './pages/dialogs/edit-post/edit-post.component';
import { GraphDialogComponent } from './pages/dialogs/graph-dialog/graph-dialog.component';
import { UpdateIncomeComponent } from './pages/dialogs/update-income/update-income.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ConfirmDialogComponent,
    EditUserComponent,
    AddUpdateImgComponent,
    ViewImgComponent,
    CreateNewRoomComponent,
    InsertDataRoomComponent,
    CreateNewBillComponent,
    LoginComponent,
    RegisterComponent,
    ShowDataRoomComponent,
    EditBillComponent,
    AddIncomeComponent,
    UploadBillComponent,
    ViewImageBillComponent,
    ViewCommentComponent,
    EditCommentComponent,
    EditPostComponent,
    GraphDialogComponent,
    UpdateIncomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    NgImageFullscreenViewModule
  ],
  providers: [AuthInterceptor, AuthService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
