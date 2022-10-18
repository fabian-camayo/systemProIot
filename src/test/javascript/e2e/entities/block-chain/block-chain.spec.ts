import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BlockChainComponentsPage, BlockChainDeleteDialog, BlockChainUpdatePage } from './block-chain.page-object';

const expect = chai.expect;

describe('BlockChain e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let blockChainComponentsPage: BlockChainComponentsPage;
  let blockChainUpdatePage: BlockChainUpdatePage;
  let blockChainDeleteDialog: BlockChainDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BlockChains', async () => {
    await navBarPage.goToEntity('block-chain');
    blockChainComponentsPage = new BlockChainComponentsPage();
    await browser.wait(ec.visibilityOf(blockChainComponentsPage.title), 5000);
    expect(await blockChainComponentsPage.getTitle()).to.eq('systemProIotApp.blockChain.home.title');
    await browser.wait(ec.or(ec.visibilityOf(blockChainComponentsPage.entities), ec.visibilityOf(blockChainComponentsPage.noResult)), 1000);
  });

  it('should load create BlockChain page', async () => {
    await blockChainComponentsPage.clickOnCreateButton();
    blockChainUpdatePage = new BlockChainUpdatePage();
    expect(await blockChainUpdatePage.getPageTitle()).to.eq('systemProIotApp.blockChain.home.createOrEditLabel');
    await blockChainUpdatePage.cancel();
  });

  it('should create and save BlockChains', async () => {
    const nbButtonsBeforeCreate = await blockChainComponentsPage.countDeleteButtons();

    await blockChainComponentsPage.clickOnCreateButton();

    await promise.all([blockChainUpdatePage.setBlockInput('block')]);

    expect(await blockChainUpdatePage.getBlockInput()).to.eq('block', 'Expected Block value to be equals to block');

    await blockChainUpdatePage.save();
    expect(await blockChainUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await blockChainComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BlockChain', async () => {
    const nbButtonsBeforeDelete = await blockChainComponentsPage.countDeleteButtons();
    await blockChainComponentsPage.clickOnLastDeleteButton();

    blockChainDeleteDialog = new BlockChainDeleteDialog();
    expect(await blockChainDeleteDialog.getDialogTitle()).to.eq('systemProIotApp.blockChain.delete.question');
    await blockChainDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(blockChainComponentsPage.title), 5000);

    expect(await blockChainComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
