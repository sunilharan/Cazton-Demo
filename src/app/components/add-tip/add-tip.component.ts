import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-tip',
  templateUrl: './add-tip.component.html',
  styleUrls: ['./add-tip.component.scss'],
})
export class AddTipComponent implements OnInit {
  public amount = '';

  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  public async close(role: 'ADD' | 'CANCAL', data?) {
    await this.popoverController.dismiss(data, role);
  }
}
