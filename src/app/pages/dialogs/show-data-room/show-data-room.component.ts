import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { RoomService } from 'src/app/shared/services/room.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-show-data-room',
  templateUrl: './show-data-room.component.html',
  styleUrls: ['./show-data-room.component.scss']
})
export class ShowDataRoomComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ShowDataRoomComponent>,
    public dialogService: DialogService,
    private roomService: RoomService,
    private tokenStorage: TokenStorageService,
    private leaseService: LeaseService,
    private billService: BillService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  deleteRoom(show_data) {
    if (show_data.room_status === "มีผู้เข้าพัก") {
      this.dialogService.openDialogConfirm(`ลบห้อง ${show_data.room_number}***`, `ยืนยันที่จะลบห้องพักใช่หรือไม่ หากลบแล้วจะทำให้ข้อมูลผู้ใช้ในห้อง ${show_data.room_number} หายไปด้วย?`).afterClosed().subscribe(res => {
        if (res === "true") {
          this.roomService.findDataRoomByUserId(this.data.token, show_data.user_id).subscribe((dataRoom) => {
            console.log(dataRoom);
            let form_User = {
              room_number: null,
              lease_status: null
            }
            this.roomService.deleteRoom(this.data.token, show_data.id).subscribe((res) => {
              this.authService.updateUser(form_User, show_data.user_id, this.data.token).subscribe((res) => {
                this.roomService.deleteDataRoom(this.data.token, dataRoom[0].id).subscribe((res) => {
                  this.leaseService.deleteLease(this.data.token, dataRoom[0].lease_id).subscribe((res) => {
                    this.reloadPage()
                  })
                })
              })
            })
          })
        }
      })
    } else {
      this.dialogService.openDialogConfirm(`ลบห้อง ${show_data.room_number}`, 'ยืนยันที่จะลบห้องพักใช่หรือไม่?').afterClosed().subscribe(res => {
        if (res === "true") {
          this.roomService.deleteRoom(this.data.token, show_data.id).subscribe((res) => {
            this.reloadPage()
          })
        }
      })
    }
  }

  openInsertDataRoomDialog(data) {
    // เอาข้อมูลส่งไปเพิ่ม update ข้อมูลห้อง
    this.dialogService.openDialogInsertDataRoom(this.data.token, data).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  moveOut(data) {
    // เอาข้อมูลส่งไปเพิ่ม update ข้อมูลห้อง
    this.dialogService.openDialogConfirm('ย้ายออก***', 'หากทำการดำเนินการต่อจะทำให้ ข้อมูลของผู้เข้าพักทั้งหมดที่เกี่ยวกับห้องนี้หายไปด้วย').afterClosed().subscribe(res => {
      if (res === "true") {
        this.roomService.findDataRoomByUserId(this.data.token, data.user_id).subscribe((dataRoom) => {
          this.authService.updateUser({ room_number: null, lease_status: null }, dataRoom[0].user_id, this.data.token).subscribe((userUpdate) => {
            this.leaseService.deleteLease(this.data.token, dataRoom[0].lease_id).subscribe((deleteLease) => {
              this.roomService.deleteDataRoom(this.data.token, dataRoom[0].id).subscribe((deleteDataRoom) => {
                this.roomService.updateRoom(this.data.token, { room_status: 'ห้องว่าง', data_room: null }, dataRoom[0].room_id).subscribe((updateRoom) => {
                  this.reloadPage()
                })
              })
            })
          })
        })
      }
    })
  }

  viewImg(room_number) {
    this.leaseService.findDataLeaseByRid(this.data.token, room_number).subscribe((res) => {
      this.dialogService.openDialogViewImgLease(res[0]).afterClosed().subscribe(res => {
      })
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }
}
