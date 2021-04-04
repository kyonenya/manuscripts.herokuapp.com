import assert from 'assert';
import { getClient } from '../postgres';
import * as tagsRepository from '../tagsRepository';
import { v4 as uuidv4 } from 'uuid';

describe('tagsRepository', () => {
  const uuid = uuidv4().replace(/-/g, '');
  const tags = ['タグA', 'タグB'];
  console.log(`testing... uuid:${uuid}`);

  it('insertAll', async () => {
    const dbInvoker = tagsRepository.insertAll(await getClient());
    await dbInvoker(tags, uuid);
  });
  it('selectAll', async () => {
    const dbInvoker = tagsRepository.selectAll(await getClient());
    await dbInvoker(uuid);
  });
  it('deleteAll', async () => {
    const dbInvoker = tagsRepository.deleteAll(await getClient());
    await dbInvoker(uuid);
  });
});
