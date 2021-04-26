import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddUpdateImgComponent } from 'src/app/pages/dialogs/add-update-img/add-update-img.component';
import { ConfirmDialogComponent } from 'src/app/pages/dialogs/confirm-dialog/confirm-dialog.component';
import { CreateNewBillComponent } from 'src/app/pages/dialogs/create-new-bill/create-new-bill.component';
import { CreateNewRoomComponent } from 'src/app/pages/dialogs/create-new-room/create-new-room.component';
import { EditUserComponent } from 'src/app/pages/dialogs/edit-user/edit-user.component';
import { InsertDataRoomComponent } from 'src/app/pages/dialogs/insert-data-room/insert-data-room.component';
import { ShowDataRoomComponent } from 'src/app/pages/dialogs/show-data-room/show-data-room.component';
import { ViewImgComponent } from 'src/app/pages/dialogs/view-img/view-img.component';

import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { EditBillComponent } from 'src/app/pages/dialogs/edit-bill/edit-bill.component';
import { AddIncomeComponent } from 'src/app/pages/dialogs/add-income/add-income.component';
import { UploadBillComponent } from 'src/app/pages/dialogs/upload-bill/upload-bill.component';
import { ViewImageBillComponent } from 'src/app/pages/dialogs/view-image-bill/view-image-bill.component';
import { ViewCommentComponent } from 'src/app/pages/dialogs/view-comment/view-comment.component';
import { EditCommentComponent } from 'src/app/pages/dialogs/edit-comment/edit-comment.component';
import { EditPostComponent } from 'src/app/pages/dialogs/edit-post/edit-post.component';
import { GraphDialogComponent } from 'src/app/pages/dialogs/graph-dialog/graph-dialog.component';
import { UpdateIncomeComponent } from 'src/app/pages/dialogs/update-income/update-income.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  change = 'lg';
  watcher: Subscription;
  constructor(
    private dialog: MatDialog,
    mediaObserver: MediaObserver
  ) {
    this.change = 'lg';
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.change = 'xs';
      } else if (change.mqAlias === 'sm') {
        this.change = 'sm';
      } else if (change.mqAlias === 'md') {
        this.change = 'md';
      }
      else {
        this.change = 'lg';
      }
    });
  }

  openDialogConfirm(header, msg) {
    return this.dialog.open(ConfirmDialogComponent,
      {
        width: '390px',
        disableClose: true,
        data: {
          header: header,
          message: msg,
        }
      }
    );
  }

  // แก้ไขข้อมูลผู้พัก
  openDialogEditUser(data, token) {
    return this.dialog.open(EditUserComponent,
      {
        width: '390px',
        disableClose: true,
        data: {
          data: data,
          token: token
        }
      }
    );
  }

  openDialogAddPhotoLease(token, header, button, data) {
    return this.dialog.open(AddUpdateImgComponent,
      {
        width: '100vw',
        disableClose: true,
        data: {
          token: token,
          header: header,
          button: button,
          data: data
        }
      }
    );
  }

  openDialogShowData(token, data) {
    var size = "40vw"
    if (this.change === "xs") {
      size = "90vw"
    } else if (this.change === "sm") {
      size = "50vw"
    } else if (this.change === "md") {
      size = "35vw"
    }
    return this.dialog.open(ShowDataRoomComponent,
      {
        width: size,
        disableClose: true,
        data: {
          token: token,
          data: data
        }
      }
    );
  }

  openDialogViewImgLease(data) {
    return this.dialog.open(ViewImgComponent,
      {
        width: '1100px',
        disableClose: true,
        data: data
      }
    );
  }

  openDialogCreateNewRoom(token) {
    return this.dialog.open(CreateNewRoomComponent,
      {
        width: '390px',
        disableClose: true,
        data: {
          token: token
        }
      }
    );
  }

  // แก้ไขห้องเดิม
  openDialogInsertDataRoom(token, data) {
    return this.dialog.open(InsertDataRoomComponent,
      {
        width: '390px',
        disableClose: true,
        data: {
          token: token,
          data: data
        }
      }
    );
  }

  // แก้ไขห้องเดิม
  openDialogUploadBill(token, data, header) {
    return this.dialog.open(UploadBillComponent,
      {
        width: '500px',
        disableClose: true,
        data: {
          token: token,
          data: data,
          header: header
        }
      }
    );
  }

  // แก้ไขห้องเดิม
  openDialogCreateNewBill(token, header, button) {
    var size = "40vw"
    if (this.change === "xs") {
      size = "90vw"
    } else if (this.change === "sm") {
      size = "50vw"
    } else if (this.change === "md") {
      size = "35vw"
    }
    return this.dialog.open(CreateNewBillComponent,
      {
        width: size,
        disableClose: true,
        data: {
          token: token,
          header: header,
          button: button
        }
      }
    );
  }

  // แก้ไขห้องเดิม
  openDialogEditbill(data, token) {
    var size = "40vw"
    if (this.change === "xs") {
      size = "90vw"
    } else if (this.change === "sm") {
      size = "50vw"
    } else if (this.change === "md") {
      size = "35vw"
    }
    return this.dialog.open(EditBillComponent,
      {

        width: size,
        disableClose: true,
        data: {
          data: data,
          token: token
        }
      }
    );
  }

  // เพิ่มรายรับ-รายจ่าย
  openDialogAddIncome(token) {
    var size = "40vw"
    if (this.change === "xs") {
      size = "90vw"
    } else if (this.change === "sm") {
      size = "50vw"
    } else if (this.change === "md") {
      size = "35vw"
    }
    return this.dialog.open(AddIncomeComponent,
      {

        width: size,
        disableClose: true,
        data: { token: token }
      }
    );
  }

  // แก้ไขรายรับ-รายจ่าย
  openDialogUpdateIncome(token, data) {
    var size = "40vw"
    if (this.change === "xs") {
      size = "90vw"
    } else if (this.change === "sm") {
      size = "50vw"
    } else if (this.change === "md") {
      size = "35vw"
    }
    return this.dialog.open(UpdateIncomeComponent,
      {

        width: size,
        disableClose: true,
        data: {
          token: token,
          data: data
        }
      }
    );
  }

  openDialogViewImgBill(data) {
    return this.dialog.open(ViewImageBillComponent,
      {
        width: '1100px',
        disableClose: true,
        data: data
      }
    );
  }

  openDialogViewComment(token, id, userLogin) {
    return this.dialog.open(ViewCommentComponent,
      {
        width: '650px',
        disableClose: true,
        data: {
          token: token,
          id: id,
          userLogin: userLogin
        }
      }
    );
  }

  openDialogViewGraph(token, nameGraph, dataMonth, creditYear, debitYear) {
    return this.dialog.open(GraphDialogComponent,
      {
        width: '650px',
        disableClose: true,
        data: {
          token: token,
          nameGraph: nameGraph,
          dataMonth: dataMonth,
          debitYear: debitYear,
          creditYear: creditYear
        }
      }
    );
  }

  openDialogEditComment(token, data) {
    var size = "40vw"
    if (this.change === "xs") {
      size = "90vw"
    } else if (this.change === "sm") {
      size = "50vw"
    } else if (this.change === "md") {
      size = "35vw"
    }
    return this.dialog.open(EditCommentComponent,
      {

        width: size,
        disableClose: true,
        data: {
          data: data,
          token: token
        }
      }
    );
  }

  openDialogEditPost(token, data) {
    var size = "40vw"
    if (this.change === "xs") {
      size = "90vw"
    } else if (this.change === "sm") {
      size = "50vw"
    } else if (this.change === "md") {
      size = "35vw"
    }
    return this.dialog.open(EditPostComponent,
      {

        width: size,
        disableClose: true,
        data: {
          data: data,
          token: token
        }
      }
    );
  }
}

