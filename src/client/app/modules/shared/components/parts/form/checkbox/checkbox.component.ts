import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
    @Input() public checked = false;
    @Input() public disabled = false;
    @Output() public change = new EventEmitter<boolean>();

    constructor() { }

    public ngOnInit() {
    }

    public click() {
        this.checked = (this.checked) ? false : true;
        this.change.emit(this.checked);
    }

}
