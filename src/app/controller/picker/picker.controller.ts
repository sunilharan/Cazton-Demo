import { PickerController } from "@ionic/angular";

/**
 *
 * @exports
 * @class CustomPickerController
 *
 * @component-used `PickerController`
 * @PickerController https://ionicframework.com/docs/api/picker
 * @demosource https://github.com/ionic-team/ionic-docs/blob/master/src/demos/api/picker/index.html
 *
 * This is used for display native picker for selecting values.
 * This is dynamic component which will allow you to open picker controller as single or multi column option.
 * Use as class you can create one object for this and show values of your choice.
 * You can allow user to select one column value and also multi column.
 *
 */

export interface Picker {
  keyname?: string;
  dismissTitle?: string;
  dismissHandler?: any;
  actionTitle?: string;
  actionHandler?: any;
  pickerOptionsList?: string[][] | number[][];
  optionsLength?: number;
  isCustomValues?: boolean;
  multiColumn?: boolean;
  columns?: number;
  cssClass?: string;
  hideBackDrop?: boolean;
}

export class CustomPickerController {
  private readonly picker: Picker;
  private pickerController: PickerController;

  constructor(picker: Picker) {
    this.picker = picker;
    this.pickerController = new PickerController();
  }

  async show() {
    let buttons = new Array();
    if (this.picker.dismissTitle) {
      buttons.push({
        text: this.picker.dismissTitle,
        handler: this.picker.dismissHandler,
        role: "cancel",
      });
    }

    if (this.picker.actionTitle) {
      buttons.push({
        text: this.picker.actionTitle,
        handler: this.picker.actionHandler,
      });
    }

    try {
      const picker = await this.pickerController.create({
        buttons,
        cssClass: this.picker.cssClass,
        showBackdrop: this.picker.hideBackDrop ? false : true,
        columns: this.picker.multiColumn
          ? this.getMultiColumns(
              this.picker.optionsLength,
              this.picker.pickerOptionsList,
              this.picker.keyname,
              this.picker.columns
            )
          : this.getColumnsForPickerSelection(
              this.picker.optionsLength,
              this.picker.pickerOptionsList,
              this.picker.keyname
            ),
      });
      picker.present();
    } catch (error) {
      console.error("Couldn't create picker " + error);
    }
  }

  getColumnsForPickerSelection(
    numOptions,
    pickerOptionsList,
    keyname,
    numColumns = 1
  ) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: keyname,
        options: !this.picker.isCustomValues
          ? this.getColumnOptionsForPickerSelection(
              i,
              numOptions,
              pickerOptionsList
            )
          : pickerOptionsList,
      });
    }
    return columns;
  }

  getMultiColumns(numOptions, pickerOptionsList, keyname, numColumns = 1) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `${keyname}_${i}`,
        options: this.getColumnOptionsForPickerSelection(
          i,
          numOptions,
          pickerOptionsList
        ),
      });
    }
    return columns;
  }

  getColumnOptionsForPickerSelection(
    columnIndex,
    numOptions,
    pickerOptionsList
  ) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: pickerOptionsList[columnIndex][i % numOptions],
        value: pickerOptionsList[columnIndex][i % numOptions],
      });
    }
    return options;
  }
}
