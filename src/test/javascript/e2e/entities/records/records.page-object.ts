import { element, by, ElementFinder } from 'protractor';

export class RecordsComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-records div table .btn-danger'));
  title = element.all(by.css('jhi-records div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class RecordsUpdatePage {
  pageTitle = element(by.id('jhi-records-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  startDateInput = element(by.id('field_startDate'));
  endDateInput = element(by.id('field_endDate'));
  nameProcessInput = element(by.id('field_nameProcess'));
  detailsProcessInput = element(by.id('field_detailsProcess'));
  deviceInput = element(by.id('field_device'));
  codeDeviceInput = element(by.id('field_codeDevice'));
  descriptionDeviceInput = element(by.id('field_descriptionDevice'));
  ownerInput = element(by.id('field_owner'));
  securityKeyInput = element(by.id('field_securityKey'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setStartDateInput(startDate: string): Promise<void> {
    await this.startDateInput.sendKeys(startDate);
  }

  async getStartDateInput(): Promise<string> {
    return await this.startDateInput.getAttribute('value');
  }

  async setEndDateInput(endDate: string): Promise<void> {
    await this.endDateInput.sendKeys(endDate);
  }

  async getEndDateInput(): Promise<string> {
    return await this.endDateInput.getAttribute('value');
  }

  async setNameProcessInput(nameProcess: string): Promise<void> {
    await this.nameProcessInput.sendKeys(nameProcess);
  }

  async getNameProcessInput(): Promise<string> {
    return await this.nameProcessInput.getAttribute('value');
  }

  async setDetailsProcessInput(detailsProcess: string): Promise<void> {
    await this.detailsProcessInput.sendKeys(detailsProcess);
  }

  async getDetailsProcessInput(): Promise<string> {
    return await this.detailsProcessInput.getAttribute('value');
  }

  async setDeviceInput(device: string): Promise<void> {
    await this.deviceInput.sendKeys(device);
  }

  async getDeviceInput(): Promise<string> {
    return await this.deviceInput.getAttribute('value');
  }

  async setCodeDeviceInput(codeDevice: string): Promise<void> {
    await this.codeDeviceInput.sendKeys(codeDevice);
  }

  async getCodeDeviceInput(): Promise<string> {
    return await this.codeDeviceInput.getAttribute('value');
  }

  async setDescriptionDeviceInput(descriptionDevice: string): Promise<void> {
    await this.descriptionDeviceInput.sendKeys(descriptionDevice);
  }

  async getDescriptionDeviceInput(): Promise<string> {
    return await this.descriptionDeviceInput.getAttribute('value');
  }

  async setOwnerInput(owner: string): Promise<void> {
    await this.ownerInput.sendKeys(owner);
  }

  async getOwnerInput(): Promise<string> {
    return await this.ownerInput.getAttribute('value');
  }

  async setSecurityKeyInput(securityKey: string): Promise<void> {
    await this.securityKeyInput.sendKeys(securityKey);
  }

  async getSecurityKeyInput(): Promise<string> {
    return await this.securityKeyInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class RecordsDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-records-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-records'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
