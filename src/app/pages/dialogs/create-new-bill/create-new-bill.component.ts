import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { RoomService } from 'src/app/shared/services/room.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-create-new-bill',
  templateUrl: './create-new-bill.component.html',
  styleUrls: ['./create-new-bill.component.scss']
})
export class CreateNewBillComponent implements OnInit {
  progressBar = false;
  form: any = {};
  today = new Date();
  month = this.today.getMonth() + 1
  year = this.today.getFullYear()
  form_room_number = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CreateNewBillComponent>,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    public dialogService: DialogService,
    private roomService: RoomService,
    public billService: BillService,
    public leaseService: LeaseService
  ) { }

  ngOnInit(): void {
    this.leaseService.findAllSuccess(this.data.token).subscribe((leaseDatas) => {
      leaseDatas.forEach(leaseData => {
        this.roomService.findDataRoomByUserId(this.data.token, leaseData.user_id).subscribe((dataRoom) => {
          this.authService.findById(leaseData.user_id, this.data.token).subscribe((dataUser) => {
            this.form_room_number.push({
              room_number: leaseData.room_number,
              data_room_id: dataRoom[0].id,
              user_in_room: dataUser.id,
              fullname_user_in_room: dataUser.name + ' ' + dataUser.surname,
            })
          })
        })
      });
    })
  }

  selectedRoomNumber(value) {
    const user = this.tokenStorageService.getUser();
    this.billService.findAllByDataRoomId(this.data.token, value).subscribe((billData) => {
      // ถ้ามีข้อมูล bill เก่าอยู่แล้วดึงบิลเก่าตัวล่าสุดมาเป็น base
      if (billData.length) {
        this.form.user_issur_id = user.id
        this.form.user_in_room = billData[0].user_in_room
        this.form.fullname_user_in_room = billData[0].fullname_user_in_room
        this.form.data_room_id = billData[0].data_room_id
        this.form.room_number = billData[0].room_number
        this.form.room_cost = billData[0].room_cost
        this.form.furniture_cost = billData[0].furniture_cost
        this.form.internet_cost = billData[0].internet_cost
        this.form.water_cost = billData[0].water_cost
        this.form.unit_in_month = 0
        this.form.unit_per_month = billData[0].unit_per_month
        this.form.total_unit_old = billData[0].total_unit
        this.form.data_implement = true
        this.form.bill_success = billData[0].bill_status
        this.form.createdAtBill = billData[0].createdAt
      }
      // ถ้ายังไม่มี ให้ set ค่าใหม่
      else {
        for (let index = 0; index < this.form_room_number.length; index++) {
          if (this.form_room_number[index]['data_room_id'] === parseInt(value)) {
            this.form.user_in_room = this.form_room_number[index]['user_in_room']
            this.form.fullname_user_in_room = this.form_room_number[index]['fullname_user_in_room']
            this.form.data_room_id = parseInt(value)
            this.form.room_number = this.form_room_number[index]['room_number']
          }
        }
        this.form.user_issur_id = user.id
        this.form.room_cost = 0
        this.form.furniture_cost = 0
        this.form.internet_cost = 0
        this.form.water_cost = 0
        this.form.unit_in_month = 0
        this.form.unit_per_month = 0
        this.form.data_implement = false
        this.form.bill_success = ''
        this.form.createdAtBill = null
      }
    })
  }

  onSubmit() {
    this.dialogService.openDialogConfirm('ยืนยันข้อมูล', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
      console.log(this.form);
      if (res === "true") {
        this.progressBar = true;
        // ถ้าบิลล่าสุดชำระเงินไปแล้วหรือ เป็นบิลใหม่ของห้องนั้นๆ
        if (this.form.bill_success === 'ชำระเงินเรียบร้อย' || this.form.bill_success === '') {
          // เช็คว่าเป็น บิลเก่าหรือ ใหม่จาก data_implement === true
          if (this.form.data_implement === true) {
            this.form['data_room_id'] = parseInt(this.form.data_room_id_check)
            this.form['electric_cost'] = this.form.unit_per_month * this.form.unit_in_month
            this.form['total_unit'] = this.form.total_unit_old + this.form.unit_in_month
            this.form['bill_status'] = 'รอส่งให้ผู้เข้าพัก'
            this.form['total_cost'] = (this.form.unit_per_month * this.form.unit_in_month) + this.form.room_cost + this.form.furniture_cost + this.form.internet_cost + this.form.water_cost
            delete this.form['data_room_id_check']
            delete this.form['data_implement']
            this.billService.createBill(this.data.token, this.form).subscribe((createBill) => {
              this.dialogRef.close(true)
            })
          } else {
            this.form['data_room_id'] = parseInt(this.form.data_room_id_check)
            this.form['electric_cost'] = this.form.unit_per_month * this.form.unit_in_month
            this.form['total_unit'] = 0 + this.form.unit_in_month
            this.form['bill_status'] = 'รอส่งให้ผู้เข้าพัก'
            this.form['total_cost'] = (this.form.unit_per_month * this.form.unit_in_month) + this.form.room_cost + this.form.furniture_cost + this.form.internet_cost + this.form.water_cost
            delete this.form['data_room_id_check']
            delete this.form['data_implement']
            this.billService.createBill(this.data.token, this.form).subscribe((createBill) => {
              this.dialogRef.close(true)
            })
          }
        } else {
          if (
            (parseInt(moment.utc(this.form.createdAtBill).format('MM')) === this.month && parseInt(moment.utc(this.form.createdAtBill).format('YYYY')) !== this.year) ||
            (parseInt(moment.utc(this.form.createdAtBill).format('MM')) !== this.month && parseInt(moment.utc(this.form.createdAtBill).format('YYYY')) == this.year) ||
            this.form.createdAtBill === null
          ) {
            if (this.form.data_implement === true) {
              this.form['data_room_id'] = parseInt(this.form.data_room_id_check)
              this.form['electric_cost'] = this.form.unit_per_month * this.form.unit_in_month
              this.form['total_unit'] = this.form.total_unit_old + this.form.unit_in_month
              this.form['bill_status'] = 'รอส่งให้ผู้เข้าพัก'
              this.form['total_cost'] = (this.form.unit_per_month * this.form.unit_in_month) + this.form.room_cost + this.form.furniture_cost + this.form.internet_cost + this.form.water_cost
              delete this.form['data_room_id_check']
              delete this.form['data_implement']
              this.billService.createBill(this.data.token, this.form).subscribe((createBill) => {
                this.dialogRef.close(true)
              })
            } else {
              this.form['data_room_id'] = parseInt(this.form.data_room_id_check)
              this.form['electric_cost'] = this.form.unit_per_month * this.form.unit_in_month
              this.form['total_unit'] = 0 + this.form.unit_in_month
              this.form['bill_status'] = 'รอส่งให้ผู้เข้าพัก'
              this.form['total_cost'] = (this.form.unit_per_month * this.form.unit_in_month) + this.form.room_cost + this.form.furniture_cost + this.form.internet_cost + this.form.water_cost
              delete this.form['data_room_id_check']
              delete this.form['data_implement']
              this.billService.createBill(this.data.token, this.form).subscribe((createBill) => {
                this.dialogRef.close(true)
              })
            }
          }
          else {
            this.dialogService.openDialogConfirm('ไม่สามารถสร้างบิลได้', `เนื่องจากมีบิลของห้อง ${this.form.room_number} ยังดำเนินการไม่เสร็จสิ้น`).afterClosed().subscribe(res => {
              this.progressBar = false;
            })
          }
        }
      }
    })
  }
  closeDialog() {
    this.dialogRef.close(false)
  }
}
