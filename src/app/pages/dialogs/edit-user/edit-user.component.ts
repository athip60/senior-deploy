import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { RoomService } from 'src/app/shared/services/room.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  progressBar = false;
  form: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditUserComponent>,
    public authService: AuthService,
    public dialogService: DialogService,
    public roomService: RoomService,
    public billService: BillService,
    public leaseService: LeaseService
  ) { }

  ngOnInit(): void {
    this.form = {
      role_user: this.data.data.role_user
    }
  }
  onSubmit(): void {
    // ถ้าสถานะเป็นผู้เข้าพัก แต่ต้องการเปลี่ยนสถานะเป็นอย่างอื่น
    if (this.form.role_user !== 'guest' && this.data.data.role_user === 'guest') {
      this.roomService.findDataRoomByUserId(this.data.token, this.data.data.id).subscribe((dataRoom) => {
        if (dataRoom.length) {
          this.dialogService.openDialogConfirm(`***ยืนยันข้อมูล (โปรดอ่านก่อนดำเนินการ)`, 'ยืนยันข้อมูลใช่หรือไม่ หากเปลี่ยนสถานะจากผู้เข้าพักเป็นอย่างอื่นจะทำให้ข้อมูลในห้องพักของผู้ใช้ท่านนี้หายไปด้วย').afterClosed().subscribe(res => {
            if (res === "true") {
              // ถ้ายืนยันที่จะทำ
              this.progressBar = true;
              let form_User = {
                role_user: this.form.role_user,
                room_number: null,
                lease_status: null
              }
              let form_Room = {
                room_status: 'ห้องว่าง',
                note: null,
                data_room: null
              }
              this.authService.updateUser(form_User, this.data.data.id, this.data.token).subscribe((res) => {
                this.roomService.updateRoom(this.data.token, form_Room, dataRoom[0].room_id).subscribe((res) => {
                  this.roomService.deleteDataRoom(this.data.token, dataRoom[0].id).subscribe((res) => {
                    this.leaseService.deleteLease(this.data.token, dataRoom[0].lease_id).subscribe((res) => {
                      this.dialogRef.close(true)
                    })
                  })
                })
              })
            }
          })
        } else {
          this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่').afterClosed().subscribe(res => {
            if (res === "true") {
              this.progressBar = true;
              this.authService.updateUser(this.form, this.data.data.id, this.data.token).subscribe((res) => {
                this.dialogRef.close(true)
              })
            }
          })
        }
      })
    } else {
      // ถ้าไม่ได้จะเปลี่ยนสถานะจากผู้เข้าพักเป็นอย่างอื่น
      this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่').afterClosed().subscribe(res => {
        if (res === "true") {
          this.progressBar = true;
          this.authService.updateUser(this.form, this.data.data.id, this.data.token).subscribe((res) => {
            this.dialogRef.close(true)
          })
        }
      })
    }
  }
  closeDialog() {
    this.dialogRef.close(false)
  }
}
