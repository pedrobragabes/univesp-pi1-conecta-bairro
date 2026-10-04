import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

async function create(page) {
  await page.goto('/solicitacoes/nova');
  await page.locator('[name=titulo]').fill('Solicitação sintética <em>de teste</em>');
  await page.locator('[name=descricao]').fill('Descrição sintética para testar sem participante ou dado real.');
  await page.locator('[name=categoria]').selectOption('Limpeza');
  await page.locator('[name=prioridade]').selectOption('Alta');
  await page.locator('[name=localizacao]').fill('Praça sintética de teste');
  await page.locator('[name=solicitante]').fill('Pessoa Fictícia');
  await page.getByRole('button', { name: 'Registrar solicitação' }).click();
  await expect(page.getByRole('status')).toHaveText('Solicitação registrada com sucesso.');
  return new URL(page.url()).pathname;
}

test('cadastro, edição, status, filtros e exclusão confirmada', async ({ page }, info) => {
  const path = await create(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Solicitação sintética <em>de teste</em>');
  await expect(page.locator('h1 em')).toHaveCount(0);
  await page.getByRole('link', { name: 'Editar informações' }).click();
  await page.locator('[name=localizacao]').fill('Localização sintética corrigida');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('.detail-location')).toContainText('Localização sintética corrigida');
  await page.getByLabel('Atualizar andamento').selectOption('Em andamento');
  await page.getByRole('button', { name: 'Atualizar status' }).click();
  await expect(page.locator('.status-large')).toHaveText('Em andamento');
  for (const [name, url] of [['detail', path], ['confirmation', `${path}/excluir`]]) {
    await page.goto(url);
    const result = await new AxeBuilder({ page }).analyze();
    await writeFile(info.outputPath(`axe-${name}.json`), JSON.stringify(result.violations, null, 2));
    expect(result.violations).toEqual([]);
  }
  await page.getByRole('link', { name: 'Cancelar' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Solicitação sintética <em>de teste</em>');
  await page.goto('/solicitacoes');
  await page.getByLabel('Buscar', { exact: true }).fill('Localização sintética corrigida');
  await page.getByRole('combobox', { name: /^Status/ }).selectOption('Em andamento');
  await page.getByRole('combobox', { name: /^Categoria/ }).selectOption('Limpeza');
  await page.getByRole('button', { name: 'Filtrar' }).click();
  await expect(page.locator('.request-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Abrir Solicitação sintética <em>de teste</em>', exact: true }).click();
  await page.getByRole('link', { name: 'Excluir solicitação', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Excluir solicitação?' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar exclusão' }).click();
  await expect(page).toHaveURL(/\/solicitacoes\?excluida=1$/);
  expect((await page.request.get(path)).status()).toBe(404);
});

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('navegação e formulário disponíveis sem JavaScript', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
    await page.getByRole('navigation').getByRole('link', { name: 'Solicitações', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Solicitações', exact: true })).toBeVisible();
    const path = await create(page);
    await page.getByRole('link', { name: 'Excluir solicitação', exact: true }).click();
    await page.getByRole('link', { name: 'Cancelar' }).click();
    expect((await page.request.get(path)).status()).toBe(200);
  });
});
