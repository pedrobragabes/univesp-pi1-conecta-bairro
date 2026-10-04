import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

test('layout, contraste, indicadores e foco sem violar CSP', async ({ page }, info) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const [name, url] of [['home', '/'], ['list', '/solicitacoes'], ['form', '/solicitacoes/nova'], ['about', '/sobre'], ['detail', '/solicitacoes/1'], ['confirmation', '/solicitacoes/1/excluir']]) {
    await page.goto(url);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).analyze();
    await writeFile(info.outputPath(`axe-${name}.json`), JSON.stringify(result.violations, null, 2));
    expect(result.violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true });
  }
  expect(errors).toEqual([]);
  await page.goto('/');
  await expect(page.getByRole('progressbar', { name: 'Proporção de solicitações abertas' })).toHaveAttribute('max', /[1-9]/);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#conteudo')).toBeFocused();
});
