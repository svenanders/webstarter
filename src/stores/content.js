const {extendObservable, observable} = require('mobx');
import config from '../config/index';
const engine = require('store/src/store-engine');
const storages = [
  require('store/storages/localStorage'),
  require('store/storages/cookieStorage')
];
const plugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
];
const store = engine.createStore(storages, plugins);
import json from '../content/text.json';
import fetch from 'unfetch';

/**
 * @class ContentStore
 */

export default class ContentStore {
  constructor(request, state = {}) {
    extendObservable(this, {
      request,
      content: observable.shallowObject(store.get('content') ? store.get('content') : json)
    }, state);

    const data = {...store.get('content')};
  }

  put(key, {title, content}) {
    store.set('content', {...store.get('content'), [key]: {title, content}});
    this.content = {...store.get('content'), [key]: {title, content}};
    this.storeContentToRedis();
  }

  storeContentToRedis() {
    this.putContent({key: "content", value: this.content})
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  getContent() {
    const opts = {
      method: 'GET',
      headers: {
        "Content-type": "application/json",
        "phrase": Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)
      }
    };
    return fetch('/api/content', opts)
      .then(response => response.json())
      .then(json => {
        this.content = json.data;
        store.set('content', {...this.content});
      });
  }

  putContent(data) {
    const opts = {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
        "phrase": Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)
      },
      body: JSON.stringify({key: data.key, value: {...data.value}})
    };
    return fetch('/api/content', opts)
      .then(response => response)
  }

  delete(key) {
    const data = {...store.get('content')};
    delete data[key];
    store.set('content', {...data});
    this.content = {...data};
    this.storeContentToRedis();
  }

  getByKey(key) {
    if (this.content[key]) {
      return this.content[key];
    } else {
      return {title: '', content: ''}
    }
  }

  get() {
    return this.content;
  }

};

