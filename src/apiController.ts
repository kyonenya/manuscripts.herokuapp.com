import { RequestHandler } from 'express';
import createError from 'http-errors';
import { pool } from './postgres';
import * as apiRequest from './apiRequest';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';
import { Either } from './Either';

export const readAllEntries: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.selectAll(await pool.connect());

  const params = apiRequest.limitQuery(req);
  const data = await dbInvoker(params);
  res.json(data);
//  console.log(createError(404));
};

export const readOneEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.selectOne(await pool.connect());

  const uuid = apiRequest.uuidParams(req);
  const data = await dbInvoker({ uuid });
  res.json(data);
};

export const createNewEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.insertOne(await pool.connect());

  const entry = apiRequest.entitize(req.body);
  const result = await dbInvoker(entry);
  res.json(result);
}

export const updateEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.updateOne(await pool.connect());

  const entry = apiRequest.entitize(req.body);
  const result = await dbInvoker(entry);
  res.json(result);
};

export const deleteEntry: RequestHandler = async (req, res) => {
  const entriesInvoker = entriesRepository.deleteOne(await pool.connect());
  const tagsInvoker = tagsRepository.deleteAll(await pool.connect());

  const uuid = apiRequest.uuidParams(req);
  Promise.all([entriesInvoker({ uuid }), tagsInvoker({ uuid })])
    .then(results => {
      console.log(results);
      res.json(results[0]);
    })
    ;
};
