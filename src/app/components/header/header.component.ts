import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() back: EventEmitter<any> = new EventEmitter();
  @Input() title: string;
  @Input() showBackButton = false;
  constructor() { }

  ngOnInit() { }
}
