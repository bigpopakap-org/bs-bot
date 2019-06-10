import express from "express";
import RestypedRouter from "restyped-express-async";
import BsBotApi from "../shared/types/bs-bot-api-restyped";
import HttpStatus from 'http-status-codes';
// TODO figure out why absolute path imports aren't working here
import {fillTemplate, randomWordProvider} from '../shared/bs';
import VOCABS, {VocabName} from '../shared/vocab';
import randomItem from 'random-item';

import WordStorage from './storage/words';

const wordStorage = new WordStorage();

const app = express();
const router = RestypedRouter<BsBotApi>(app);

router.get("/bs", async request => {
  const vocabName = request.query.vocabName;
  const vocab = VOCABS.get(vocabName);
  const template = randomItem(vocab.templates);
  return {
    bs: fillTemplate(template, randomWordProvider(vocab))
  };
});

router.get('/vocabName', async request => {
  return {
    vocabNames: <Array<VocabName>> Object.keys(VocabName)
  }
});

/* ************************************************************************
                            INTERACT WITH WORDS
 ************************************************************************ */
router.get('/word/:id', async request => {
  return wordStorage.get(request.params.id);
});

router.put('/word/:id', async (request, response) =>  {
  const id = request.params.id;
  const updatedWord = request.body;

  if (id !== updatedWord.id) {
    response.status(HttpStatus.BAD_REQUEST).end();
  } else {
    wordStorage.update(updatedWord);
  }
});

router.delete('/word/:id', async request => {
  wordStorage.delete(request.params.id);
});

router.post('/word', async request => {
  return wordStorage.insert(request.body);
});

router.get('/words', async request => {
  return wordStorage.search(request.query);
});

router.post('/words', async request => {
  return wordStorage.insertAll(request.body);
});

router.put('/words', async request => {
  wordStorage.updateAll(request.body);
});

router.delete('/words', async request => {
  wordStorage.deleteAll(request.query.ids);
});

// Lastly, handle any unknown requests with a 404
app.get('*', async (request, response) => {
  response.status(404).end();
  return;
});

export default app;
