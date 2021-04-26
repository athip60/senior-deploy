import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { RoomService } from 'src/app/shared/services/room.service';

@Component({
  selector: 'app-insert-data-room',
  templateUrl: './insert-data-room.component.html',
  styleUrls: ['./insert-data-room.component.scss']
})
export class InsertDataRoomComponent implements OnInit {
  user_data = []
  progressBar = false;
  form: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private authService: AuthService,
    public dialogRef: MatDialogRef<InsertDataRoomComponent>,
    private roomService: RoomService,
    public dialogService: DialogService,
    public leaseService: LeaseService
  ) { }

  ngOnInit(): void {
    // นำข้อมูลที่ได้จาก api ไม่ใส่ในฟอร์ม หากมีข้อมูลอยู่แล้ว
    this.authService.findAllGuest(this.data.token, this.data.data.room_number).subscribe(response => {
      this.user_data = response
    })
    this.form = {
      id: this.data.data.id,
      room_number: this.data.data.room_number,
      user: this.data.data.user_id.toString(),
      note: this.data.data.note,
      room_status: this.data.data.room_status
    }
  }

  onSubmit(): void {
    // เปลี่ยนสถานะจาก ห้องว่าง หรือ ห้องใช้ไม่ได้ เป็น มีผู้เข้าพัก
    if (this.form.room_status === "มีผู้เข้าพัก") {
      // เข้า if แสดงว่าเป็นการเพิ่มผู้เข้าพักคนใหม่
      if (this.data.data.room_status !== 'มีผู้เข้าพัก') {
        this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
          if (res === "true") {
            this.progressBar = true;
            // เช็คว่าเลขห้องที่กรอกไปซ้ำหรือไม่
            this.roomService.checkRoomNumber(this.data.token, this.form.room_number).subscribe((dataRoomNumber) => {
              // เข้า if คือซ้ำ
              if (dataRoomNumber.length && this.form.room_number !== this.data.data.room_number) {
                this.dialogService.openDialogConfirm('ข้อมูลไม่ถูกต้อง', `มีห้องหมายเลข ${this.form.room_number} อยู่แล้ว`).afterClosed().subscribe(res => {
                  if (res === "true") {
                    this.progressBar = false;
                  }
                })
              }
              // else ไม่ซ้ำให้ทำต่อไป
              else {
                let form_lease = {
                  user_id: this.form.user,
                  room_number: this.form.room_number,
                  lease_status: "ยังไมได้เพิ่มรูปภาพสัญญาเช่า"
                }
                this.authService.updateUser({ room_number: this.form.room_number, lease_status: "ยังไมได้เพิ่มรูปภาพสัญญาเช่า" }, this.form.user, this.data.token).subscribe((res) => { })
                this.leaseService.createLease(this.data.token, form_lease).subscribe((dataLease) => {
                  let form_dataRoom = {
                    user_id: this.form.user,
                    room_id: this.data.data.id,
                    lease_id: dataLease.id,
                    photo_1: null,
                    photo_2: null
                  }
                  this.roomService.createDataRoom(this.data.token, form_dataRoom).subscribe((dataRoom) => {
                    let form_room = {
                      room_status: "มีผู้เข้าพัก",
                      data_room: dataRoom.id,
                      room_number: this.form.room_number,
                      note: this.form.note,

                    }
                    this.roomService.updateRoom(this.data.token, form_room, this.data.data.id).subscribe((res) => {
                      this.dialogRef.close(true)
                    })
                  })
                })
              }
            })
          }
        })
      }
      // เข้า else แสดงว่าเป็นการแก้ไขข้อมูลของห้องที่มีผู้เข้าพักอยู่ก่อนแล้ว
      else {
        this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
          if (res === "true") {
            this.progressBar = true;
            this.roomService.checkRoomNumber(this.data.token, this.form.room_number).subscribe((dataRoomNumber) => {
              if (dataRoomNumber.length && this.form.room_number !== this.data.data.room_number) {
                this.dialogService.openDialogConfirm('ข้อมูลไม่ถูกต้อง', `มีห้องหมายเลข ${this.form.room_number} อยู่แล้ว`).afterClosed().subscribe(res => {
                  if (res === "true") {
                    this.progressBar = false;
                  }
                })
              }
              else {
                // แสดงข้อมูลก่อนเปลี่ยน
                this.roomService.findDataRoomByUserId(this.data.token, this.data.data.user_id).subscribe((oldDataRoom) => {
                  let form_old_user = {
                    room_number: null,
                    lease_status: null,
                  }
                  let form_new_user = {
                    room_number: this.form.room_number,
                    lease_status: 'ยังไมได้เพิ่มรูปภาพสัญญาเช่า',
                  }
                  let form_lease = {
                    room_number: this.form.room_number,
                    user_id: this.form.user
                  }
                  this.authService.updateUser(form_old_user, oldDataRoom[0].user_id, this.data.token).subscribe((res) => {
                    this.authService.updateUser(form_new_user, this.form.user, this.data.token).subscribe((res) => {
                      this.roomService.updateRoom(this.data.token, { room_number: this.form.room_number, note: this.form.note }, this.data.data.id).subscribe((res) => {
                        this.leaseService.updateLease(this.data.token, form_lease, oldDataRoom[0].lease_id).subscribe((res) => {
                          this.roomService.updateDataRoom(this.data.token, { user_id: this.form.user }, oldDataRoom[0].id).subscribe((res) => {
                            this.dialogRef.close(true)
                          })
                        })
                      })
                    })
                  })
                })
              }
            })
          }
        })
      }
    }
    // ไม่มีการเปลี่ยนสถานะจาก มึผู้เข้าพักเป็น ห้องว่าง หรือ ห้องใช้ไม่ได้
    else {
      // เข้า if เป็นการแก้ห้องพักเป็น ห้องว่าง หรือ ห้องใช้ไม่ได้ โดยที่ก่อนหน้านี้ห้องไม่ได้มีผู้เข้าพัก
      if (this.data.data.room_status !== 'มีผู้เข้าพัก') {
        this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
          if (res === "true") {
            this.progressBar = true;
            this.roomService.checkRoomNumber(this.data.token, this.form.room_number).subscribe((dataRoomNumber) => {
              if (dataRoomNumber.length && this.form.room_number !== this.data.data.room_number) {
                this.dialogService.openDialogConfirm('ข้อมูลไม่ถูกต้อง', `มีห้องหมายเลข ${this.form.room_number} อยู่แล้ว`).afterClosed().subscribe(res => {
                  if (res === "true") {
                    this.progressBar = false;
                  }
                })
              }
              else {
                let form_update = {
                  room_number: this.form.room_number,
                  room_status: this.form.room_status,
                  note: this.form.note
                };

                this.roomService.updateRoom(this.data.token, form_update, this.form.id).subscribe((res) => {
                  if (res.message === `แก้ไขข้อมูลห้อง ${this.form.room_number} สำเร็จ`) {
                    this.dialogRef.close(true)
                  } else {
                    this.dialogService.openDialogConfirm('แก้ไขข้อมูลไม่สำเร็จ', res.message).afterClosed().subscribe(res => {
                      this.progressBar = false;
                    })
                  }
                })

              }
            })
          }
        })
      }
      // เข้า else เป็นการแก้ห้องพักที่มีผู้เข้าพักอยู่แล้วเป็น ห้องว่าง หรือ ห้องใช้ไม่ได้
      else {
        this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
          if (res === "true") {
            this.progressBar = true;
            this.roomService.checkRoomNumber(this.data.token, this.form.room_number).subscribe((dataRoomNumber) => {
              if (dataRoomNumber.length && this.form.room_number !== this.data.data.room_number) {
                this.dialogService.openDialogConfirm('ข้อมูลไม่ถูกต้อง', `มีห้องหมายเลข ${this.form.room_number} อยู่แล้ว`).afterClosed().subscribe(res => {
                  if (res === "true") {
                    this.progressBar = false;
                  }
                })
              }
              else {
                this.roomService.findDataRoomByUserId(this.data.token, this.data.data.user_id).subscribe((oldDataRoom) => {
                  let form_user = {
                    room_number: null,
                    lease_status: null,
                  }
                  let form_room = {
                    room_number: this.form.room_number,
                    room_status: this.form.room_status,
                    data_room: null,
                    note: this.form.note
                  }
                  this.authService.updateUser(form_user, oldDataRoom[0].user_id, this.data.token).subscribe()
                  this.roomService.updateRoom(this.data.token, form_room, oldDataRoom[0].room_id).subscribe()
                  this.leaseService.deleteLease(this.data.token, oldDataRoom[0].lease_id).subscribe()
                  this.roomService.deleteDataRoom(this.data.token, oldDataRoom[0].id).subscribe()
                  this.dialogRef.close(true)
                })
              }
            })
          }
        })
      }
    }
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
