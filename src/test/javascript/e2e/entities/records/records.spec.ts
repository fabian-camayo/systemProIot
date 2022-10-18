import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RecordsComponentsPage, RecordsDeleteDialog, RecordsUpdatePage } from './records.page-object';

const expect = chai.expect;

describe('Records e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let recordsComponentsPage: RecordsComponentsPage;
  let recordsUpdatePage: RecordsUpdatePage;
  let recordsDeleteDialog: RecordsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Records', async () => {
    await navBarPage.goToEntity('records');
    recordsComponentsPage = new RecordsComponentsPage();
    await browser.wait(ec.visibilityOf(recordsComponentsPage.title), 5000);
    expect(await recordsComponentsPage.getTitle()).to.eq('systemProIotApp.records.home.title');
    await browser.wait(ec.or(ec.visibilityOf(recordsComponentsPage.entities), ec.visibilityOf(recordsComponentsPage.noResult)), 1000);
  });

  it('should load create Records page', async () => {
    await recordsComponentsPage.clickOnCreateButton();
    recordsUpdatePage = new RecordsUpdatePage();
    expect(await recordsUpdatePage.getPageTitle()).to.eq('systemProIotApp.records.home.createOrEditLabel');
    await recordsUpdatePage.cancel();
  });

  it('should create and save Records', async () => {
    const nbButtonsBeforeCreate = await recordsComponentsPage.countDeleteButtons();

    await recordsComponentsPage.clickOnCreateButton();

    await promise.all([
      recordsUpdatePage.setStartDateInput('2000-12-31'),
      recordsUpdatePage.setEndDateInput('2000-12-31'),
      recordsUpdatePage.setNameProcessInput('nameProcess'),
      recordsUpdatePage.setDetailsProcessInput('detailsProcess'),
      recordsUpdatePage.setDeviceInput('device'),
      recordsUpdatePage.setCodeDeviceInput('codeDevice'),
      recordsUpdatePage.setDescriptionDeviceInput('descriptionDevice'),
      recordsUpdatePage.setOwnerInput('owner'),
      recordsUpdatePage.setSecurityKeyInput('securityKey'),
    ]);

    expect(await recordsUpdatePage.getStartDateInput()).to.eq('2000-12-31', 'Expected startDate value to be equals to 2000-12-31');
    expect(await recordsUpdatePage.getEndDateInput()).to.eq('2000-12-31', 'Expected endDate value to be equals to 2000-12-31');
    expect(await recordsUpdatePage.getNameProcessInput()).to.eq('nameProcess', 'Expected NameProcess value to be equals to nameProcess');
    expect(await recordsUpdatePage.getDetailsProcessInput()).to.eq(
      'detailsProcess',
      'Expected DetailsProcess value to be equals to detailsProcess'
    );
    expect(await recordsUpdatePage.getDeviceInput()).to.eq('device', 'Expected Device value to be equals to device');
    expect(await recordsUpdatePage.getCodeDeviceInput()).to.eq('codeDevice', 'Expected CodeDevice value to be equals to codeDevice');
    expect(await recordsUpdatePage.getDescriptionDeviceInput()).to.eq(
      'descriptionDevice',
      'Expected DescriptionDevice value to be equals to descriptionDevice'
    );
    expect(await recordsUpdatePage.getOwnerInput()).to.eq('owner', 'Expected Owner value to be equals to owner');
    expect(await recordsUpdatePage.getSecurityKeyInput()).to.eq('securityKey', 'Expected SecurityKey value to be equals to securityKey');

    await recordsUpdatePage.save();
    expect(await recordsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await recordsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Records', async () => {
    const nbButtonsBeforeDelete = await recordsComponentsPage.countDeleteButtons();
    await recordsComponentsPage.clickOnLastDeleteButton();

    recordsDeleteDialog = new RecordsDeleteDialog();
    expect(await recordsDeleteDialog.getDialogTitle()).to.eq('systemProIotApp.records.delete.question');
    await recordsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(recordsComponentsPage.title), 5000);

    expect(await recordsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
