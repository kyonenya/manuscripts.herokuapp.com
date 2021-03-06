import assert from 'assert';
import fetch from 'node-fetch';
import { uid, getIdToken } from '../firebaseAdmin';

describe('Api', async () => {
  const uuid = '8cb4f18cccdf4422b54010fd96711ee7';
  const baseUrl = `http://localhost:${process.env.PORT || 3000}`;
  //  const baseUrl = 'https://manuscripts.herokuapp.com';
  const entry = {
    text: '本文',
    tags: ['タグ1', 'タグ2'],
    uuid,
  };

  it('Create', async () => {
    const idToken = await getIdToken(uid);
    const result = await fetch(`${baseUrl}/api/entries/${uuid}`, {
      method: 'POST',
      body: JSON.stringify(entry),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer: ${idToken}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
    assert.strictEqual(result.text, entry.text);
    assert.deepStrictEqual(result.tags, entry.tags);
  });

  it('ReadOne', async () => {
    const idToken = await getIdToken(uid);
    const result = await fetch(`${baseUrl}/api/entries/${uuid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer: ${idToken}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
    assert.strictEqual(result.text, entry.text);
    assert.deepStrictEqual(result.tags, entry.tags);
  });

  it('ReadAll limit=3', async () => {
    const idToken = await getIdToken(uid);
    const limit = 3;
    const result = await fetch(`${baseUrl}/api/entries?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer: ${idToken}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].text, entry.text);
  });

  it('keywordSearch', async () => {
    const idToken = await getIdToken(uid);
    const q = encodeURI('。');
    const limit = 3;
    const result = await fetch(`${baseUrl}/api/entries?q=${q}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer: ${idToken}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
    assert.strictEqual(result.length, 3);
  });

  it('Update', async () => {
    const idToken = await getIdToken(uid);
    const entry2 = {
      text: '更新された本文',
      tags: ['更新されたタグ1', '更新されたタグ2'],
      starred: true,
      uuid,
    };
    const result = await fetch(`${baseUrl}/api/entries/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify(entry2),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer: ${idToken}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
    assert.strictEqual(result.uuid, uuid);
    assert.deepStrictEqual(result.tags, entry2.tags);
    assert.strictEqual(result.text, entry2.text);
    assert.strictEqual(result.starred, entry2.starred);
  });

  it('Delete', async () => {
    const idToken = await getIdToken(uid);
    const result = await fetch(`${baseUrl}/api/entries/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer: ${idToken}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));
    assert.strictEqual(result, uuid);
  });
});
